### adb调试（Andriod Debug Bridge）

#### 安装

- [点这里去下载](https://www.cnblogs.com/lsdb/p/9438215.html)

- 直接将下载的压缩包解压到c盘某目录下(如：`C:\Program Files\adb`),就安装完毕了

- 配置环境变量，将上面的目录添加到环境变量的path属性下

#### 使用

- USB接口连接手机（打开开发者模式）
- 查看当前连接的设备
 
 ```cmd
 adb devices
 ```

- 复制手机文件到电脑
  
 ```cmd
 adb pull /sdcard/carrot C:\Users\W9002564\Desktop 
 ```

 - 复制电脑文件到手机
 ```cmd
 adb push C:\Users\W9002564\Desktop/test.txt /sdcard
 ```

- 安装APP应用
```cmd
adb install -r xxx.apk
```

- 卸载手机应用
```cmd
adb shell 进入shell模式
pm list packages  查看所有应用
pm list packages -s  查看系统应用
pm list packages -3  查看第三方应用
pm list packages huawei 查看包名包含huawei的应用列表
找到包名后
exit 退出shell模式
adb uninstall 包名
```

- 查看手机日志,常见操作“查看游戏代码执行后的日志”
```cmd
# 只查看游戏代码的⽇日志
adb logcat -s jswrapper

# 可以配合 grep 过滤⽇日志
adb logcat -s jswrapper | grep xxx
```

### 谷歌浏览器调试手机页面（现仅对测试环境软件商店）

先连接好手机（开发者选项开启，允许`usb`调试）,然后打开以下网址：
```js
chrome://inspect/#devices
```

### vconsole调试移动端
在html的<head></head>加入如下代码
```js
<script type="text/javascript" src="https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js"></script>
<script>
    var vConsole = new VConsole();
</script>
```

### 谷歌浏览器相关

#### 1. 基本调试方式

- 代码里写上debugger
- `Sources`里 代码行打断点
    1. "点击Sources菜单"——"左侧树中找到相应文件"——"点击行号列"即可完成在当前行添加/删除断点操作。
    2. 从左至右图标的作用分别是：
      - 暂停/恢复脚本执行（程序执行到下一断点停止） F8
      - 执行到下一步的函数调用（跳到下一行）。 F10
      - 进入当前函数。 F11
      - 跳出当前执行函数。 shift + F11
      - 关闭/开启所有断点（不会取消）。 ctrl + F8
      - 异常情况自动断点设置。 
- console
    1. `console.log`
    2. `console.dir`可以把一个对象的属性以可交互的形式展示出来
    3. `console.table` 当你有大量的数据（例如很长的数组、巨大的对象等等）需要展示的时候，它特别有用。
   
#### 2. Snippets 随时编写代码

- `Chrome`在`souces`页面提供`snippets`一栏，这里我们可以随时编写js代码，运行结果会打印到控制台。代码是全局保存的，我们在任何页面，包括新建标签页，都可以查看或运行这些代码。
- 我们不再需要为了运行一小段`JS`代码而新建一个HTML页面
- 右键文件 => `Run` 运行代码

#### 3. `copy`接口格式化接口返回的数据

- `Network` 选择某个接口 => 右键 => `copy` => `copy response`
- 在`console`页面 直接调用`copy`函数（将复制的内容当做参数传入）
- 此时`ctrl + v` 得到的就是格式化后的`json`数据

#### 4. debug接口
- `Chrome`控制台提供`debug`接口，可以传入一个函数，当这个函数下次执行的时候，调试器会自动在该函数中进行断点调试。
- `debug`函数还提供了定位功能，它能够让我们很快的找到指定的函数。

#### 5. 条件`breakpoint`
- 我们可以给断点设置表达式，当表达式为`true`时断点调试才会生效，这就是条件断点。
- 右键断点行左侧 => `Edit breakpoint`

#### 6. `Async`调试
- 调试异步函数所设计一个功能。
- 在`Promise`被广泛应用的今天，我们都知道，`Promise`的回调是异步执行的，没有开启`Async`模式前，调动栈只记录到回调函数本身，我们无法找到代码执行的顺序，这给我们调试带来巨大的困难。`Async`模式可以解决这个问题

#### 7. 使用 `console.time()` 和 `console.timeEnd()` 来标记循环耗时

```js
console.time('Timer1');
 
const items = [];
 
for(const i = 0; i < 100000; i++){
   items.push({index: i});
}
 
console.timeEnd('Timer1');
```