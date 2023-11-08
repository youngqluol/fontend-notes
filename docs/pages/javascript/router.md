#### 单页面
运用这些单页面框架之后， HTML 页面基本上只有一个 DOM 入口，大致如下所示：
```html
<div id="app"></div>

<script src="app.js"></script>
```

所有的页面组件，都是通过运行上图底部的app.js脚本，挂载到这个节点id为app下面。用一个极其简单的 JS 展示挂载这一个步骤：

```html
<<body>
  <div id="root"></div>
  <script>
    const root = document.getElementById('root') // 获取根节点
    const divNode = document.createElement('div') // 创建 div 节点
    divNode.innerText = '你妈贵姓？' // 插入内容
    root.appendChild(divNode) // 插入根节点
  </script>
</body>
```

前端路由会根据浏览器地址栏pathname的变化，去匹配相应的页面组件。然后将其通过创建 DOM 节点的形式，塞入根节点。

#### 原理（哈希模式和历史模式）

##### 一、 哈希模式

浏览器地址上 # 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 `hashchange`

实现一个 hash 模式的简易路由:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hash 模式</title>
</head>
  <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  <script type="text/javascript">
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('hashchange', HashChange)
    // 展示页面组件的节点
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      HashChange()
    }
    function HashChange() {
      // 每次触发 hashchange 事件，通过 location.hash 拿到当前浏览器地址的 hash 值
      // 根据不同的路径展示不同的内容
      switch(location.hash) {
      case '#/page1':
        routeView.innerHTML = 'page1'
        return
      case '#/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
  </body>
</html>
```

##### 二、历史模式

history 模式依赖的是原生事件 `popstate`

几个重要方法（window.history对象下）：

1. pushState 和 replaceState （不会触发popstate）
2. back 、forward 、go（可以触发popstate）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>History 模式</title>
</head>
<body>
  <div>
    <ul>
      <li><a href="/page1">page1</a></li>
      <li><a href="/page2">page2</a></li>
    </ul>
    <div id="route-view"></div>
  </div>
  <script type="text/javascript">
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('popstate', PopChange)
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      // 默认执行一次 popstate 的回调函数，匹配一次页面组件
      PopChange()
      // 获取所有带 href 属性的 a 标签节点
      var aList = document.querySelectorAll('a[href]')
      // 遍历 a 标签节点数组，阻止默认事件，添加点击事件回调函数
      aList.forEach(aNode => aNode.addEventListener('click', function(e) {
        e.preventDefault() //阻止a标签的默认事件
        var href = aNode.getAttribute('href')
        //  手动修改浏览器的地址栏
        history.pushState(null, '', href)
        // 通过 history.pushState 手动修改地址栏，
        // popstate 是监听不到地址栏的变化，所以此处需要手动执行回调函数 PopChange
        PopChange()
      }))
    }
    function PopChange() {
      console.log('location', location)
      switch(location.pathname) {
      case '/page1':
        routeView.innerHTML = 'page1'
        return
      case '/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
</body>
</html>
```