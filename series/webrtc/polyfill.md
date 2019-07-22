# 浏览器适配

由于各个浏览器对 API 的叫法不同，所以要适配各种浏览器的情况。

```js
const getUserMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.mediaDevices.webkitGetUserMedia ||
  navigator.mediaDevices.mozGetUserMedia;
```

Google 开源库 `adapter.js` 适配各种浏览器。
