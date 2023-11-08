#### 关于 **Proxy**
主要用于改变某些操作的默认行为，proxy在目标对象的外层搭建了一层拦截，外界对目标对象的某些操作，必须通过这层拦截。

支持13 种的拦截,相对Object.defineProperty更加丰富

此方法接受两个参数：
- **target** — 要使用 Proxy 包装(处理)的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
- **handler** — 通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

**基本用法**

- 数据拦截

先定义proxy原型

```js
let target = {};
let handler = {
  // 拦截对象属性的读取，比如proxy.a和proxy['a']
  get (target, key) {
    console.info(`Get on property "${key}"`);
    return target[key];
  },
  // 拦截对象属性的设置，比如proxy.a = 1 和proxy['a'] = 1
  set (target, key, value) {
    console.info(`Set on property "${key}" new value "${value}"`);
    target[key] = value;
  },
  // 拦截propKey in proxy 返回布尔值
  has (target, key) {
    console.log(`is "${key}" in object ?`);
    // 隐藏 某些属性
    if( key === 'a'){
      return false;
    }else{
      return key in target;
    }
    // return key in target;
  },
  // delete 操作符的捕捉器 删除前拦截 进行处理 返回布尔值
  deleteProperty(target, key){
    console.log(`delete key: "${key}"`);
    if(key === 'a'){
        delete target[key];
    }else{
        return target[key];
    }
  },
  // 拦截对象自身属性的读取操作，具体拦截以下操作：Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols object.keys() 
  ownKeys (target) {
    console.log(`key in target`)
    // (1)  正常返回
    // return Reflect.ownKeys(target);
    // （2）error 'ownKeys' on proxy: trap result did not include 'd'
    //  enumerable 的属性必须在数组中返回
    // return ['b'] 
    // (3) 
    return ['b','d']
  },
}

// 还有其他的拦截，这里不赘述
```

再new一个proxy实例,再我们对这个对象进行操作时会触发相应的之前定义的行为

```js
let proxy = new Proxy(target, handler);

proxy.a = 1;         //  Set on property "a" new value "1"
proxy.b = 2;         //  Set on property "b" new value "2"

console.log(proxy.a);//  Get on property "a"      //  1

console.log("a" in proxy );// is "a" in object ?  // false
console.log("b" in proxy );// is "b" in object ?  // true

delete proxy.a; // delete key: "a"
console.log(proxy.a);// Get on property "a" // undefined
delete proxy.b; // delete key: "b"
console.log(proxy.b);// Get on property "b" // 2
```

#### proxy与双向数据绑定实现

```html
<div>
    <input type="text" id="value"/>
    <span id="bindValue"></span>
</div>
```

```js

let inputEle = document.getElementById('value');
let spanEle = document.getElementById('bindValue');
const MessageObj = {};
let basehandler = {
    set(target, key, newVal){
        target[key] = newVal
        spanEle.innerText = newVal
    }
}
let proxy = new Proxy(MessageObj, basehandler)
// 监听input输入
inputEle.addEventListener('keyup', function (event) {
    proxy.msg = event.target.value
})

```

#### 与vue2.0响应式的不同

vue3.0 摒弃了`Object.defineProperty()` 而采用了 proxy

- defineProperty() 只能监听某个属性，不能对全对象监听,proxy监听整个对象，并返回一个新对象，可以省去for in、闭包等内容来提升效率。

```js
let obj1 = {
    a: 1,
    b: 2,
}
// proxy 写法
let proxy1 = new Proxy(obj1, {
    set (target, key, value){
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    },
    get (target, key){
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    }
})
// Object.defineProperty() 写法
function observe(data){
    if(!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
}
function defineReactive(data, key, val){
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, 
        configurable: true, 
        get: function() {
            console.log(key + '值获取')
            return val;
        },
        set: function(newVal) {
            console.log(key + '值设置', val, ' --> ', newVal);
            val = newVal;
        }
    });
}
observe(obj1);
console.log(obj1.a);
console.log(obj1.b);
obj1.a = 12;

```
- 可以监听数组，不用再去单独的对数组做特异性操作。

```js
let arr = [1,2,3];
let p = new Proxy(arr, {
  get(target, key,) {
    console.log('获取数组属性',target,key)
    return target[key];
  },
  set(target, key, value) {
    console.log('设置数组属性',key,+','+target[key] + ' -->' + value )
    target[key] = value;
    return true;
  }
})
console.log(p) // Proxy {0: 1, 1: 2, 2: 3}
p.push(4);  
// 发生四步骤：（1）获取数组属性 (3) [1, 2, 3] push
//           （2）获取数组属性 (3) [1, 2, 3] length
//           （3）设置数组属性 3 NaN -->4
//           （4）设置数组属性 length NaN -->4
console.log('++') // 设置数组属性 0 NaN -->10
p[0] = 10;
console.log('-----------');
let arrObj = {
   b:1,
}
let bValue = arrObj.b;
Object.defineProperty(arrObj, "b", {
    enumerable: true, 
    configurable: true, 
    get: function() {
        let key = "b"
        console.log(key + '值获取', bValue)
        return bValue;
    },
    set: function(newVal) {
        let key = "b"
        console.log(key + '值设置 --> ', newVal);
        bValue = newVal;
        return bValue
    }
})
console.log(arrObj.b) // 1
arrObj.b = [1,2,3];  // b值设置 -->  (3) [1, 2, 3]
arrObj.b.push(4);  // b值获取 (3) [1, 2, 3] 只获取了旧值 设置push没有监听到
arrObj.b[0] = 10;  // b值获取 (4) [1, 2, 3, 4]  只获取了旧值 b[0]设置没有监听到
```




