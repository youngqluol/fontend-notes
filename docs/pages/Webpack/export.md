### 导入导出
#### `exports`
- 导出（`output.js`）
```js
exports.str='string字符串'//导出字符串
exports.bool=true//导出布尔
exports.num=123//导出number
exports.foo=(r)=>{//导出函数
  console.log(`导出函数为：${r}`);
}
exports.arr=[1,2,3]//导出数组
exports.obj={ a:1, b:2}//导出对象
```
- 导入（`input.js`）
```js
const iptObj= require('./output.js')
  console.log(iptObj.str);//=>string字符串
  console.log(iptObj.bool);//=>true
  console.log(iptObj.num);//=>123
  console.log(iptObj.arr);//=>[ 1, 2, 3 ]
  console.log(iptObj.obj);//=>{ a: 1, b: 2 }
  iptObj.foo('参数')//=>导出函数为：参数
```
#### `module.exports`
- 导出（`output.js`）
```js
module.exports={
  str:'string字符串',
  bool:true,
  num:123,
  foo:(r)=>{
    console.log(`导出函数为：${r}`);
  },
  arr:[1,2,3],
  obj:{ a:1, b:2}
}
```
- 导入（`input.js`）
```js
const iptObj= require('./output.js')
  console.log(iptObj.str);//=>string字符串
  console.log(iptObj.bool);//=>true
  console.log(iptObj.num);//=>123
  console.log(iptObj.arr);//=>[ 1, 2, 3 ]
  console.log(iptObj.obj);//=>{ a: 1, b: 2 }
  iptObj.foo('参数')//=>导出函数为：参数
```
- `module.exports`的`output.js`同时支持如下写法。导入方法不变。
```js
module.exports.str='string字符串'
module.exports.bool=true
module.exports.num=123
module.exports.foo=(r)=>{
  console.log(`导出函数为：${r}`);
}
module.exports.arr=[1,2,3]
module.exports.obj={ a:1, b:2}
```

#### `export`
- 导出（`output.js`）
```js
export const srt = 'string字符串'
export const bool = true
export const num = 123
export const arr = [1, 2, 3]
export const obj = { a: 1, b: 2}
export function foo(r) {
  console.log(`导出函数为：${r}`);
}
```
- 导入（`input.js`）
```js
import {str,arr,obj,bool,num,foo} from './output'
console.log(str)
console.log(arr)
console.log(obj)
console.log(bool)
console.log(num)
foo('参数')
```
- `export`的`output.js`同时支持如下写法
```js
const str = 'string字符串' 
const bool = true
const num = 123
const arr = [1, 2, 3]
const obj = { a: 1, b: 2}
function foo(r) {
  console.log(`导出函数为：${r}`);
}
export {
  str,bool,num,arr,obj,foo
}
```
- `input.js` 导入支持重命名
```js
import {str as STR,arr,obj,bool,num,foo as FOO} from './output'
console.log(STR)
console.log(arr)
console.log(obj)
console.log(bool)
console.log(num)
FOO('参数')
```
- 继续重命名
```js
import * as newName from './output'
console.log(newName.str)
console.log(newName.arr)
console.log(newName.obj)
console.log(newName.bool)
console.log(newName.num)
newName.foo('参数')
```

#### `export default`
- 导出（`output.js`）
```js
export default {
  str: 'string字符串',
  bool: true,
  num: 123,
  foo: (r) => {
    console.log(`导出函数为：${r}`);
  },
  arr: [1, 2, 3],
  obj: { a: 1, b: 2 }
}
```
- 导入（`input.js`）
```js
import defaultObj from './output'
console.log(defaultObj.str)
console.log(defaultObj.arr)
console.log(defaultObj.bool)
console.log(defaultObj.num)
console.log(defaultObj.obj)
defaultObj.foo('ef')//=>导出函数为：ef
```
- `export default`的`output.js`同时支持如下写法。导入的方法不变
```js
const str = 'string字符串'
const bool = true
const num = 123
const arr = [1, 2, 3]
const obj = {a: 1, b: 2}
function foo(r) {
  console.log(`导出函数为：${r}`);
}
export default {
  str,
  bool,
  num,
  arr,
  obj,
  foo
}
```

### `export` 和 `export default` 的区别
- `export default` 在一个模块里只能有一个，但是`export`可以有多个
```js
//model.js
    let e1='export 1';
    let e2='export 2';
    let e3='export 3';
    let e4='export 4';
    export {e2};
    export {e3};
    export {e4};
    export default e1;
```
```js
//使用模块的index.js
    import e1, {e2, e3, e4} from "./model";
    console.log(e1);
    console.log(e2);
    console.log(e3);
    console.log(e4);
```
- 模块中通过`export` 导出的(属性或者方法)可以修改，但是通过`export default`导出的不可以修改
```js
//model.js
    let e1='export 1';
    let e2='export 2';
    export {e2};
    export default e1;
    e1='export 1 modified';
    e2='export 2 modified';
```
```js
//index.js
    import e1, {e2}from "./model";
    console.log(e1);  // export 1
    console.log(e2);  // export 2 modified
```

- 首先需要了解到：

  -  `ES6`中模块通过`export`和`export    default`暴露出来的属性或者方式并不是普通的赋值或者引用，它们是对模块内部定义的标志符类似指针的绑定
  - 对于一个导出的属性或者方法，在什么地方导出不重要，在什么时候导入也不重要，重要的是:访问这个绑定的时候的当前值。
  - `export`是绑定到标识符，改变标志符的值，然后访问这个绑定，得到的是新值；`export default`绑定的是标志符指向的值，如果修改标志符指向另一个值，这个绑定的值不会发生变化。
- `export default`与`export`语法差异

  -  `export var e1='...' `是合法语句，但是`export default var e2='...'`是不合法的（let和const也一样）。
  - `export default`可以直接添加标识符导出，例如`export default e2`;`export`如果要导出已经声明的表示符,必须使用`{}`,例如`export {e1}`,注意：这里`{}`不是声明一个对象。



#### path.resolve()、path.join()

- **join()**

path.join() 方法会将所有给定的 path 片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。

```js
path.join('/目录1', '目录2', '目录3/目录4', '目录5', '..');
// 返回: '/目录1/目录2/目录3/目录4'
```

- **resolve**

   - 将路径或路径片段的序列解析为绝对路径。
   - 给定的路径序列会从右到左进行处理，后面的每个 path 会被追加到前面，直到构造出绝对路径
   - 如果在处理完所有给定的 path 片段之后还未生成绝对路径，则会使用当前工作目录
   - 如果没有传入 path 片段，则 path.resolve() 会返回当前工作目录的绝对路径。

```js
 /*其处理方式类似于对这些路径逐一进行cd操作，
 与cd操作不同的是，这引起路径可以是文件，
 并且可不必实际存在（resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作）*/
 path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')
 // 相当于
    cd foo/bar
    cd /tmp/file/
    cd ..
    cd a/../subfile
    pwd
    
path.resolve('/foo/bar', './baz')
// 输出结果为
'/foo/bar/baz'
path.resolve('/foo/bar', '/tmp/file/')
// 输出结果为
'/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// 当前的工作路径是 /home/itbilu/node，则输出结果为
'/home/itbilu/node/wwwroot/static_files/gif/image.gif' 
```

- **对比**

```js
const path = require('path');
let myPath = path.join(__dirname,'/img/so');
let myPath2 = path.join(__dirname,'./img/so');
let myPath3 = path.resolve(__dirname,'/img/so');
let myPath4 = path.resolve(__dirname,'./img/so');
console.log(__dirname);           //D:\myProgram\test
console.log(myPath);     //D:\myProgram\test\img\so
console.log(myPath2);   //D:\myProgram\test\img\so
console.log(myPath3);   //D:\img\so<br>
console.log(myPath4);   //D:\myProgram\test\img\so
```

- **__dirname**

总是指向被执行 js 文件的绝对路径

所以当你在 /d1/d2/myscript.js 文件中写了 __dirname， 它的值就是 /d1/d2 。