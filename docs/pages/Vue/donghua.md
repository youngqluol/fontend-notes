### 单元素/组件的过渡
##### Vue封装了一个`transition`组件
- 用`transition`组件将单元素或者组件包裹起来，就可以实现过渡效果（*进入、离开*）
##### 4种情形
- 条件渲染（v-if）
- 条件展示（v-show）
- 动态组件
- 组件根节点
##### Vue的处理
- 自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。
- 如果过渡组件提供了 JavaScript 钩子函数，这些钩子函数将在恰当的时机被调用。
- 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。
##### 6个过渡类名
- `v-enter`:定义进入过渡的开始状态。(在元素被插入之前生效，在元素被插入之后的下一帧移除)
- `v-enter-active`:定义进入过渡生效时的状态。(在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数)
- `v-enter-to`:2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
- `v-leave`:定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
- `v-leave-active`:定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
- `v-leave-to`:2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。
##### 默认类名前缀和自定义类名前缀
- 如果你使用一个没有名字的 `<transition>`，则 v- 是这些类名的默认前缀。如果你使用了 `<transition name="my-transition">`，那么 `v-enter` 会替换为 `my-transition-enter`。

##### CSS过渡
```html
<template>
    <transition name="fade">
      <div v-if="go">看我怎么没的</div>
    </transition>
    <div @click="go = !go">点我</div>
</template>

<style lang="less" scoped>
  .fade-enter, .fade-leave-to {
      transform: translate(50px, 50px);
      opacity: 0;
  }
  .fade-enter-active {
      transition: all .5s ease-in;
  }
  .fade-leave-active {
      transition: all .5s ease-out;
  }
</style>
```
##### CSS动画
- CSS 动画用法同 CSS 过渡，区别是在动画中 v-enter 类名在节点插入 DOM 后不会立即删除，而是在 animationend 事件触发时删除。

```css
<style lang="less" scoped>
  .fade-enter-active {
  animation: bounce-in .5s;
}
.fade-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

##### 自定义过渡的类名
优先级高于普通的类名
- `enter-class`
- `enter-active-class`
- `enter-to-class`
- `leave-class`
- `leave-active-class`
- `leave-to-class`

```html
<!--可以结合Animate.css使用-->
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

##### 显性的过渡持续时间

用 `<transition>` 组件上的 duration 属性定制一个显性的过渡持续时间 (以毫秒计)：

```html
<transition :duration="1000">...</transition>
<!--或者-->
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

##### JavaScript钩子

```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```
```js
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

- *当只用 JavaScript 过渡(也就是说用钩子函数控制过渡)的时候，在 `enter` 和 `leave` 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成。*
- *仅使用 JavaScript 过渡的元素时添加 `:css="false"`，Vue 会跳过 CSS的检测。这也可以避免过渡过程中 CSS 的影响。*


##### 初始渲染的过渡

```html
<transition appear>
  <!-- ... -->
</transition>
```
- appear可以自定义类名

```html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

- appear可以自定义钩子

```html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

### 多个元素的过渡

- *当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。即使在技术上没有必要，给在 `<transition> `组件中的多个元素设置 key 是一个更好的实践。(加key值很重要)*
- `position：absolute`有时候也很重要

```js
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

- 过渡模式
    - 进入和离开同时发生，这是 `<transition>`的默认行为 
    - 同时生效的进入和离开的过渡不能满足所有要求，所以 `Vue` 提供了 过渡模式
    
```js
`in-out`：新元素先进行过渡，完成之后当前元素过渡离开。

`out-in`：当前元素先进行过渡，完成之后新元素过渡进入。
```

##### 多个组件的过渡
- 多个组件的过渡 需要使用动态组件,其他与之前类似：

```html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

##### 列表过渡
- 使用 `<transition-group>` 组件可以同时渲染整个列表，（比如 v-for ）。关于这个组件的几个特点：
1. 不同于 `<transition>`，它会以一个真实元素呈现：默认为一个 `<span>`。你也可以通过 tag 特性更换为其他元素。
2. 过渡模式不可用，因为我们不再相互切换特有的元素。
3. 内部元素 总是需要 提供唯一的 key 属性值。
4. CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。

##### 列表的排序过渡

- `<transition-group>` 组件还有一个特殊之处。不仅可以进入和离开动画，还可以改变定位。要使用这个新功能只需了解新增的 `v-move `特性，它会在元素的改变定位的过程中应用。

```html
<transition-group name="flip-list" tag="ul">
    <li v-for="item in items":key="item">
      {{ item }}
    </li>
 </transition-group>
```

```css

.flip-list-move {
  transition: transform 1s;
}

```

### 状态过渡

Vue 的过渡系统提供了非常多简单的方法设置进入、离开和列表的动效。那么对于数据元素本身的动效呢，比如：
 - 数字和运算
 - 颜色的显示
 - SVG 节点的位置
 - 元素的大小和其他的属性
 
这些数据要么本身就以数值形式存储，要么可以转换为数值。有了这些数值后，我们就可以结合 Vue 的响应式和组件系统，使用第三方库来实现切换元素的过渡状态。

