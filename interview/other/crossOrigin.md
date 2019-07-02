# 跨域解决方案 CORS

> CORS(Cross-Origin Resource Sharing):跨域资源共享，给我们提供了一种新的方法解决跨域问题

## 什么是跨域

这个问题是我们前端工程师所必备的一个技能，我们一定要会解决跨域的问题。那么跨域是什么。举个栗子，当站点 A 的一个页面发送了一个 ajax 请求去请求站点 B 的数据，出于安全考虑，浏览器限制了这种从脚本内去发起 HTTP 请求的方式，对于跨域来说，域名、端口、协议有一个不同就算是跨域。

## 解决跨域问题

### JSONP

这是对跨域最为常见的一种方式了，jQuery 里面也集成了这个方法，但是 jQuery 的方法名有点误导，其实这个和 ajax 一点关系都没有。

在 html 中有几个标签是不受跨域限制的，比如说 script、img、link 就不会受到同源策略的影响，而我们的 jsonp 就是利用了 script 标签不受影响这一点来进行跨域操作。

```js
const url = 'http://example.com/userinfo?userNo=123&callback=jp2';
function jsonp(url) {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script);
}
// 在本地设置一个回调函数
function jp2(data) {
  this.data = data.result;
}
//  服务器返回给我们的是一段代码
jp2({ code: 0, result: { user: 123, name: 'zhangsan' } });
```

这就是 JSONP 的实现原理，是不是很简单，但是 JSONP 有个限制是只能使用 GET 请求，而且你们看这个网页面插入 js 代码像不像注入，其实如果不注意的话会有一定的安全性的问题。

### hash

这是另一种跨域的解决方案，我们可以通过在 hash 值上面加我们希望传递的数据，然后在同一个页面的不同的 frame 中我们能够通过监听 hashchange 来拿到数据进行操作，这个比较简单就不写代码了。

### postMessage

这是 H5 提供的一个 API，这也给我们提供了一个新的解决跨域问题的方案。通常我们在解决服务器和客户端之间的数据传输，还有几个场景，比如说：页面和新窗口，多窗口以及与嵌套 frame 的跨域问题。

html5 引入的 message 的 API 可以方便、有效、安全的解决这些难题，postMessage(data,origin)方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。这个方法接收两个参数，第一个 data，是我们要传输的数据，第二个 origin 是我们目标窗口的源，协议+主机+端口号。

```js
//  这个页面是http://windowa.com/index.html
<div id="color">Frame Color</div>
<div>
    <iframe id="windowb" src="http://windowb.com/index.html"></iframe>
</div>
//  我们可以在windowa通过postMessage来向windowb传输数据
window.onload=function(){
   window.frames[0].postMessage('getdata','http://windowb.com');
}
//  在windowb里面我们可以监听
window.addEventListener('message', function(e) {
     const data=e.data + 'recive';
     e.source.postMessage(data,'*');
})
//  这样就实现了postMessage的跨域
```

### WebSocket

WebSocket API 是下一代客户端-服务器的异步通信方法，使用 ws 或 wss 协议。WebSocket API 最伟大之处在于服务器和客户端可以在给定的时间范围内的任意时刻，相互推送信息。以前客户端与服务器是一问一答的模式，服务器不能主动给客户端推送消息，而 WebSocket 可以做到这一点。

```js
// 创建一个Socket实例
const socket = new WebSocket('ws://localhost:8080');

// 打开Socket
socket.onopen = function(event) {
  // 发送一个初始化消息
  socket.send("I am the client and I'm listening!");

  // 监听消息
  socket.onmessage = function(event) {
    console.log('Client received a message', event);
  };

  // 监听Socket的关闭
  socket.onclose = function(event) {
    console.log('Client notified socket has closed', event);
  };

  // 关闭Socket....
  //socket.close()
};
```

如果你的浏览器不支持 WebSocket 的话还有选择，这里就不介绍了，看一下这篇文章[认识 HTML5 的 WebSocket](http://www.cnblogs.com/wei2yi/archive/2011/03/23/1992830.html)

### CORS

好了，终于到正题了，我们来说一说 CORS 这个东西。我们看一看 MDN 上是怎么说的，跨域资源共享（ [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS) ）机制允许  Web 应用服务器进行跨域访问控制，从而使跨域数据传输得以安全进行。浏览器支持在 API 容器中（例如  [XMLHttpRequest
](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)  或  [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) ）使用 CORS，以降低跨域 HTTP 请求所带来的风险。

我们可以去看一下各个厂对 CORS 的支持状态，来看看是否要使用 CORS。

CORS 将请求分成两种，一种是简单请求，一种是非简单请求。满足下面两者就是简单请求：

1.  请求方法是以下三种方法之一：
    HEAD
    GET
    POST
2.  HTTP 的头信息不超出以下几种字段：
    Accept
    Accept-Language
    Content-Language
    Last-Event-ID
    Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

如果是简单请求就是在头信息之中，增加一个 Origin 字段。

Access-Control-Allow-Origin 就是代表了允许哪些域能访问资源，\*代表所有，但是不推荐这么做，如果不在允许范围内就会报错，通过 XMLHttpRequest 的 onerror 就能够捕获到。

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json。非简单请求会在正式通信之前先预检一次，去询问服务器在不在允许范围之内，要那些头信息，服务器响应答复，客户端才会有动作。

"预检"请求用的请求方法是 OPTIONS，表示这个请求是用来询问的。

推荐一下阮一峰老师的博文[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

关于跨域就讲到这里，下回再见。
