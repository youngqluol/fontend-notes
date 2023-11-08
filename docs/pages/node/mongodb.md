#### 一、mongodb安装配置及项目配置
#### 本地安装及配置
##### 1. 安装
1. 官网下载：https://www.mongodb.com/try/download/community
2. 下载 .msi 文件，下载后双击该文件，按操作提示安装即可。
3. 安装过程中，你可以通过点击"`Custom`(自定义)"按钮来设置你的安装目录。
4. 下一步安装 "`installmongoDBcompass`"不勾选（当然你也可以选择安装它，可能需要更久的安装时间），`MongoDBCompass`是一个图形界面管理工具，我们可以在后面自己到官网下载安装，下载地址：https://www.mongodb.com/download-center/compass。

##### 2. 配置
1. 进入安装的根目录
2. 在根目录下创建几个文件夹（已有的话就不创建了），具体如下：
    - 数据库路径（`data/db`目录）
    - 日志路径（`log`目录）和日志文件（`log/mongo.log`文件）
3. 根目录下创建`mongo.conf`:
```
#数据库路径
dbpath=D:\Program Files\MongoDB\data\db
#日志输出文件路径
logpath=D:\program Files\MongoDB\log\mongo.log
#错误日志采用追加模式
logappend=true
#启用日志文件，默认启用
journal=true
#端口号
port=27017
```
4. 配置mongod系统环境变量(配置后才可以使用mongod命令)，path值：
```
D:\Program Files\MongoDB\bin
```
5. 通过windows服务来管理MongoDB的启动和关闭，在根目录下打开终端，执行：
```
// 根据自己的安装路径来
mongod –config “D:\Mongo\mongo.conf” –install –serviceName “MongoDB”
```
6. 启动MongoDB服务：
```
net start MongoDB
```
7. 关闭MongoDB服务
```
net stop MongoDB
```
8. 移除 MongoDB 服务
```
// 根据自己的安装路径来
C:\mongodb\bin\mongod.exe --remove
```

#### 云端数据库配置
1. 登录mongodb: [网址](https://account.mongodb.com/account/login?n=%2Fv2%2F6103cb216ef44e5b35fd3181&nextHash=%23clusters%3FfastPoll%3Dtrue) (如果没有，先创建账号)
```
email: young_luo123@163.com
passport: Lyq953342912.
```
2. 创建数据库
3. 点击`connect`，  选择连接方式为：`Connect your application`，根据提示，找到该数据库的uri，在node应用代码里配置即可
4. 点击`Browser Collections`查看表


#### node应用配置
使用mongoose连接
```js
const mongoose = require('mongoose');

// const MONDB_URL = "mongodb://127.0.0.1:27017/user"; // 本地mongodb数据库地址
const MONDB_URL = "mongodb+srv://youngqluol:lyq7285600@cluster0.49eox.mongodb.net/user?retryWrites=true&w=majority"; // 云端mongodb数据库地址

mongoose.connect(MONDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('数据库连接成功...');
});

db.on('error', (error) => {
  console.log('数据库连接失败...', error);
});

db.on('disconnected', () => {
  console.log('数据库已断开');
});

module.exports = mongoose;
```