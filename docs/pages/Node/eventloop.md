参考资料： 
- [官方文档](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
- [掘金](https://juejin.im/post/6844903999506923528)

#### 什么是事件循环

事件循环是指`Node.js`执行非阻塞I/O操作。`Node.js`会尽可能将操作装载到系统内核。因此它们可以处理在后台执行的多个操作。当其中一个操作完成时，内核会告诉`Node.js`，以便`Node.js`可以将相应的回调添加到轮询队列中以最终执行。

##### 六个阶段

 1. `timers` 阶段: 这个阶段执行 `setTimeout(callback)` 和 `setInterval(callback)` 预定的 `callback`;
 2. `I/O callbacks` 阶段: 此阶段执行某些系统操作的回调，例如`TCP`错误的类型。 例如，如果`TCP`套接字在尝试连接时收到 `ECONNREFUSED`，则某些`linix`系统希望等待报告错误。 这将操作将等待在`I/O`回调阶段执行;
 3. `idle, prepare` 阶段: 仅`node`内部使用;
 4. `poll` 阶段（**轮询阶段**）: 获取新的I/O事件, 例如操作读取文件等等，适当的条件下`node`将阻塞在这里;
 5. `check` 阶段: 执行 `setImmediate()` 设定的`callbacks`;
 6. `close callbacks` 阶段: 比如 `socket.on(‘close’, callback)` 的`callback`会在这个阶段执行;

#### 事件循环详解

##### NodeJs分为四层：

1. `应用层`：即 JavaScript 交互层，常见的就是 Node.js 的模块，比如 http，fs
2. `V8引擎层`：即利用 V8 引擎来解析JavaScript 语法，进而和下层 API 交互
3. `NodeAPI层`：为上层模块提供系统调用，一般是由C语言来实现，和操作系统进行交互 
4. `LIBUV层`： 是跨平台的底层封装，实现了 事件循环、文件操作等，是 Node.js 实现异步的核心 。

......todo

#### 案列解析

##### 1. nextTick和setImmediate

`nextTick`:  不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调。有给人一种插队的感觉.

`setImmediate`: 回调处于check阶段, 当poll阶段的队列为空, 且check阶段的事件队列存在的时候，切换到check阶段执行.

##### 2.setImmediate与setTimeout、setInterval

如果在一个**I/O周期**（异步）内进行调度，setImmediate()将始终在任何定时器（setTimeout、setInterval）之前执行.

- 无 **I/O** （异步）处理情况下：

```js
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});

// 执行结果：印输出出来的结果，并没有什么固定的先后顺序，偏向于随机
```

**解释**：首先进入的是timers阶段，如果我们的机器性能一般，那么进入timers阶段，1ms已经过去了 ==(setTimeout(fn, 0)等价于setTimeout(fn, 1))==，那么setTimeout的回调会首先执行。
如果没有到1ms，那么在timers阶段的时候，下限时间没到，setTimeout回调不执行，事件循环来到了poll阶段，这个时候队列为空，于是往下继续，先执行了setImmediate()的回调函数，之后在下一个事件循环再执行setTimemout的回调函数。（这里是不是说反了？）

- 有 **I/O** （异步）处理情况下：

```js
const fs = require('fs')

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    setImmediate(() => {
        console.log('immediate');
    });
});
或者
setTimeout(() => {
    setImmediate(() => {
        console.log('setImmediate');
    });
    setTimeout(() => {
        console.log('setTimeout');
    }, 0);
}, 0);

// 执行结果：不管多少次，结果都输出 immediate timeout
```

**解释**：fs.readFile的回调是在poll阶段执行的，当其回调执行完毕之后，poll队列为空，而setTimeout入了timers的队列，此时有代码 setImmediate()，于是事件循环先进入check阶段执行回调，之后在下一个事件循环再在timers阶段中执行回调。

**总结**：

- 如果两者都在主模块中调用，那么执行先后取决于进程性能，也就是你的电脑好撇，当然也就是随机。
- 如果两者都不在主模块调用（被一个异步操作包裹），那么**setImmediate的回调永远先执行**。

##### 3. nextTick与promise

**概念**：对于这两个，我们可以把它们理解成一个微任务。也就是说，它其实不属于事件循环的一部分。 那么他们是在什么时候执行呢？ 不管在什么地方调用，他们都会在其所处的事件循环最后，事件循环进入下一个循环的阶段前执行。