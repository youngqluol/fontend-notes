(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{409:function(t,s,a){"use strict";a.r(s);var n=a(54),o=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h4",{attrs:{id:"一、mongodb安装配置及项目配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、mongodb安装配置及项目配置"}},[t._v("#")]),t._v(" 一、mongodb安装配置及项目配置")]),t._v(" "),a("h4",{attrs:{id:"本地安装及配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#本地安装及配置"}},[t._v("#")]),t._v(" 本地安装及配置")]),t._v(" "),a("h5",{attrs:{id:"_1-安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-安装"}},[t._v("#")]),t._v(" 1. 安装")]),t._v(" "),a("ol",[a("li",[t._v("官网下载：https://www.mongodb.com/try/download/community")]),t._v(" "),a("li",[t._v("下载 .msi 文件，下载后双击该文件，按操作提示安装即可。")]),t._v(" "),a("li",[t._v('安装过程中，你可以通过点击"'),a("code",[t._v("Custom")]),t._v('(自定义)"按钮来设置你的安装目录。')]),t._v(" "),a("li",[t._v('下一步安装 "'),a("code",[t._v("installmongoDBcompass")]),t._v('"不勾选（当然你也可以选择安装它，可能需要更久的安装时间），'),a("code",[t._v("MongoDBCompass")]),t._v("是一个图形界面管理工具，我们可以在后面自己到官网下载安装，下载地址：https://www.mongodb.com/download-center/compass。")])]),t._v(" "),a("h5",{attrs:{id:"_2-配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-配置"}},[t._v("#")]),t._v(" 2. 配置")]),t._v(" "),a("ol",[a("li",[t._v("进入安装的根目录")]),t._v(" "),a("li",[t._v("在根目录下创建几个文件夹（已有的话就不创建了），具体如下：\n"),a("ul",[a("li",[t._v("数据库路径（"),a("code",[t._v("data/db")]),t._v("目录）")]),t._v(" "),a("li",[t._v("日志路径（"),a("code",[t._v("log")]),t._v("目录）和日志文件（"),a("code",[t._v("log/mongo.log")]),t._v("文件）")])])]),t._v(" "),a("li",[t._v("根目录下创建"),a("code",[t._v("mongo.conf")]),t._v(":")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("#数据库路径\ndbpath=D:\\Program Files\\MongoDB\\data\\db\n#日志输出文件路径\nlogpath=D:\\program Files\\MongoDB\\log\\mongo.log\n#错误日志采用追加模式\nlogappend=true\n#启用日志文件，默认启用\njournal=true\n#端口号\nport=27017\n")])])]),a("ol",{attrs:{start:"4"}},[a("li",[t._v("配置mongod系统环境变量(配置后才可以使用mongod命令)，path值：")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("D:\\Program Files\\MongoDB\\bin\n")])])]),a("ol",{attrs:{start:"5"}},[a("li",[t._v("通过windows服务来管理MongoDB的启动和关闭，在根目录下打开终端，执行：")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("// 根据自己的安装路径来\nmongod –config “D:\\Mongo\\mongo.conf” –install –serviceName “MongoDB”\n")])])]),a("ol",{attrs:{start:"6"}},[a("li",[t._v("启动MongoDB服务：")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("net start MongoDB\n")])])]),a("ol",{attrs:{start:"7"}},[a("li",[t._v("关闭MongoDB服务")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("net stop MongoDB\n")])])]),a("ol",{attrs:{start:"8"}},[a("li",[t._v("移除 MongoDB 服务")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("// 根据自己的安装路径来\nC:\\mongodb\\bin\\mongod.exe --remove\n")])])]),a("h4",{attrs:{id:"云端数据库配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#云端数据库配置"}},[t._v("#")]),t._v(" 云端数据库配置")]),t._v(" "),a("ol",[a("li",[t._v("登录mongodb: "),a("a",{attrs:{href:"https://account.mongodb.com/account/login?n=%2Fv2%2F6103cb216ef44e5b35fd3181&nextHash=%23clusters%3FfastPoll%3Dtrue",target:"_blank",rel:"noopener noreferrer"}},[t._v("网址"),a("OutboundLink")],1),t._v(" (如果没有，先创建账号)")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("email: young_luo123@163.com\npassport: Lyq953342912.\n")])])]),a("ol",{attrs:{start:"2"}},[a("li",[t._v("创建数据库")]),t._v(" "),a("li",[t._v("点击"),a("code",[t._v("connect")]),t._v("，  选择连接方式为："),a("code",[t._v("Connect your application")]),t._v("，根据提示，找到该数据库的uri，在node应用代码里配置即可")]),t._v(" "),a("li",[t._v("点击"),a("code",[t._v("Browser Collections")]),t._v("查看表")])]),t._v(" "),a("h4",{attrs:{id:"node应用配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#node应用配置"}},[t._v("#")]),t._v(" node应用配置")]),t._v(" "),a("p",[t._v("使用mongoose连接")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" mongoose "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'mongoose'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// const MONDB_URL = "mongodb://127.0.0.1:27017/user"; // 本地mongodb数据库地址')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("MONDB_URL")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"mongodb+srv://youngqluol:lyq7285600@cluster0.49eox.mongodb.net/user?retryWrites=true&w=majority"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 云端mongodb数据库地址")]),t._v("\n\nmongoose"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("connect")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("MONDB_URL")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  useNewUrlParser"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  useUnifiedTopology"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" db "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" mongoose"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("connection"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\ndb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("on")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'connected'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'数据库连接成功...'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\ndb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("on")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'error'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("error")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'数据库连接失败...'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" error"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\ndb"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("on")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'disconnected'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'数据库已断开'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nmodule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" mongoose"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=o.exports}}]);