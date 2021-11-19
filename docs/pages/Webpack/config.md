### [webpack官网文档](https://www.webpackjs.com/concepts/)

### 四个核心概念
- 入口（`entry`）
  + `指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。`
  ```js
  module.exports = {
         entry: './path/to/my/entry/file.js'
    };
    //默认路径值为 ./src
  ```
- 输出（`output`）
  + ` output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。`
 
  ```js
    const path = require('path');
    module.exports = {
      entry: './path/to/my/entry/file.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
      }
    };
  ```
  
- `loader`
  + `loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。`
  + `在更高层面，在 webpack 的配置中 loader 有两个目标：`
   1. `test` 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
   2. `use` 属性，表示进行转换时，应该使用哪个 loader。
  
     ```js
     const path = require('path');
    const config = {
      output: {
        filename: 'my-first-webpack.bundle.js'
      },
      module: {
        rules: [
          { test: /\.txt$/, use: 'raw-loader' }
        ]
      }
    };

    module.exports = config;
    //重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules
     ```
 
- 插件（`plugins`）
  + `loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。`
  + `想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。`
     ```JS
     const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
    const webpack = require('webpack'); // 用于访问内置插件
    const config = {
      module: {
        rules: [
          { test: /\.txt$/, use: 'raw-loader' }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
      ]
    };
    module.exports = config;
     ```
     
### 配置篇（module.rules）   

##### `css`文件

- 基本配置

```js

// 解析css
rules: [
    {
        test: /\.css$/,
        use: [
            'style-loader'
            'css-loader',
            ]   
    }
]

// 解析less（或sass）
rules: [
    {
        test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            'less-loader' // 从右向左（即各个loader将自己的解析结果依次向左传递）
        ]
    }
]

// 解析vue-style
rules: [
    {
        test: /\.less$/,
        use: [
            'vue-style-loader',
            'css-loader',
            'less-loader' 
        ]
    }
]
```

- 优化配置(以vue环境为例)

```js
rules: [
    {
        test: /\.less$/,
        use: [
            devMode ? 'vue-style-loader' : MiniCssExtractPligin.loader,
            // MiniCssExtractPligin： 拆分css文件，对每个包含css的js文件都会创建一个CSS文件，
            // 支持按需加载css和sourceMap,需要在plugins属性中实例化及配置（只在生产环境下开启）
            // devMode: process.env.NODE_ENV 当前node环境（开发或生产）
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [require('autoprefixer')]
                }
            },
            // 给样式添加浏览器前缀（兼容性）
            'less-loader'
        ]  // 从右向左解析原则
    },
]

// MiniCssExtractPlugin的配置：
plugins: [
    new MiniCssExtractPligin({   // 拆分css(一个入口文件对应一个css文件)
            filename: devMode ? 'css/[name].css' : 'css/[name]@[hash].css',  // 拆分出的css
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id]@[hash].css'  // 对应的css模块名
        }),
// 可以通过在名字前加路径，来决定打包后的文件存在的路径
]

```

##### 图片、视频、字体

```js
rules: [
     {
                test: /\.(jpe?g|png|gif)$/i,   // 图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|avi|mp3|wav)$/,   // 视频
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]' 
                            }
                        }
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 字体
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[hash:8].[ext]' 
                            }
                        }
                    }
                }
            },
]
```

##### `js`文件

 
```js
// 基本配置
module.exports = {
    module: {
        rules: [
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {modules: false}]], // 两个中括号（大坑，慎重！！）
                    plugins: [['@babel/plugin-transform-runtime']]
                }
            },
            exclude: /node_modules/
        ]
    }
}

// 相关依赖（注意版本号需要一致）
"devDependencies": {
    "@babel/core": "^7.9.0",
    "@babel/plugin-transform-runtime": "^7.9.0",
    "@babel/preset-env": "^7.9.0",
    "babel-core": "^7.0.0-bridge.0",
    "babel-loader": "^7.1.5",
  },
```

##### `resolve`配置
*resolve 配置 webpack 如何寻找模块所对应的文件。webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你可以根据自己的需要修改默认的规则。*
1. *module*

resolve.modules 配置 webpack 去哪些目录下寻找第三方模块，默认情况下，只会去 node_modules 下寻找，如果你我们项目中某个文件夹下的模块经常被导入，不希望写很长的路径，那么就可以通过配置 resolve.modules 来简化
```js
//webpack.config.js
module.exports = {
    //....
    resolve: {
        modules: ['./src/components', 'node_modules'] //从左到右依次查找
    }
}
// 这样配置之后，我们 import Dialog from 'dialog'，会去寻找 ./src/components/dialog，不再需要使用相对路径导入。如果在 ./src/components 下找不到的话，就会到 node_modules 下寻找。
```
2. *alias*

通过别名把原导入路径映射成一个新的导入路径
```js
//webpack.config.js
module.exports = {
    //....
    resolve: {
        alias:{
          'vue$':'vue/dist/vue.runtime.esm.js',
          ' @':path.resolve(__dirname,'../src')
        }
    }
}
```
3. *extensions*

配置 extensions，我们就可以缺省文件后缀，在导入语句没带文件后缀时，会自动带上extensions 中配置的后缀后，去尝试访问文件是否存在，因此要将高频的后缀放在前面，并且数组不要太长，减少尝试次数
```js
//webpack.config.js
module.exports = {
    //....
    resolve:{
        extensions:['*','.js','.json','.vue']
   },
}
```

##### 定义环境变量（配合`cross-env`使用）

```js
// webpack.config.js
// 定义一个编译过程中可以使用的全局变量
new webpack.DefinePlugin({
    'process.env': process.env.NODE_ENV==='production'?require('../config/prod.env'):require('../config/dev.env')
}),
//process.env包含着关于系统环境的信息。但是process.env中并不存在NODE_ENV这个东西。NODE_ENV是用户一个自定义的变量，我们可以使用该属性来设置全局变量来区分开发环境和正式环境。

// 引入cross-env(跨平台设置和使用环境变量的脚本。) 并在package.json里配置命令
npm i cross-env -D


"scripts": {
    "build": "cross-env NODE_ENV=production node build/webpack.prod.config.js",
    "dll": "cross-env NODE_ENV=production node build/webpack.dll.config.js"
  },
```



#### 搭建vue环境

##### 解析`vue`文件

```js
//基本配置
const vueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    module:{
        rules:[{
            test:/\.vue$/,
            use:['vue-loader']
        },]
     },
    resolve:{
        alias:{
          'vue$':'vue/dist/vue.runtime.esm.js',
          ' @':path.resolve(__dirname,'../src')
        },
        extensions:['*','.js','.json','.vue']
   },
   plugins:[
        new vueLoaderPlugin()
   ]
}

```

##### 配置webpack-dev-server

```js
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map' // 此选项控制是否生成，以及如何生成 source map
    devServer: {    // webpack-dev-server 相关配置
    port: 8000,
    hot: true,
    open: true,  // 自动打开浏览器
    contentBase: '../dist'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()   // 热更新热部署
  ]
}

```

##### 区分生产（development）和开发（production）环境

一般build文件夹下有一下三个文件
- webpack.config.js(公共配置)

```js
// 其他配置参考以上
plugins: [
        new htmlWebpackPlugin({
            template:path.resolve(__dirname, '../index.html'),   // 目标html(将模块注入到哪个html中)
            filename: 'index.html',   // 生成的html名
            chunks: ['main']   // 注入的模块名
        }),
        new AddAssetHtmlPlugin({
            filepath: require.resolve('../static/js/vendor.dll.js'), // 这个路径是你的dll文件路径 （自动在 html 文件中引入动态链接库脚本）
            includeSourcemap: false  // 这里是因为我开启了sourcemap。 不这么写会报错。
          }),
        // new htmlWebpackPlugin({ // 如果是多页面，则需要配置多个htmlWebpackPlugin
        //     template: path.resolve(__dirname, '../index1.html'),
        //     filename: 'index1.html',
        //     chunks: ['main1']
        // }),
        new CleanWebpackPlugin(),    // 打包前清空之前dist文件夹
        new MiniCssExtractPligin({   // 拆分css
            filename: devMode ? '[name].css' : '[name]@[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id]@[hash].css'
        }),
        new vueLoaderPlugin(),
        new Webpack.DllReferencePlugin({  // 抽离第三方模块(第一种方法) 通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 id 上，之后再在需要的时候通过内置的 __webpack_require__ 函数来 require 他们
            context: __dirname,
            manifest: require(path.resolve(__dirname, '../static/vendor-manifest.json'))
          }),
        new CopyWebpackPlugin([ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
            {from: '../static', to:'../dist'}
            ]),
    ]

```

- webpack.dev.config.js（开发环境配置）
```js
// 开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap

const Webpack = require('webpack');
const WebpackCofig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(WebpackCofig, {
  mode:'development', // 开发模式
  devtool:'cheap-module-eval-source-map',  // 此选项控制是否生成，以及如何生成 source map
  devServer: {    // webpack-dev-server 相关配置
    port: 8000,
    hot: true,
    open: true,  // 自动打开浏览器
    contentBase: '../dist'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()   // 热更新热部署
  ]
})
```
- webpack.prod.config.js（生产环境配置）

```js
 // 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码

const WebpackCofig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');
const env = process.env.NODE_ENV === 'production';

let prodWebpackConfig = WebpackMerge(WebpackCofig, {
  mode:'production', // 开发模式
  devtool:'cheap-module-source-map', 
  optimization: {    // 自定义js优化配置，将会覆盖默认配置
      minimizer: [ // 压缩
        new UglifyJsPlugin({  // 压缩js
          exclude: /\.min\.js$/,  // 一般这种文件后缀是压缩过的
          cache: true,
          parallel: true,  // 开启并行压缩
          sourceMap: true, // Must be set to true if using source-maps in production
          extractComments: false,  // 移除注释
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: true,
              drop_console: env ? true : false
            }
          }
        }),
        // webpack mode设置production的时候会自动压缩js代码。
        // 原则上不需要引入uglifyjs-webpack-plugin进行重复工作。
        // 但是optimize-css-assets-webpack-plugin压缩css的同时会破坏原有的js压缩，所以这里我们引入uglifyjs进行压缩
        new OptimizeCssAssetsPlugin({ // 优化css文件
          assetNameRegExp: /\.css$/g,
          cssProcessorOptions: {
            safe: true,
            autoprefixer: {
              disable: true
            },
            mergeLonghang: false,
            discardComments: {
              removeAll: true  // 移除注释
            }
          }
        })  
      ],
      splitChunks: {  // 分离代码：webpack4移除了CommonsChunkPlugin插件，取而代之的是splitChunks。
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            minSize: 30000,
            minChunks: 1,
            chunks: 'initial',
            priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
          },
          commons: {
            test: /[\\/]src[\\/]common[\\/]/,
            name: 'commons',
            minSize: 30000,
            minChunks: 3,
            chunks: 'initial',
            priority: -1,
            reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
          }
        }
      }
  },
  plugins: [
  ]
});
const startDate = new Date();
const spinner = ora('building for production...');
spinner.start();

Webpack(prodWebpackConfig, (err, stats) => {
  spinner.stop();
  if(err) throw err;

  process.stdout.write(
    stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n'
);

  if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
  }

  const endDate = new Date();
  console.log(chalk.cyan('打包完成了.\n'))
  console.log(chalk.cyan('开始时间：' + startDate.toLocaleString()));
  console.log(chalk.cyan('结束时间：' + endDate.toLocaleString()));
  console.log(chalk.cyan('耗时：' + (endDate.getTime() - startDate.getTime()) / 1000 + 's'));
})
```

##### package.json配置命令

```js
"scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.config.js",
    "build": "cross-env NODE_ENV=production node build/webpack.prod.config.js",
    "dll": "cross-env NODE_ENV=production node build/webpack.dll.config.js"
  },
```

### 优化篇

**优化分以下几种情况：开发环境下、生产环境下、以及通用的一些优化**

#### 通用优化

- **copy-webpack-plugin 静态资源拷贝**

`将单个文件或整个目录复制到构建目录。`

```js
//webpack.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    //...
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'public/js/*.js',
                to: path.resolve(__dirname, 'dist', 'js'),
                flatten: true, // 设置为true时，只会拷贝文件，而不会把文件夹路径都拷贝上
            }
        ], {
            ignore: ['other.js']  // 可选配置：过滤掉某个或某些文件
        })
    ]
}
```

- **clean-webpack-plugin 打包之前清空dist文件夹**

```js
//webpack.config.js
plugins: [
    new CleanWebpackPlugin()
]
```

- **add-asset-html-plugin 将js或者css资源添加到html-webpack-plugin插件生成的html中**

```js
//webpack.config.js
plugins: [
    new AddAssetHtmlPlugin({
            filepath: require.resolve('../static/js/vendor.dll.js'), 
            // 这个路径是你的dll文件路径 （自动在 html 文件中引入动态链接库脚本）
            includeSourcemap: false  // 这里是因为我开启了sourcemap。 不这么写会报错。
          }),
]
```

- **按需加载**

*很多时候我们不需要一次性加载所有的JS文件，而应该在不同阶段去加载所需要的代码，需要使用 `import()` 语法*
```js
document.getElementById('btn').onclick = function() {
    import('./handle').then(fn => fn.default());
}
// webpack 遇到 import(****) 这样的语法的时候，会这样处理：
// 1. 以**** 为入口新生成一个 Chunk
// 2. 当代码执行到 import 所在的语句时，才会加载该 Chunk 所对应的文件
```

#### 开发环境

- **HotModuleReplacementPlugin   热更新热部署**

```js
//webpack.dev.config.js
const webpack = require('webpack');
module.exports = {
    //....
    devServer: {
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新插件
    ]
}
```

#### 生产环境（从优化打包速度、优化打包文件大小两方面）

- **mini-css-extract-plugin 抽离css** 
- **optimize-css-assets-webpack-plugin 压缩css**
- **uglifyjs-webpack-plugin 压缩js**

```js
//webpack.config.js
// 相关配置参考以上

// webpack.prod.config.js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    optimizition: {
        minimizer: [
            new UglifyJsPlugin({  // 压缩js
              exclude: /\.min\.js$/,  // 一般这种文件后缀是压缩过的
              cache: true,
              parallel: true,  // 开启并行压缩
              sourceMap: true, // Must be set to true if using source-maps in production
              extractComments: false,  // 移除注释
              uglifyOptions: {
                compress: {
                  // warnings: false,
                  drop_debugger: true,
                  drop_console: env ? true : false
                }
              }
            }),
            new OptimizeCssAssetsPlugin({ // 优化css文件
              assetNameRegExp: /\.css$/g,
              cssProcessorOptions: {
                safe: true,
                autoprefixer: {
                  disable: true
                },
                mergeLonghang: false,
                discardComments: {
                  removeAll: true  // 移除注释
                }
              }
            })  
         ]
    }
    
}
```

- **happypack 多线程构建**

*当你的项目不是很复杂时，不需要配置 happypack，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢。*
```js
npm install happypack -D

const Happypack = require('happypack');
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: 'Happypack/loader?id=js',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                use: 'Happypack/loader?id=css',
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist')
                ]
            }
        ]
    },
    plugins: [
        new Happypack({
            id: 'js', //和rule中的id=js对应
            //将之前 rule 中的 loader 在此配置
            use: ['babel-loader'] //必须是数组
        }),
        new Happypack({
            id: 'css',//和rule中的id=css对应
            use: ['style-loader', 'css-loader','postcss-loader'],
        })
    ]
}
```

- **抽离第三方模块**
1. *DllPlugin* 
2. *DllReferencePlugin*
```text
对于开发项目中不经常会变更的静态依赖文件。
类似于我们的elementUi、vue全家桶等等。因为很少会变更，所以我们不希望这些依赖要被集成到每一次的构建逻辑中去。
这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，
而不会再去编译第三方库。以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，这样可以快速的提高打包的速度。
```
*新建webpack.dll.config,js*
```js
//  抽离第三方模块
const path = require('path');
const Webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');

let WebpackConfig = {
  entry: {
    vendor: ['vue']  // 将第三方库放入数组
  },
  output: {
    path: path.resolve(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'  // // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new Webpack.DllPlugin({
      path: path.resolve(__dirname, '../static/[name]-manifest.json'),
      name: '[name]_library', 
      context: __dirname
    })
  ]
}
const spinner = ora('building dll...');
spinner.start();

Webpack(WebpackConfig, (err, stats) => {
  spinner.stop();
  if(err) throw err;

  process.stdout.write(
    stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n'
);

  if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
  }
})
```
*webpack.config.js的配置如下*
```js

plugins: [
    new AddAssetHtmlPlugin({
                filepath: require.resolve('../static/js/vendor.dll.js'), // 这个路径是你的dll文件路径 （自动在 html 文件中引入动态链接库脚本）
                includeSourcemap: false  // 这里是因为我开启了sourcemap。 不这么写会报错。
              }),
    new Webpack.DllReferencePlugin({  // 抽离第三方模块(第一种方法) 通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 id 上，之后再在需要的时候通过内置的 __webpack_require__ 函数来 require 他们
            context: __dirname,
            manifest: require(path.resolve(__dirname, '../static/vendor-manifest.json'))
          }),
]

```
*package.json命令配置*
```js
"scripts": {
    "dll": "cross-env NODE_ENV=production node build/webpack.dll.config.js"
  },
```
*先`npm run dll`，然后`npm run build`，第三方模块(`vendor.dll.js`)将以动态`script`标签形式插入到`index.html`中*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
<link href="main@461ee467ff5bf7904f50.css" rel="stylesheet"></head>
<body>
  <div id="app">
  </div>
<script type="text/javascript" src="vendor.dll.js">
</script><script type="text/javascript" src="main.js"></script></body>
</html>
```

**抽离公共代码**
```text
抽离公共代码是对于多页应用来说的，如果多个页面引入了一些公共模块，
那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载一次就缓存起来了，避免了重复下载。
抽离公共代码对于单页应用和多页应该在配置上没有什么区别，都是配置在 optimization.splitChunks 中。
```
```js
module.exports = {
    optimization: {    // 自定义js优化配置，将会覆盖默认配置
      splitChunks: {  // 分离代码：webpack4移除了CommonsChunkPlugin插件，取而代之的是splitChunks。
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            minSize: 30000,
            minChunks: 1,
            chunks: 'initial',
            priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
          },
          commons: {
            test: /[\\/]src[\\/]common[\\/]/,
            name: 'commons',
            minSize: 30000,
            minChunks: 3,
            chunks: 'initial',
            priority: -1,
            reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
          }
        }
      }
  },
}
```
**externals 外链** 
```text
按照官方文档的解释，如果我们想引用一个库，但是又不想让webpack打包，
并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置Externals。
有时我们希望我们通过script引入的库，如用CDN的方式引入的jquery，
我们在使用时，依旧用require的方式来使用，但是却不希望webpack将它又编译进文件中。
```

```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

```js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};
```

```js
import $ from 'jquery';
$('.my-element').animate(/* ... */);
```

**tree-shaking**

这里单独提一下`tree-shaking`,是因为这里有个坑。`tree-shaking`的主要作用是用来清除代码中无用的部分。目前`webpack4` 我们设置`mode`为`production`的时候已经自动开启了`tree-shaking`。但是要想使其生效，生成的代码必须是`ES6`模块。不能使用其它类型的模块如`CommonJS`之流。如果使用`Babel`的话，这里有一个小问题，因为`Babel`的预案`（preset）`默认会将任何模块类型都转译成`CommonJS`类型，这样会导致`tree-shaking`失效。修正这个问题也很简单，在`.babelrc`文件或在`webpack.config.js`文件中设置`modules： false`就好了

```js
module.exports = {
    module.rules: [
         {
                test: /\.js$/,   // 解析js
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,  // 开启缓存
                        presets: [['@babel/preset-env', { modules: false }]],  //注意 需要两层中括号包起来（大坑）
                        plugins: [['@babel/plugin-transform-runtime']]
                        },
                    },
                exclude: /node_modules/,
                // include: path.resolve(__dirname, 'src') // 尽量避免 exclude，更倾向于使用 include。
            },
    ]
}
```





    