#### 1. this.$data 和 this.$options.data()

`this.$data`： 获取当前状态下的data

`this.$options.data()`: 获取该组件初始状态下的data

初始化状态： 

```js
Object.assign(this.$data, this.$options.data())
```

如果只想初始化某一个值：

```js
this[属性名] = this.$options.data()[属性名]
// 如this.message = this.$options.data().message
```

如果data()里用this获取props或method，写法如下：

```js
 Object.assign(this.$data, this.$options.data.call(this));
```