#### 一、minimist （命令行参数解析）

[gitHub](https://github.com/substack/minimist)

先了解下`process.argv`：
```js
// 假设有以下脚本：
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})

// 启动脚本：
node process-argv.js one two=three four

// 输出：
0: /usr/local/bin/node // process.execPath
1: /Users/mjr/work/node/process-args.js // 脚本文件的地址
2: one
3: two=three
4: four
```

`process.argv`可以获取运行脚本时的命令行参数，而之所以常用`process.argv.slice(2)`，是因为一般第二个参数后才是我们需要的。
再来看`minimist`的用法及例子：
```js
const args = require('minimist')(process.argv.slice(2))
```
举例：
```js
node test.js -a a -b b
// args: {_: [], a: 'a', b: 'b'}

node test.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
// { _: [ 'foo', 'bar', 'baz' ],
// x: 3,
// y: 4,
// n: 5,
// a: true,
// b: true,
// c: true,
// beep: 'boop' }
```
解析参数，并放到一个对象中。特别要说明的是其中首个key是`_`，它的值是个数组，包含的是所有没有关联选项的参数。


#### 二、chalk（终端多色彩输出）

[gitHub](https://github.com/chalk/chalk)

用于终端显示多色彩输出

基本用法：
```js
const chalk = require('chalk');

// 基础用法
console.log(chalk.red('red', 'red2'));
console.log(chalk.red('red'));

// 拼接
console.log(chalk.red('red') + 'middle' + chalk.blue('blue'));

// 多个样式
console.log(chalk.blue.bgRed.bold('hello world'));

// 组合
console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
```

#### 三、enquirer(终端交互)

[gitHub](https://github.com/enquirer/enquirer)

交互式询问用户输入

 基本用法：
```js
const { prompt } = require('enquirer');

// 1. 单次询问：
const options = {
    type: 'input',
    name: 'name',
    message: "What's your name?"
}

// 2. 多次询问：
const options = [
    {
      type: 'input',
      name: 'username',
      message: 'What is your username?'
    },
    {
      type: 'password',
      name: 'password',
      message: 'What is your password?'
    }
  ]
  
const res = await prompt(options);
console.log(res);
```
另一种调用方法：
```js
// 比如input类型：
const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.log);
```
每次询问都需要指定一个类型`type`，或引入一个`Prompt类`。常见的有:
1. `Input`:  普通输入，返回`String`类型
2. `Password`:  密码输入，返回`String`类型
3. `Confirm`： 确认，返回`Boolean`类型
4. `AutoComplete`: 自动补全 
5. `BasicAuth`：基本认证（用户名、密码）
6. `Form`：表单
7. `Invisible`：不可见信息
8. `MultiSelect`: 选择多个
9. `Numeral`: 数字

#### 四、execa(执行命令)
[gitHub](https://github.com/sindresorhus/execa)

相当于我们在终端输入命令并执行

先看原生写法：
```js
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const res = await exec('ls');
// 1. 可以传入cwd参数指定执行的目录
const res = await exec('ls', {cwd: path.resolve(__dirname, '../../test')})
// 2. 另一种指定执行目录的方法是 process.chdir()
process.chdir('../../test');
const res = await exec('ls');
```

跟原生的`exec`的主要区别或优势：
1. Promise支持
2. 更高的最大缓冲区。100mb而不是200kb。
3. 按名称执行本地安装的二进制文件。
4. 在父进程终止时清除派生的进程。
5. 更具描述性的错误。


基本api及用法：
1. execa(file, arguments?, options?)
```js
const { stdout } = await execa('git', ['status']);
// 指定执行目录同样是传入cwd或者process.chdir()；
const { stdout } = await execa('git', ['status'], {cwd: resolve('../demo')});
```
2. execa.sync(file, arguments?, options?)：同步执行文件
3. execa.command(command, options?): 与`execa()`相同，只是文件和参数都在单个命令字符串中指定
```js
execa.command('git status');
```
4. execa.commandSync(command, options?)：与 `execa.command()`相同，但是是同步的。

#### 五、fs-extra(操作文件)

[gitHub](https://github.com/jprichardson/node-fs-extra)

`fs-extra`是原生`fs`的降级，`fs`中的所有方法都附加到了`fs-extra`中，并向`fs`添加了promise支持。如果没有传入回调，所有的fs方法都会返回promise 。

先回顾下原生`fs`的一些常用方法：
1. 获取文件类型：
```js
const resolve = p => path.resolve(__dirname, p);

const stat = fs.statSync(resolve('../../README.txt'));
console.log(stat.isDirectory()); // 是否是文件夹
console.log(stat.isFile()); // 是否是文件
```
2. 文件或目录是否存在：
```js
console.log(fs.existsSync(resolve('../fs/fs.js')));
```
3. 获取目录下的所有文件名
```js
fs.readdirSync(path.resolve(__dirname, '../fs'));
```
4. 读写(复制文件)
```js
const source = fs.readFileSync(resolve('./fs.js')); // 返回的是一个Buffer对象
fs.writeFileSync(resolve('./test.js'), source);
```
5. 流读写
```js
const readStream = fs.createReadStream(resolve('./1.png');
readStream.on('error', (err) => { // 监听error
   console.log('流读取失败：', err);
})
 
const writeStream = fs.createWriteStream('./2.png');
writeStream.on('error', (err) => {
   console.log('流写入失败：', err);
    })
writeStream.on('close', (data) => {
console.log('流写入完成', data);
 })
readStream.pipe(writeStream);
```
6. 重命名
```js
fs.renameSync(resolve('./old.js'),resolve('./new.js'));
```
7. 创建文件/目录
```js
fs.mkdirSync(resolve('./newDir');
// 写入文件（会覆盖之前的内容），文件不存在就创建
fs.writeFileSync(resolve('./new.js', 'console.log(1)');
```
8. 删除文件/目录
```js
fs.unlinkSync(resolve('./newDir/test.js')); // 删除文件
// 只能删空目录，要删除非空文件夹，需要先把文件夹里的文件删除，再删除空文件夹
fs.rmdirSync(resolve('./newDir'));
```
9. 追加文件内容
```js
const context = `console.log(111)`;
fs.appendFileSync(resolve('./new.js'), context);
```

再来看下`fs-extra`的一些常用API：

1. copy(src, dest[, options][, callback])：复制文件/文件夹
```js
const fse = require('fs-extra');

// With a callback:
fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
  if (err) return console.error(err)
  console.log('success!')
}) 

// copies file
fs.copy('/tmp/mydir', '/tmp/mynewdir', err => {
  if (err) return console.error(err)
  console.log('success!')
}) // copies directory, even if it has subdirectories or files

// With Promises:
fs.copy('/tmp/myfile', '/tmp/mynewfile')
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
})

// With async/await:
async function example () {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

example()
```
2. emptyDir(dir[, callback])：清空目录

确保目录是空的。如果目录非空，删除目录下所有内容。如果目录不存在，创建一个空目录。

3. ensureFile(file[, callback])： 创建文件

确保文件存在。如果被添加的文件所在的目录不存在,创建该目录。如果文件已经存在了,不进行操作。

4. ensureDir(dir[,options][,callback])： 创建目录

确保目录存在。如果不存在，则创建。

5. remove(path[, callback])：删除文件/目录

可以删除有内容的目录（这一点比`fs`优秀）。如果文件/目录存在，不进行任何操作。

本次只介绍几个常用的库的一些基本用法。这些工具库的用法还有很多，如果想更完整的了解，可以点击相应库的gitHub地址查看。