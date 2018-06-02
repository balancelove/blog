# h5 video 标签——事件

接上次说到的属性，这次说一下 video 标签的事件，以及我们利用这些事件可以做些什么。

## 事件

```js
const video = document.getElementById('my_video');
// 视频开始加载触发，第一个被触发的事件
video.addEventListener('loadstart', e => {
    // ...
});
// 时长变化，刚开始的时候是没有的，是 NaN，当能够拿到视频时长的时候就会触发(可能多次触发),至于时长和视频格式有关
video.addEventListener('durationchange', e => {
    // ...
});
// 视频元数据加载完成
video.addEventListener('loadedmetadata', e => {
    // ...
});
// 没有足够的视频帧和音频帧去播放的时候，就会触发加载视频数据
video.addEventListener('loadeddata', e => {
    // ...
});
// 下载信息、数据时触发
video.addEventListener('progress', e => {
    // ...
});
// 视频可以播放时触发（数据准备好了）
video.addEventListener('canplay', e => {
    // ...
});
// 视频可以流畅的播放
video.addEventListener('canplaythrough', e => {
    // ...
});
// 播放视频
video.addEventListener('play', e => {
    // ...
});
// 暂停视频
video.addEventListener('pause', e => {
    // ...
});
// 点击进度条触发事件，还没有加载视频
video.addEventListener('seeking', e => {
    // ...
});
// 这次 seek 结束
video.addEventListener('seeked', e => {
    // ...
});
// 没有足够的数据,等待数据
video.addEventListener('waiting', e => {
    // ...
});
// 从 waiting 变成 playing
video.addEventListener('playing', e => {
    // ...
});
// 播放时间点变化触发
video.addEventListener('timeupdate', e => {
    // ...
});
// 视频结束
video.addEventListener('ended', e => {
    // ...
});
// 报错
video.addEventListener('error', e => {
    // ...
});
```

