### 原型链和继承
##### 原型链
![原型链图片](/images/chain2.png)


##### `_proto_`(`[[prototype]]`) 和 `prototype` 的区别
- `__proto__`是每个对象都有的一个属性，而`prototype`是函数才会有的属性。
- *对象* 具有属性`_proto_`,也称为隐式原型
 (一个对象的隐式原型指向构造该对象的构造函数的原型，这也保证了实例能够访问在构造函数原型中定义的属性和方法)
- *构造函数* 具有属性 `prototype`
- 方法（`Function`）比较特殊，既是函数也是对象，所以除了有属性`__proto__`,还有属性`prototype`
- 实例函数的`_proto_`和`prototype`都指向的是原型函数
- ES5中用`Object.getPrototypeOf`函数获得一个对象的`[[prototype]]`。ES6中，使用`Object.setPrototypeOf`可以直接修改一个对象的`[[prototype]]`

##### `instanceOf`操作符
- instanceof的左值一般是一个对象，右值一般是一个构造函数，用来判断左值是否是右值的实例。它的内部实现原理是这样的：
```js
// L instanceof R 
//通过判断
 L.__proto__.__proto__ ..... === R.prototype ？
//最终返回true or false
```
- 也就是沿着L的`__proto__`一直寻找到原型链末端，直到等于R.prototype为止。知道了这个也就知道为什么以下这些奇怪的表达式为什么会得到相应的值了.
```js
Function instanceof Object // true 
 Object instanceof Function // true 
 Function instanceof Function //true
 Object instanceof Object // true
 Number instanceof Number //false
```

### 类
##### ES5定义类
```js
function Animal(name) {
    this.name = name;
    this.sleep = function() {
        console.log(this.name+'正在睡觉');
    }
}//定义Animal类
Animal.prototype = {
    eat: function(food) {
        console.log(this.name+"正在吃"+food);
    }
}
function Cat() {

}
Cat.prototype = new Animal('Tom');  //继承
var Tom = new Cat('Tom');/Cat实例对象
Tom.eat('猫粮');
//Tom正在吃猫粮
//继承Animal方法
Tom.sleep();
//Tom正在睡觉
//继承Animal方法
//现在的原型链：
//Tom(Cat实例对象)--->Cat.prototype(Animal实例对象)--->Animal.prototype--->Object.prototype--->null
```
##### ES6写法（class关键字）
- 定义一个类的方法实际上也是上面所说的定义一个对象的方法，类本身就是一个对象，只不过这个对象里面的方法和属性可以供许多实例对象调用而已。类实质上是 JavaScript 现有的基于原型的继承的语法糖。
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  sleep() {
    console.log(this.name + ' 正在睡觉');
  }
  eat(food){
    console.log(this.name+'正在吃'+food)  
  }
}

class Cat extends Animal {  //继承

}

const Tom = new Cat('Tom');
Tom.eat('猫粮');
//Tom正在吃猫粮
//继承Animal方法
Tom.sleep();
//Tom正在睡觉
//继承Animal方法
//现在的原型链：
//Tom(Cat实例对象)--->Cat.prototype(Animal实例对象)--->Animal.prototype--->Object.prototype--->null
```

##### 构造函数 （`constructor`）
- `constructor`方法是一个特殊的方法，用来接收参数。这种方法用于创建和初始化一个由`class`创建的对象。一个类只能拥有一个名为 `“constructor”`的特殊方法。如果类包含多个`constructor`的方法，则将抛出 一个`SyntaxError` 。

```js
class Rectangle {
    // constructor
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    // Getter
    get area() {
        return this.calcArea()
    }
    // Method
    calcArea() {
        return this.height * this.width;
    }
}
const square = new Rectangle(10, 10);

console.log(square.area);
// 100
```

##### 静态方法(`static`关键字)
- `static`关键字用来定义一个类的一个静态方法。
- 调用静态方法不需要实例化对象。
- 不能通过一个类实例调用静态方法。
- 静态方法通常用于为一个应用程序创建工具函数。
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy); //hypot() 函数返回它的所有参数的平方和的平方根
    }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));
```

##### `class类` 与 `传统的基于函数的类`中`this`指向的不同
- 基于`class`,如果该对象没有“this”值（或“this”作为布尔，字符串，数字，未定义或null) ，那么“this”值在被调用的函数内部将为 undefined。不会发生自动包装。
```js
class Animal { 
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

let obj = new Animal();
obj.speak(); // Animal {}
let speak = obj.speak;
speak(); // undefined

Animal.eat() // class Animal
let eat = Animal.eat;
eat(); // undefined
```
- 基于传统的类,基于调用该函数的“this”值将发生自动装箱。
```js
function Animal() { }

Animal.prototype.speak = function() {
  return this;
}

Animal.eat = function() {
  return this;
}

let obj = new Animal();
let speak = obj.speak;
speak(); // Window

let eat = Animal.eat;
eat(); // Window
```

##### 实例属性
- 实例的属性必须定义在类的*方法* 里
```js
class Rectangle {
  constructor(height, width) {    
    this.height = height;
    this.width = width;
  }
}
```
- 静态的或者原型的数据属性必须定义在类定义的外面
```js
Rectangle.staticWidth = 20;
Rectangle.prototype.prototypeWidth = 25;
```

##### 创建子类（`extends`）
```js
class Animal { 
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + ' barks.');
  }
}

var d = new Dog('Mitzie');
d.speak();// 'Mitzie barks.'
```
- 也可以继承传统的基于函数的`类`
- 一个构造函数可以使用 `super` 关键字来调用一个父类的构造函数。(用于调用对象的父对象上的函数。)
```js
function Animal (name) {
  this.name = name;  
}
Animal.prototype.speak = function () {
  console.log(this.name + ' makes a noise.');
}

class Dog extends Animal {
  speak() {
    super.speak();
    console.log(this.name + ' barks.');
  }
}

var d = new Dog('Mitzie');
d.speak();//Mitzie makes a noise.  Mitzie barks. 同时调用了两个方法
```
- 类不能继承常规（非可构造）对象。如果要继承常规对象，可以改用`Object.setPrototypeOf()`：
```js
var Animal = {
  speak() {
    console.log(this.name + ' makes a noise.');
  }
};

class Dog {
  constructor(name) {
    this.name = name;
  }
}

Object.setPrototypeOf(Dog.prototype, Animal);

var d = new Dog('Mitzie');
d.speak(); // Mitzie makes a noise.
```
##### `super`关键字
- `super`关键字的一个作用是用来访问 *父类的构造器* 或者 *函数* 用的。
- 子类在使用构造器的时候，必须使用`super`关键字，用来扩展构造器。
- `super`可以理解为父类的一个会实例化对象，但不同的是`super`只能访问父类的方法，不能访问私有变量。
```js
            class Student {
                constructor(name){
                    this.name = name
                }
                testFn(){
                    console.log('我是父类的函数！')
                }
            }
            
            class Worker extends Student{
                constructor(name,age,sex){
                    super(name)    //这里必须先调用super，才有下文的this对象，这里扩展了一个变量age
                    this.age = age
                    this.sex = sex
                }
                testFn(){
                    super.testFn();
                    console.log("年龄" + this.age)
                    console.log("性别" + this.sex)
                    console.log('我是子类的函数！')
                }
            }
            
            const person = new Worker('liLei','20')
            person.testFn()
            //输出：
            //我是父类的函数！
            //年龄20
            //性别undefined
            //我是子类的函数！
            //我是子类的函数！

```


