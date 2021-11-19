#### 一、如何在node中使用ES6导入导出

两种方法：

1. 文件后缀改为`.mjs`
2. 在`package.json`中指定`type`字段为`module`:

```js
{
   "type": "module"
}
```

如果这时还需要使用`CommonJs`模块，需要将`CommonJs`脚本后缀名改为`.cjs`

总结为一句话：`.mjs`文件总是以 `ES6` 模块加载，`.cjs`文件总是以 `CommonJS` 模块加载，`.js`文件的加载取决于`package.json`里面`type`字段的设置。

参考：[Node.js 如何处理 ES6 模块](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)

也可以这样？：实践发现不行
```js
const slash = import('slash')
```

#### 二、npm link

模拟包安装后的状态：在系统中做一个快捷方式映射，让本地的包好像install过一样，可以直接使用。

##### 使用：

参考：[npm link详解](https://champyin.com/2019/08/27/npm-link%E8%AF%A6%E8%A7%A3/)

### 三 npm install  生命周期

在执行 install 的时候会按生命周期顺序执行相应钩子： NPM7：

preinstall -> install -> postinstall -> prepublish -> preprepare -> prepare -> postprepare