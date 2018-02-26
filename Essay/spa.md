# 大话 SPA router

> 好吧，俺承认好像要当一把标题党了，这篇文章目的是记录一下对于 spa 的核心 —— 路由的学习，并没有什么超人类的东西，好了，我们开始吧。

## SPA 是个啥？

相信还是有不少的萌新是不知道 SPA 是个啥？是不是想问一句，你是谁？你是不是搞美容的那个 SPA。其实并不是，SPA 在前端领域可不是美容的，它是单页应用的意思，那么啥是单页应用呢？在这个时代如果不知道这个名词的多半是萌新了,我们也简单的聊一聊这个东西。

以前我们开发应用的时候，会写多个页面，比如说首页、详情等等，我们通过点击页面的 a 标签，然后去获取另一个页面，重新加载，或者跳转。而单页应用只提供一个 HTML 文件，在页面初始化的时候加载 js、css 等等，然后通过 js 去动态更新视图，从而实现交互，这避免了页面的刷新，跳转等等。

So，单页应用的优点是啥呢？

- 前后端分离，提升开发效率
- 减轻服务器压力，前端完成很大一部分逻辑
- 提升用户体验，如丝般润滑啊

## 技术核心

> 其实谈到 SPA，我们实现的方法大概就有 hash 和 H5 的 History 两种，我们来了解下。

### History API

在 HTML5 中，我们可以发现 History 多出了几个 API，我们来一起走一遍：

1. __history.pushState( data, title[, url] ):__ 顾名思义，往历史记录栈栈顶添加一条数据，data 会作为触发 popstate 事件的时候的参数，titile 为标题，url 为页面地址。
2. __history.replaceState( data, title[, url] ):__ 这个方法是用来更换历史记录的。
3. __history.state:__ 获取当前历史栈栈顶数据。
4. __event -> popstate:__ 当用户点击浏览器回退或者前进按钮就会触发 popstate 事件。

我们来搞一个简单的例子，就知道 history 是怎么做的了。

```html
<div id="app">
  <a class="route" path="a.html">首页</a>
  <a class="route" path="b.html">详情页</a>
</div>
```

这是 html 文件，下面就是 js 文件了：

```js
const routes = document.querySelectorAll('.route');
routes.forEach(route => {
    route.addEventListener('click', e => {
        e.preventDefault();
        // 在这里面，我们也是可以通过参数的不同，然后渲染不同的页面。
        const path = route.getAttribute('path');
        window.history.pushState({ public: 'data' }, null, path);
    }, false);
});

window.addEventListener('popstate', e => {
    // 比如说在这里面可以通过路径的不同，然后去渲染不同的页面。
}, false);
```

我们首先是通过点击，然后将 data、url 等参数 push 到栈里面，然后渲染页面，如果说我们通过浏览器的回退或者前进，就会触发 popstate，然后通过不同路径进行页面渲染，其实 history 就是这么一个基本原理。

### Hash

这种方案就是去监听 hash 的变化，然后去做相应的操作，其实非常简单，我们需要用到 __location.hash__ 和 __hashchange__ 这个事件就好了，很简单，和上面的操作差不多这里就不说了。

> 如果各位看官看的还行，可以到 [GitHub](https://github.com/balancelove/readingNotes) 里给我一颗小小的 star 支持一下，谢谢。
