# 取消请求

## 场景

1. 在`Vue` 或 `React`单页应用中，组件A挂载完毕之后向后台服务发起请求拉取数据，但是由于加载过慢，用户可能期间发生**路由跳转或回退**，导致组件A卸载，但是组件内部的网络请求并没有立即停止下来，此时的响应数据对于已卸载的组件A而言已经无效。若刚好此时请求响应错误，就可能导致前端实现的兜底弹窗出现在跳转后的页面中，造成视觉干扰;
2. 页面存在 **定时轮询** 业务，即固定间隔一段时间再次发起请求，这样就可能存在多个请求间的竞争关系，如果上一个请求的响应速度比最近一次请求的响应速度慢，则前者就会覆盖后者，从而导致数据错乱;
3. 类似于 **关键字搜索** 或 **模糊查询** 等需要频繁发起网络请求的相关业务，可能在一定程度上为了优化程序的执行性能，减少冗余的网络IO，我们会使用防抖(debounce)函数来对请求逻辑进行包装，减少查询次数以降低服务器压力，但是依旧避免不了由于加载耗时过长导致新老请求数据错乱的问题;
4. 针对前端 **大文件上传** 等上传服务，需要实现上传进度的暂停与恢复，即断点续传;

## 请求方式
- XMLHttpRequest
- Axios
- Fetch

### 一、 XMLHttpRequest

先简单封装一个`request`方法:

```js
/**
 * @description: 基于 XHR 封装的网络请求工具函数
 * @param {String} url 请求接口地址
 * @param {Document | XMLHttpRequestBodyInit | null} body 请求体
 * @param {Object} requestHeader 请求头
 * @param {String} method 请求方法
 * @param {String} responseType 设置响应内容的解析格式
 * @param {Boolean} async 请求是否异步
 * @param {Number} timeout 设置请求超时时间(单位：毫秒)
 * @param {Boolean} withCredentials 设置跨域请求是否允许携带 cookies 或 Authorization header 等授权信息
 * @return {Promise} 可包含响应内容的 Promise 实例
*/
function request({
  url,
  body = null,
  requestHeader = {'Content-Type': 'application/x-www-form-urlencoded'},
  method = 'GET',
  responseType = 'text',
  async = true,
  timeout = 30000,
  withCredentials = false,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!url) {
      return reject(new TypeError('the required parameter [url] is missing.'));
    }
    
    if (method.toLowerCase() === 'get' && body) {
      url += `?${request.serialize(body)}`;
      body = null;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, async);

    if (async) {
      xhr.responseType = responseType;
      xhr.timeout = timeout;
    }
    xhr.withCredentials = withCredentials;

    if (requestHeader && typeof requestHeader === 'object') {
      Object.keys(requestHeader).forEach(key => xhr.setRequestHeader(key, requestHeader[key]));
    }

    xhr.onreadystatechange = function onReadyStateChange() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(xhr.response);
        }
      }
    };

    xhr.onerror = function onError(error) {
      console.log(error);
      reject({ message: '请求出错，请稍后重试' });
    };

    xhr.ontimeout = function onTimeout() {
      reject({ message: '接口超时，请稍后重试' });
    };

    xhr.send(body ? JSON.stringify(body) : null);
  });
}
```

这样调用：

```js
request({
  url: 'http://www.some-domain.com/path/to/example',
  method: 'POST',
  requestHeader: {'Content-Type': 'application/json; charset=UTF-8'},
  body: {key: value}
}).then(response => console.log(response));
```

添加中断逻辑：

```js
function request({
  // 省略入参
  ...
} = {}) {
  return new Promise((resolve, reject) => {
    // 省略代码
    ...
  });
}

// 在request上添加静态属性
// 存储请求接口地址以及请求体和 XHR 实例的映射关系
request.cache = {};

/**
 * @description: 根据提供的键名中断对应的请求 
 * @param {String} key 存储在 request.cache 属性中的键名，若未提供则中断全部请求 
 * @return {void}
 */
request.clearCache = (key) => {
  if (key) {
    const instance = request.cache[key];
    if (instance) {
      instance.abort();
      delete request.cache[key];
    }

    return;
  }

  Object.keys(request.cache).forEach(cacheKey => {
    const instance = request.cache[cacheKey];
    instance.abort();
    delete request.cache[cacheKey];
  });
};
```

在以上示例中，我们通过`request.cache`来临时存储请求接口地址以及请求体和XHR实例的映射关系，因为在同一页面中一般可能会涉及到多个接口地址不同的请求，或者同一个请求对应不同的请求体，因此这里考虑加上了请求体以做区分。当然为了作为request.cache中的唯一键名，我们还需要对请求体进行序列化操作，因此简单封装一个序列化工具函数。

```js
/**
 * @description: 将请求体序列化为字符串
 * @param {Document | XMLHttpRequestBodyInit | null} data 请求体
 * @return {String} 序列化后的字符串
 */
request.serialize = (data) => {
  if (data && typeof data === 'object') {
    const result = [];

    Object.keys(data).forEach(key => {
      result.push(`${key}=${JSON.stringify(data[key])}`);
    });

    return result.join('&');
  }

  return data;
}
```

完成以上的基础代码之后，接下来我们将其应用到request函数中：

```js
function request({
  url,
  body = null,
  // 省略部分入参
  ...
} = {}) {
  return new Promise((resolve, reject) => {
    if (!url) {
      return reject(new TypeError('the required parameter [url] is missing.'));
    }
    
    // 省略部分代码
    // ...

    const xhr = new XMLHttpRequest();

    // 将请求接口地址以及请求体和 XHR 实例存入 cache 中
    let cacheKey = url;
    if (body) {
      cacheKey += `_${request.serialize(body)}`;
    }

    // 每次发送请求之前将上一个未完成的相同请求进行中断
    request.cache[cacheKey] && request.clearCache(cacheKey);
    request.cache[cacheKey] = xhr;
    
    // 省略部分代码
    ...

    xhr.onreadystatechange = function onReadyStateChange() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          // 请求完成之后清除缓存
          request.clearCache(cacheKey);
          resolve(xhr.response);
        }
      }
    };

    xhr.onerror = function onError(error) {
      console.log(error);
      // 请求报错之后清除缓存
      request.clearCache(cacheKey);
      reject({ message: '请求出错，请稍后重试' });
    };

    xhr.ontimeout = function onTimeout() {
      // 请求超时之后清除缓存
      request.clearCache(cacheKey);
      reject({ message: '接口超时，请稍后重试' });
    };

    xhr.send(body ? JSON.stringify(body) : null);
  });
}
```

实际应用：

```js
// 网页卸载前清除缓存
window.addEventListener('beforeunload', () => request.clearCache(), false);

// Vue 中路由跳转前清除缓存
router.beforeEach((to, from, next) => { request.clearCache(); next(); });


// React 中路由跳转时清除缓存
import { useEffect, useLocation } from 'react';

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    return () => {
      request.clearCache();
    }
  }, [pathname])
}

```

### 二、Axios

先基础封装：

```js
import axios from 'axios';
// 创建 axios 实例
const instance = axios.create({
  baseURL: 'https://www.some-domain.com/path/to/example',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
// 设置 axios 实例默认配置
instance.defaults.headers.common['Authorization'] = '';
instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

// 自定义请求拦截器
instance.interceptors.request.use(
  config => {
  // do something
    return config;
  }, 
  error => {
    return Promise.reject(error)
  }
);

// 自定义响应拦截器
instance.interceptors.response.use(
  response => {
  if (response.status === 200) {
    return Promise.resolve(response.data);
  }
  
    return Promise.reject(response);
  }, 
  error => {
    return Promise.reject(error)
  }
);
```

接下来我们结合Axios提供的CancelToken构造函数来创建一个简单的post请求：

```js
const CancelToken = axios.CancelToken;
let cancel;

instance.post('/api/user/123', {
  name: 'new name',
  phone: 'new phone',
}, {
  // CancelToken 构造函数接收一个 executor 函数参数，并且该函数接收一个取消函数 c 用于取消该次请求
  cancelToken: new CancelToken(function executor(c) {
    // 将取消函数赋值到外部变量，方便从外部取消请求
    cancel = c;
  }),
});

// 手动取消请求
cancel();
```

利用request拦截器来整合取消逻辑

```js
// cacheUtils.js
export const CacheUtils = {
  // 存储请求接口地址以及请求体和取消函数之间的映射关系
  cache: {},
  
  // 根据提供的键名 key 取消对应的请求，若未提供则取消全部请求
  clearCache: function (key) {
    if (key) {
      const cancel = this.cache[key];
      if (cancel && typeof cancel === 'function') {
        cancel();
        delete this.cache[key];
      }

      return;
    }

    Object.keys(this.cache).forEach(cacheKey => {
      const cancel = this.cache[cacheKey];
      cancel();
      delete this.cache[cacheKey];
    });
  },
};
```

```js
import qs from 'qs';
import { CacheUtils } from './cacheUtils.js';

// 自定义请求拦截器
instance.interceptors.request.use(config => {
  let cacheKey = config.url;
  
  const method = config.method.toLowerCase();
  if (method === 'get' && config.params && typeof config.params === 'object') {
    cacheKey += qs.stringify(config.params, { addQueryPrefix: true });
  }
  
  if (['post', 'put', 'patch'].includes(method) && config.data && typeof config.data === 'object') {
    config.data = qs.stringify(config.data);
    cacheKey += `_${qs.stringify(config.data, { arrayFormat: 'brackets' })}`;
  }
  
  // 每次发送请求之前将上一个未完成的相同请求进行中断
  CacheUtils.cache[cacheKey] && CacheUtils.clearCache(cacheKey);
  
  // 将当前请求所对应的取消函数存入缓存
  config.cancelToken = new axios.CancelToken(function executor(c) {
    CacheUtils.cache[cacheKey] = c;
  });
  
  // 临时保存 cacheKey，用于在响应拦截器中清除缓存
  config.cacheKey = cacheKey;
  
  return config;
}, error => Promise.reject(error));

// 自定义响应拦截器
instance.interceptors.response.use(response => {
  // 响应接收之后清除缓存
  const cacheKey = response.config.cacheKey;
  delete CacheUtils.cache[cacheKey];
  
  if (response.status === 200) {
    return Promise.resolve(response.data);
  }
  
  return Promise.reject(response);
}, error => {
  // 响应异常清除缓存
  if (error.config) {
    const cacheKey = error.config.cacheKey;
    delete CacheUtils.cache[cacheKey];
  }
  
  return Promise.reject(error);
});
```

### 三、fetch

`fetch API` 的取消

```js
const controller = new AbortController();

fetch('http://url?a=1', {
  signal: controller.signal
}).then(resp => resp.json()).then(data => {
  // do something
})

// 取消
controller.abort();
```

