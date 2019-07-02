# 前端通信

## 什么是同源策略及限制

源：协议、域名、端口

限制：

- Cookie、LocalStorage、IndexDB 无法获取
- DOM 无法获得
- AJAX 请求无法发送

## 前后端如何通信

- AJAX
- WebSocket
- CORS

## 如何创建 Ajax

- XMLHttpRequest 对象工作流程
- 兼容性处理，IE
- 事件触发条件
- 事件触发顺序

new -> open -> setRequestHeader -> send

## 跨域通信的几种方式

- JSONP(get): 先在全局注册一个函数，然后把函数名作为 script 地址的一部分发出去，响应的是这个函数
- WebSocket
- hash
- CORS: 新出的通信标准，支持跨域的 AJAX，加一个 Origin 就可以跨域了。 为什么支持跨域通信，浏览器会拦截 ajax 请求，加上 origin。
- postMessage: 注意给谁发消息，就是窗口.postMessage
