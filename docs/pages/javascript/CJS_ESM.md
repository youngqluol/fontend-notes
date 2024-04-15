## CommonJs

最早于`2009`年由Ryan Dahl在创建`Node.js`时引入

### require函数

伪代码实现：

```js
function require(modulePath) {
  // 1.根据传递的模块路径，得到模块完整的绝对路径
  var moduleId = getModuleId(modulePath);
  // 判断缓存
  if(cache[moduleId]) {
    return cache[moduleId];
  }
  // 3. 真正运行模块代码的辅助函数
  function _require(exports, require, module, __filename, __dirname) {
    // 目标模块的代码在这里
  }
  // 4. 准备并运行辅助函数
  var module = {
    exports: {}
  }
  var exports = module.exports;
  // 得到模块文件的绝对路径
  var __filename = moduleId;
  // 得到模块所在目录的绝对路径
  var __dirname = getDirname(__filename);
  _require.call(exports, exports, require, module,  __filename, __dirname);
  // 缓存 module.exports
  cache[moduleId] = module.exports;
  return module.exports;
}
```

使用场景： `node`、`webpack`环境下

二者区别：`webpack`中的`require`函数是在`nodejs`中的`require`函数的基础上进行了扩展

### module.exports 和 exports

`module.exports`属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取`module.exports`变量。

Node为每个模块提供一个`exports`变量，指向`module.exports`。

### 怎么处理循环引入？

在加载过程中会将该模块的 `require属性`(`module.require`)设置为一个正在加载的标记，防止重复加载。当加载完成后，该属性会被设置为 `null`，表示加载完成。

如果发生模块的循环加载，即A加载B，B又加载A，则B将加载A的不完整版本。

```js
// a.js
exports.x = 'a1';
console.log('a.js ', require('./b.js').x);
exports.x = 'a2';

// b.js
exports.x = 'b1';
console.log('b.js ', require('./a.js').x);
exports.x = 'b2';

// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

上面代码是三个JavaScript文件。其中，`a.js`加载了`b.js`，而`b.js`又加载`a.js`。这时，Node返回`a.js`的不完整版本，所以执行结果如下。

```zsh
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
```

修改`main.js`，再次加载`a.js`和`b.js`。


```js
// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

执行上面代码，结果如下。

```zsh
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
main.js  a2
main.js  b2
```

上面代码中，第二次加载`a.js`和`b.js`时，会直接从缓存读取`exports`属性，所以`a.js`和`b.js`内部的`console.log`语句都不会执行了。

### 判断模块是直接执行，还是被调用执行。

一、`require.main`属性

```js
// a.js
/** 
* 直接执行的时候（node a.js），返回true
* 调用执行的时候（require(./a.js)）, 返回false
*/
console.log(require.main === module);
```

二、如果在命令行下调用某个模块，比如`node a.js`，那么`module.parent`就是`null`。如果是在脚本之中调用，比如`require('./a.js')`，那么`module.parent`就是调用它的模块。

```js
// a.js
if (!module.parent) {
    // ran with `node a.js`
    app.listen(8088, function() {
        console.log('app listening on port 8088');
    })
} else {
    // used with `require('/.a.js')`
    module.exports = app;
}
```

## Es Module

### 静态语法

ES6 module 的引入和导出是静态的，`import` 会自动提升到代码的顶层 ，`import` , `export` 不能放在块级作用域或条件语句中。

### 执行特性

ES6 module 和 Common.js 一样，对于相同的 js 文件，会有缓存。

ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块。

```js
// main.js
console.log('main.js开始执行')
import say from './a'
import say1 from './b'
console.log('main.js执行完毕')
```

```js
// a.js
import b from './b'
console.log('a加载')
export default  function say (){
    console.log('hello , world')
}
```

```js
// b.js
console.log('b加载')
export default function sayhello(){
    console.log('hello,world')
}
```

执行结果

```shell
$ node main.js
a加载
b加载
main.js开始执行
main.js执行完毕
```

### import() 动态引入

`import()` 返回一个 `Promise` 对象， 返回的 `Promise` 的 then 成功回调中，可以获取模块的加载成功信息。

#### 应用场景

动态加载

```js
if(isRequire){
    const result  = import('./b')
}
```

懒加载

```js
[
   {
        path: 'home',
        name: '首页',
        component: ()=> import('./home') ,
   },
]
```

React中动态加载

```js
const LazyComponent =  React.lazy(()=>import('./text'))
function App() {
    return <React.Suspense fallback={ <div className="icon"><SyncOutlinespin/></div> } >
               <LazyComponent />
           </React.Suspense>
}
```

### import.meta

返回当前模块的元信息。这个属性返回一个对象，该对象的各种属性就是当前运行的脚本的元信息。具体包含哪些属性，标准没有规定，由各个运行环境自行决定。

#### import.meta.url

返回当前模块的 URL 路径

## CommonJs和Es Module的区别

### CommonJs

- CommonJs可以动态加载语句，代码发生在运行时
- CommonJs导出值是拷贝，可以修改导出的值

### Es Module

- Es Module是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时
- Es Module导出是引用值之前都存在映射关系，并且值都是可读的(`read-only`)，不能修改



