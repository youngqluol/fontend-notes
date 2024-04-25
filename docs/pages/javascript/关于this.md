### 为什么要用this

显式传递`上下文对象`会让代码变得越来越混乱，`this`可以隐式传递一个对象引用。

### this是什么

`this`是在`运行时`进行绑定的，并不是在`编写时`绑定，它的`上下文`取决于函数调用时的各种条件。`this`的绑定和函数声明的位置没有任何关系，只取决于函数的`调用方式`。当一个函数被调用时，会创建一个`活动记录（有时候也称为执行上下文）`。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。`this`就是这个记录的一个属性，会在函数执行的过程中用到。

`this`实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

### 绑定规则

#### 1. 默认绑定

无法应用其他规则时的默认规则

独立函数调用（在全局作用域下，直接使用不带任何修饰的函数引用进行调用），如：

```js
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

#### 2. 隐式绑定

看调用位置是否有上下文对象，或者说是否被某个对象`拥有`或者`包含`，如：

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

调用位置会使用`obj上下文`来引用函数，因此你可以说函数被调用时obj对象`“拥有”`或者`“包含”`它。

当函数引用有上下文对象时，隐式绑定规则会把函数调用中的`this`绑定到这个上下文对象。


**注意**：  对象属性引用链中只有`上一层`或者说`最后一层`在调用位置中起作用。如：


```js
function foo() {
    console.log(this.a);
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42
```

**隐式丢失问题**

一个最常见的`this`绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用`默认绑定`，从而把`this`绑定到`全局对象`或者`undefined`上，取决于是否是严格模式。

如：

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名！

var a = "oops, global"; // a是全局对象的属性

bar(); // "oops, global"
```

虽然bar是obj.foo的一个引用，但是实际上，它引用的是`foo函数`本身，因此此时的bar()其实是`一个不带任何修饰的函数调用`，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo() {
    console.log(this.a);
}

function doFoo(fn) {
    // fn其实引用的是foo

    fn(); // <-- 调用位置！
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a是全局对象的属性

doFoo(obj.foo); // "oops, global"
```

`参数传递`其实就是一种`隐式赋值`，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。如果把函数传入语言内置的函数而不是传入你自己声明的函数，会发生什么呢？结果是一样的，没有区别：

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a是全局对象的属性

setTimeout(obj.foo, 100); // "oops, global"
```

JavaScript环境中内置的setTimeout()函数实现和下面的伪代码类似：

```js
function setTimeout(fn, delay) {
    // 等待delay毫秒
    fn(); // <-- 调用位置！
}
```

#### 3. 显式绑定

**3.1 call和apply**

它们的第一个参数是一个对象，是给this准备的，接着在调用函数时将其绑定到this。因为你可以直接指定this的绑定对象，因此我们称之为`显式绑定`。


**3.2 硬绑定**

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a:2
};

var bar = function() {
    foo.call(obj);
};

bar(); // 2
setTimeout(bar, 100); // 2

// 硬绑定的bar不可能再修改它的this
bar.call(window); // 2
```

这种绑定是一种`显式的强制绑定`，因此我们称之为`硬绑定`。

由于`硬绑定`是一种非常常用的模式，所以ES5提供了内置的方法`bind`。

#### 4. new绑定

使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：

- 创建（或者说构造）一个全新的对象。

- 这个新对象会被执行[[Prototype]]连接。

- 这个新对象会绑定到函数调用的this。

- 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

模拟实现：

```js
/**
 * new模拟实现
 */
function myNew() {
    //#1 创建一个空对象
    let obj = Object.create({});
    
    //#2 取出构造函数
    let Constructor = Array.prototype.shift.call(arguments);
​
    //#3 改变新对象的隐式指向
    obj.__proto__ = Constructor.prototype;
    // 或
    obj = Object.create(Constructor.prototype);
​
    //#4 调用构造函数，返回结果
    res = Constructor.apply(obj, arguments);
​
    //#5 对结果进行判断(是否是引用型)
    return res instanceof Object ? res : obj;
}

// 调用示例：
let instance = myNew(Function, arg);

```

#### 5. 优先级

- new
- call/apply(显式绑定)或者硬绑定
- 隐式绑定
- 默认绑定

### 绑定例外

如果你把`null`或者`undefined`作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则：

```js
function fn() {
    console.log(this.a);
}

var a = 2;

fn.call(null); // 2
```

如果函数并不关心this的话，你仍然需要传入一个占位值，这时`null`可能是一个不错的选择

#### 箭头函数

ES6中的箭头函数并不会使用以上四条标准的绑定规则，而是根据当前的词法作用域来决定this，具体来说，箭头函数会继承`外层函数调用的this绑定（无论this绑定到什么）`。这其实和ES6之前代码中的`self = this`机制一样。

```js
function foo() {
    // 返回一个箭头函数
    return (a) => {
      //this继承自foo()
      console.log(this.a);
    };
}

var obj1 = {
    a:2
};

var obj2 = {
    a:3
};

var bar = foo.call(obj1);
bar.call(obj2); // 2, 不是3！
```

`foo()`内部创建的箭头函数会捕获调用时`foo()`的`this`。由于`foo()`的`this`绑定到`obj1`, `bar（引用箭头函数`）的`this`也会绑定到`obj1`，箭头函数的绑定无法被修改。（new也不行！）