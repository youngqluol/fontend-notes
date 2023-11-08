#### 开始一个新的vue3项目

- 下载@vue/cli
```
npm i -g @vue/cli
```

- 初始化一个vue项目
```
vue create demo-project
```

- 进入项目文件夹，更新vue版本
```
vue add vue-next
```
- 启动项目(支持热更新)
```
npm run serve
```

#### vue2.x中应用vue3语法(组合式api)

```
npm i @vue/composition-api -S
```

在使用@vue/composition-api前，必须通过Vue.use()进行安装，之后才能使用心得组合式api进行组件开发

```
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

在组件中使用：
```
// 使用 API
import { ref, reactive } from '@vue/composition-api'
```