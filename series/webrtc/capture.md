# 视频截图

## 截图

我们可以使用 canvas 来进行截图的操作，调用 canvas 的 drawImage 方法，就可以从视频流中抓取到正在显示的图片了。

我们可以看到 drawImage 接收的参数类型是这样的，`HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas`。

所以说我们可以直接传入 video 标签，然后确定宽高就能够快速的进行截图了。

于是乎我们这样就截图成功了。

```html
<canvas id="photo"></canvas>
```

```js
const photo = document.querySelector('canvas');
photo.width = 300;
photo.height = 400;

photo.getContext('2d').drawImage(video, 0, 0, photo.width, photo.height);
```

这样我们就完成了截图的操作。

## 保存图片

我们可以通过 `Canvas` 的 `toDataURL` 方法获得图片的地址，接着就能够通过 a 标签来进行下载了。

```js
const downloadPhoto = url => {
  const a = document.createElement('a');
  a.download = 'photo';
  a.href = url;
  document.appendChild(a);
  a.click();
  a.remove();
};

downloadPhoto(canvas.toDataURL('image/jpeg'));
```

## 滤镜

关于滤镜，简单的就是 `CSS` 里的 `filter` 属性。

当然了，也可以用 canvas 来实现滤镜的效果，这个相对来说比较复杂，但是也有一些很方便使用的库。
