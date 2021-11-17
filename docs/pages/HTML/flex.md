### rem布局
- **什么是rem**
 
`rem（font size of the root element）`是指相对于根元素的字体大小的单位。简单的说它就是一个相对单位。
（例如：如果设置了html{font-size:20px;}，那么1rem=20px）

`em（font size of the element）`是指相对于父元素的字体大小的单位。

- **一些概念**
1. 物理像素：分辨率
2. 逻辑像素：css像素（设备独立像素）
3. 设备像素比dpr：devicePixelRatio,物理像素分辨率与CSS像素分辨率之比

- **实现思路**
1. 目标是：`设计稿上的值px/100 = rem值`。当屏幕宽度大于等于设计稿宽度时，此时根节点的`font-size`设置为`100px`。屏幕宽度小于设计稿宽度时，根节点的`font-size`则按比例（`屏幕宽/设计稿宽`）减小。

（举个例子：在屏幕宽为1080时，将一个元素宽设置为`10.8rem`，此时元素与屏幕等宽。假设将屏幕缩小至`900`，此时的根元素`font-size`等比缩小至`900/1080 *100`，元素宽变为`10.8 * 900/1080 *100 = 900 `，还是等于屏幕宽）
2. 自动计算font-size
2. 解决浏览器和低端安卓版本的webview缩放


- **具体实现**

```js
/**
* @param {Number} designWidth 设计稿宽度
*/
function calc(designWidth) {
    var html = document.documentElement;
    
    function recalc() {
        // 屏幕宽度
        var dpi = html.clientWidth > designWidth ? designWidth : html.clientWidth;
        // 计算公式： designWidth/dpi = 100/fontSize
        var fontSize = parseFloat(dpi / designWidth * 100);
        html.style.fontSize = fontSize + 'px';
        <!-- 2.解决浏览器及低端安卓版本的webview缩放 -->
        var changedFontSize = parseFloat(window.getComputedStyle(html)['font-size']);
        if(Math.abs(fontSize - changedFontSize) > 0.1) {
            html.style.fontSize = fontSize * fontSize /changedFontSize + 'px';
        }
    }
    
    recalc();
    
    window.addEventListener('resize', recalc);
}

// 假设设计稿宽度为1080
calc(1080)
```

`设计稿上的宽度 / 100`，就是最终的`rem`值

（假设设计稿有个图片宽度为`100px`，则书写`css`时，应设置为`1rem`）

- **打包后代码**(用于脱敏处理)：

```js
<!-- 动态计算REM，根据设计稿上的尺寸（像素）除以100即可得到对应的REM -->
    <script>
      !(function(t) {
        var e = {};
        function n(r) {
          if (e[r]) return e[r].exports;
          var o = (e[r] = { i: r, l: !1, exports: {} });
          return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
        }
        (n.m = t),
          (n.c = e),
          (n.d = function(t, e, r) {
            n.o(t, e) ||
              Object.defineProperty(t, e, {
                configurable: !1,
                enumerable: !0,
                get: r
              });
          }),
          (n.n = function(t) {
            var e =
              t && t.__esModule
                ? function() {
                    return t.default;
                  }
                : function() {
                    return t;
                  };
            return n.d(e, "a", e), e;
          }),
          (n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }),
          (n.p = ""),
          n((n.s = 0));
      })([
        function(t, e) {
          !(function(t, e) {
            var n = 1080;
            function r() {
              var r = ((e.clientWidth < n ? e.clientWidth : n) / n) * 100;
              o(r);
              var i = parseFloat(t.getComputedStyle(e)["font-size"]);
              Math.abs(i - r) > 0.1 && o((r * r) / i);
            }
            function o(t) {
              e.style.fontSize = t + "px";
            }
            t.calcRem = function(e) {
              (n = e), r(), t.addEventListener("resize", r);
            };
          })(window, document.documentElement);
        }
      ]);
    </script>
    <script>
      calcRem(1080);
    </script>
```

### flexible.js
 ##### 原理
 
 我们把设计稿分成10等份，设计稿 A = W/10，我们把设备可视区域也就是我们的各种移动端设备的这个画布也分成10份，并赋值给根元素的fontSize，我们都知道rem是根据根元素字体大小计算的，所以我们的1rem也就是设备可视区域/10，现在设计稿上有一块区域宽B，那它是不是等比放到设备可视区域的宽度为 B/A rem。再啰嗦一下，B在设计稿上占B/A份，那在设备可视区域上也要占B/A份对不对，所以宽是B/A rem。
