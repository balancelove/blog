# HTTP 

## http 协议特点

- 简单快速
- 无状态
- 无连接
- 灵活

## 报文组成部分

### 请求报文

- 请求行
- 请求头
- 空行
- 请求体

### 响应报文

- 状态行
- 响应头
- 空行
- 响应体

## 方法

- GET
- POST
- PUT
- PATCH
- OPTION
- DELETE

## POST 和 GET 的区别

- GET 请求信息在 url，POST 在请求体中
- GET 相比 POST 不安全
- GET 产生的 url 可以被收藏
- GET 请求长度有限制
- GET 会被浏览器主动缓存

## 状态码

- 1XX: 信息相关
- 2XX: 成功 204 no content
- 3XX: 重定向301 304
- 4XX: 客户端错误 401 403 404
- 5XX: 服务器错误 500

## 持久链接

Keep-Alive

## 管线化

Q1 -> R1 -> Q2 -> R2

Q1 -> Q2 -> R1 -> R2

- 通过持久连接完成
- 要求服务端支持



