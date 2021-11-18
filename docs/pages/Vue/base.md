### getter和setter
- 含义：一个 getter 是一个获取某个特定属性的值的方法。一个 `setter` 是一个设定某个属性的值的方法
- 用法：你可以为预定义的或用户定义的对象定义 `getter` 和 `setter` 以支持新增的属性。定义 `getter` 和 `setter` 的语法采用对象字面量语法。

```js
第一种：
var o = {
  a: 7,
  get b() { 
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2
  }
};

console.log(o.a); // 7
console.log(o.b); // 8 返回 o.a + 1 的 getter
o.c = 50;
console.log(o.a); // 25  由  o.c 的值所设置 o.a 值的 setter

第二种：
var o = { a:0 }

Object.defineProperties(o, {
    "b": { get: function () { return this.a + 1; } },
    "c": { set: function (x) { this.a = x / 2; } }
});

o.c = 10 // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(o.b) // Runs the getter, which yields a + 1 or 6
```

### computed里的 get 和 set
 
 ```js
 computed : {//计算属性相当于data里的属性
			//什么时候执行：初始化显示/ 相关的data属性发生变化
			fullName1(){//计算属性中的get方法，方法的返回值就是属性值
				return this.firstName + ' ' + this.lastName
			},
 
			fullName3 : {
				get(){//回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
					return this.firstName + ' ' + this.lastName
				},
				set(val){//监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
					//val就是fullName3的最新属性值
					console.log(val)
					const names = val.split(' ');
					console.log(names)
					this.firstName = names[0];
					this.lastName = names[1];
				}
			}

 ```
 
 
 ### `computed` 和 `watch`
 

### 子传父的几种方式

#### 1.自定义事件

```html
在父组件中：

<ranking  @closeRanking="transfer" ></ranking>

// closeRanking是自定义事件名，transfer是父组件定义的方法
transfer (n) { // 这个n 是子组件中传回来的值
      console.log(this.size);
      this.size = n;
    },
    
在子组件中：

<div @click="$emit('closeRanking',50)">点击我传值</div>
// 通过原生事件（这里是click事件），触发父组件中的方法
```

###### 2.在组件上使用v-model

```html
在父组件中：

<ranking v-model="modelData"></ranking>

在子组件中：

<!--为了让它正常工作，这个组件内的 <input> 必须：-->
<!--将其 value 特性绑定到一个名叫 value 的 prop 上-->
props: ['value']
<!--在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出-->
<input :value="value" @input="$emit('input',$event.target.value)">
```

#### 3.使用sync修饰符

```html
sync 可以实现prop 进行“双向绑定”（父对子，子对父，来回传）

在父组件中：

<text-document
       :title.sync="title"
  ></text-document>

在子组件中：
 <button @click='setNewTitle'>更新标题</button>
 
 setNewTitle:function(){
       this.$emit('update:title', '传过去的值')
    } 
```

### 插槽

#### 1.具名插槽

```html
在父组件：
<base-layout>
  <template v-slot:header>  //可缩写为#header
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
<!--base-layout是子组件名-->

在子组件：slot有一个name属性
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

#### 2.作用域插槽

```html
在子组件中:
<span>
  <slot>{{ user.lastName }}</slot>
</span>
<!--user是定义在子组件中的-->
```

为了让 user 在父级的插槽内容中可用，我们可以将 user 作为 `<slot>` 元素的一个特性绑定上去

```html
<span>
  <slot v-bind:user="user" name="head">
    {{ user.lastName }}
  </slot>
</span>
```

绑定在 `<slot>` 元素上的特性被称为插槽 `prop`。现在在父级作用域中，我们可以给 `v-slot` 带一个值来定义我们提供的插槽 `prop`的名字：

```html
<current-user>
  <template v-slot:head="slotProps">   //slotProps是自定义的插槽prop名  可缩写为#head="slotProps"
    {{ slotProps.user.firstName }}   // 这里父级就可以访问user了
  </template>
</current-user>
```

#### 3.解构插槽prop

```html
没有解构的写法：
<current-user>
  <template v-slot:head="slotProps">   //slotProps是自定义的插槽prop名
    {{ slotProps.user.firstName }}   // 这里父级就可以访问user了
  </template>
</current-user>

解构的写法：
<current-user>
  <template v-slot:head="{ user }">   //slotProps是自定义的插槽prop名
    {{ user.firstName }}   // 这里父级就可以访问user了
  </template>
</current-user>
```

#### 4.动态插槽名

```html
<lay-out>
    <tempalte v-slot:[动态插槽名]>
    </template>
</lay-out>
```

### 用keep-alive保存动态组件状态

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component :is="currentComponent"></component>
</keep-alive>
<!--currentComponent是动态组件名-->
```

### 异步加载组件（懒加载）

1. 全局注册组件引入组件时：
```js
Vue.component('my-component', () => import('./my-async-component'))
```

2. 局部注册组件时：
```js
components: {
    'my-component': () => import('./my-async-component')
  }
```

3. 路由页引入组件时：
```js
// 1.在文件上方引入:
const myComponent = () => import('@/components/myComponent'); 

// 2.在routes里引入
routes: [
    {
      path: '/myComponent',
      name: 'myComponent',
      component:() => import('@/components/myComponent')
    }
]
```

### 混入（mixin）
混入 (mixin) 提供了一种非常灵活的方式，来分发 `Vue` 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

```js
// 定义一个混入对象
var myMixin = {
  data() {
      return {
          message: 'goodbye',
      }
  }
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

#### 在组件实例中这样引入：

```js
import myMixin from './myMixin';  // 先引入这个混入对象
mixins: [mixin]   
```

#### 当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”

```js
1.data：
在内部会进行递归合并，并在发生冲突时以组件数据优先。

2.钩子函数：
同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。

3.其他选项：
值为对象的选项，例如 methods、components 和 directives，
将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
```

#### 自定义合并策略
如果想让自定义选项以自定义逻辑合并，可以向 Vue.config.optionMergeStrategies 添加一个函数：
```js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // 返回合并后的值
}
```

### 自定义指令
有的情况下，你需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令

#### 全局注册和局部注册
```js
// 全局注册
Vue.directive('focus', {
    inserted(el) {
        el.focus();
    }
})
// 局部注册
directives: {
    focus: {
        inserted(el) {
        el.focus();
        }
    }
}

// 使用
<input v-focus>
```

#### 钩子函数
- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
- `componentUpdated`：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind`：只调用一次，指令与元素解绑时调用。

#### 钩子函数参数
- `el`:指令所绑定的元素，可以用来直接操作DOM
- `binding`: 这是一个对象，里面包含：
1. `name`：指令名，不包括 v- 前缀。
2. `value`：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
3. `oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
4. `expression`：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
5. `arg`：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
6. `modifiers`：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。

*除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。*

#### 动态指令参数
```html
<my-component v-mydirective:[argument]></my-component> 
<!--argument是动态参数，通过binding.arg得到其值-->
```

*如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。*
```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```
```js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

#### 函数简写
```js
Vue.directive('my-directive', (el,binding) => {
    console.log('函数简写');
})
// 可以在 bind 和 update 时触发相同行为，而不关心其它的钩子
```

### 渲染函数&JSX
[点击参考官方文档](https://cn.vuejs.org/v2/guide/render-function.html)
*Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。*

### 插件
#### 开发插件
```js
export default {
  install: (Vue, options) => {
    let name = options.name || '默认名字';
    // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
    Vue.prototype.$young = () => {
      console.log(name);
    };
  }
};

// 全局方法和实例方法的区别：
定义方式参考上面
调用方法方面:
全局方法:Vue.myGlobalMethod()    类似于Vue.set()
实例方法：this.$myMethods()
```

#### 使用插件
```js
// 先引入再使用插件
import young from '@/utils/plugins';
Vue.use(young, {name: '传过来的名字'});

// 使用插件内定义的方法
mounted () {
    this.$young();
  }
```

### 过滤器

#### 两种定义方式
```js
全局：（全局过滤器的定义需要始终放在vue实例化之前）
Vue.filter('vueFilter', function (value) {
    if (value > 999) {
      value = 999;
    }
    return value;   //始终要有返回值
  });
  
局部：
filters: {
    testFilter: function (value) {
      if (value.split('').length > 4) {
        value = value.split('').slice(0, 4).join('') + '...';
      };
      return value;  //始终要有返回值
    }
```

#### 两种使用方式
```html
双花括号插值：
{{test | vueFilter}}

`v-bind`表达式
<div v-bind:id="rawId | testFilter"></div>
```

#### 过滤器函数总接收表达式的值 (之前的操作链的结果) 作为 *第一个参数*

#### 过滤器可以串联
```js
{{ message | filterA | filterB }}

//在这个例子中，filterA 被定义为接收单个参数的过滤器函数,
//表达式 message 的值将作为参数传入到函数中。
//然后继续调用同样被定义为接收单个参数的过滤器函数 filterB，将 filterA 的结果传递到 filterB 中。
```
#### 过滤器是 JavaScript 函数，因此可以接收参数
```js
{{ message | filterA('arg1', arg2) }}
//这里，filterA 被定义为接收三个参数的过滤器函数。
//其中 message 的值作为第一个参数，普通字符串 'arg1' 作为第二个参数，
//表达式 arg2 的值作为第三个参数。
```