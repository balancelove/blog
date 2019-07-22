# 通过浏览器获取音视频设备

## WebRTC 设备管理

### navigator.mediaDevices.enumerateDevices

`navigator.mediaDevices.enumerateDevices` 获取电脑的音频、视频设备信息。

返回 `InputDeviceInfo / MediaDeviceInfo`。

- deviceId: 设备 Id
- groupId: 设备组 Id，两个设备组 Id 相同代表是同一个物理设备
- kind: 设备类型
- label: 标签

## 音视频采集

### getUserMedia

我们使用这个 API 来访问设备。

```js
navigator.mediaDevices.getUserMedia(constraints);
```

同时我们也能看到这个函数返回的是一个 `Promise<MediaStream>`，而传进去的参数 `constraints` 的定义是这样的。

```ts
interface MediaStreamConstraints {
  audio?: boolean | MediaTrackConstraints;
  peerIdentity?: string;
  video?: boolean | MediaTrackConstraints;
}
```

`constraints` 的意思是限制，也就是说通过上面的定义我们能够知道，我们能够通过传入的参数控制返回的媒体流中包含音频流或者是视频流,或者也可以两者同时采集。

比如你只想采集音频流，那么你可以这样：

```js
navigator.mediaDevices.getUserMedia({
  audio: true
});
```

那除了布尔值，还可以传 `MediaTrackConstraints` 类型的参数呢？

```ts
interface MediaTrackConstraints extends MediaTrackConstraintSet {
  advanced?: MediaTrackConstraintSet[];
}

interface MediaTrackConstraintSet {
  // 视频宽/高度比
  aspectRatio?: ConstrainDouble;
  // 自动增益
  autoGainControl?: ConstrainBoolean;
  // 声道数
  channelCount?: ConstrainULong;
  // 设备 ID
  deviceId?: ConstrainDOMString;
  // 回音消除
  echoCancellation?: ConstrainBoolean;
  // 开启的摄像头："user" 前置 | "environment" 后置 | "left" 前置左 | "right" 前置右
  facingMode?: ConstrainDOMString;
  // 帧率
  frameRate?: ConstrainDouble;
  // 设备组 ID
  groupId?: ConstrainDOMString;
  // 视频高度
  height?: ConstrainULong;
  // 延迟
  latency?: ConstrainDouble;
  // 降噪
  noiseSuppression?: ConstrainBoolean;
  // 是否能调整视频大小
  resizeMode?: ConstrainDOMString;
  // 音频采样率
  sampleRate?: ConstrainULong;
  // 音频采样大小
  sampleSize?: ConstrainULong;
  // 音量
  volume?: ConstrainDouble;
  // 视频宽度
  width?: ConstrainULong;
}
```

我们可以看到其实上面的参数就是对音视频流的进一步控制。

好了，接下来我们写一个简单的例子来试一试。

## 例子

我们创建一个 `HTML` 文件，就像这样：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>WebRTC</title>
  </head>
  <body>
    <h1>Hello, dashuaibi</h1>
    <video autoplay></video>
    <script src="./index.js"></script>
  </body>
</html>
```

然后创建一个 `index.js`，就像这样：

```js
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true
  })
  .then(stream => {
    const video = document.querySelector('video');
    video.srcObject = stream;
  })
  .catch(err => {
    alert('您拒绝提供设备权限，已退出。');
  });
```

然后，我们打开这个页面就会发现，浏览器提示我们是否要使用麦克风和摄像头，我们点击允许。

这时候我们点击了允许之后，我们要将采集到的的视频展示出来，那就需要 `video` 这个标签了，然后我们加上自动播放的标签，完美。

接下来就就能够在自己刚打开的页面里面看到自己了,而关于刚刚说到的参数问题就自己多试一试就知道了。
