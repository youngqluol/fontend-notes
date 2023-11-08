### 原理

[原理](https://juejin.im/post/5dbed0bef265da4cff701f68)

### 开始使用
- 引入
```cmd
npm i vue-router -S
```

```js
import Router from 'vue-router'
```

#### 配置`routers`

```js
// 引入组件（路由懒加载）
const Home = () => import ('@src/components/Home')
const my_components = () => import ('@src/components/my_components')
    
Vue.use(Router)

let router = new Router({
    routers: [
        {
        path: '/',
        redirect: '/home'
        },
        {
        path: '/home',
        component: Home
        }
        {
        path: '/my_components',
        component: my_components
        }
        {
        path: '*',
        redirect: '/'
        }
    ]
})

// 导出router
export default router
```

- 向vue实例注入路由

```js

// 引入
import router from '@src/router'

// 将router注入
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
```

#### $router和$route的区别

##### this.$router：路由器对象
  - `this.$router.go(-1)`
  - `this.$router.push('/')`
##### this.$route：当前路由对象
   - `this.$route.params.username`

#### HTML

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

- 当 `<router-link>` 对应的路由匹配成功，将自动设置`class` 属性值 `.router-link-active`

### 动态路由

把某种模式匹配到的所有路由，全都映射到同个组件。

```js
//对于所有 ID 各不相同的用户，都用这个组件来渲染
routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
```

当匹配到一个路由时，参数值会被设置到 `this.$route.params`，可以在每个组件内使用。

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

可以在一个路由中设置多段“路径参数”，对应的值都会设置到 `$route.params` 中

```js
routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:username/post/:post_id', component: User }
  ]
  
  // 匹配路径：/user/evan/post/123
  // $route.params: { username: 'evan', post_id: '123' }
```

#### 监听 路由参数 变化(两种方法都是在组件内使用)

- 组件复用时，组件的生命周期函数不会触发，所以在这种情况下，相对路由参数的变化作出响应的话，你可以简单地 `watch` (监测变化) `$route` 对象

```js
watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
```

或者

```js
beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
```

#### 捕获所有路由（或`404 not found `路由）

含有通配符的路由应该放在最后,通常用于客户端 `404` 错误

```js
{
  // 会匹配所有路径
  path: '*'
}
```

如果一个路径匹配了多个路由，优先级：谁先定义的，谁的优先级就最高。

### 嵌套路由

这里的 `<router-view>` 是最顶层的出口，渲染最高级路由匹配到的组件

```html
<div id="app">
  <router-view></router-view>
</div>
```

同样地，一个被渲染组件同样可以包含自己的嵌套 `<router-view>`

```html
<div class="my-compnent">
    <router-view></router-view>
</div>
```

要在嵌套的出口中渲染组件，需要在 `VueRouter` 的参数中使用 `children` 配置：

```js
routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
```



