## 防抖 debounce

`规定的时间段内，多次触发，只执行最后一次`

**实现**： 将目标方法（动作）包装在setTimeout里面，方法调用之前，先clearTimeout，将事件内的连续动作删掉，待到用户不触发这事件了。那么setTimeout就自然会执行这个方法。这个方法是一个事件的回调函数，如果这个回调一直执行，那么这些动作就一直不执行，这样setTimeout里的方法就不会执行！ 

**场景**：可用于input输入框架的格式验证，假如只是验证都是字母也罢了，太简单了，不怎么耗性能，如果是验证是否身份证，这性能消耗大，你可以隔170ms才验证一次。这时就需要这个东西。或者你这个是自动完全，需要将已有的输入数据往后端拉一个列表，频繁的交互，后端肯定耗不起，这时也需要这个，如隔350ms。

```js
function debounce(func, delay) {
  let timeout = null;
  return function(...params) {
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...params);
      clearTimeout(timeout);
    }, delay);    
  }
}
```

## 节流 throttle

方法在`某个时间段内`只执行一次

**实现**： 需要保存上次执行的时间点，与现在的时间点进行对比，如果小于规定的时间，则不执行

```js
// 时间戳版
function throttle(func, delay) {
  let now = Date.now();
  return function(...params) {
    if(Date.now - now < delay) return;
    now = Date.now();
    func(...params);
  }
}

// 定时器版
function throttle(func, delay) {
  let timer = null;
  return function(...params) {
    if(timer) return;
    func(...params);
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
    }, delay)
  }
}
```

