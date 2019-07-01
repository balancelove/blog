# H5 video 标签 ——属性和方法

## 前述

video 是 h5 的一个很重要的标签，它代替了以前我们在网页中播放视频时使用的flash，我们学习直播，最重要的就是要去学习怎么去很好的使用这个标签。大家在很多视频的网站，点开控制台其实都能够看到这个标签，但是在 src 看到的视频地址大家可能会有疑惑，这个视频地址是 blob 开头的，是一个虚拟的地址，我们无法通过这个地址去找到视频。

还有我们可以看到很多很花哨好看的播放器，其实这都是通过 dom 来实现的，说了这么多，大家一定对 video 很感兴趣了，下面我们就来一起看一看这个神奇的 video 标签。

## 属性和方法

- 基础的用法

    ```html
    <video src="./video.mp4" controls></video>
    ```

- 控制条属性：controlslist<nodownload/nofullscreen/noremoteplayback>

    ```html
    <video src="./video.mp4" controls controlslist="nodownload"></video>
    ```

- 贴图：poster

    ```html
    <video src="./video.mp4" controls poster="./poster.jpg"></video>
    ```

- 静音： muted

    ```html
    <video src="..." muted controls></video>
    ```

- 自动播放： autoplay

    ```html
    <video src="..." autoplay></video>
    ```

- 循环播放：loop

   ```html
   <video src="..." loop></video>
   ```

- 预加载： preload

    ```html
    <video src="..." preload></video>
    ```

- 音量控制

    ```js
    // 只能通过 js 去设置音量，在标签上直接写没用
    const v = document.getElementById('my_video');
    v.volume = 0.5;
    ```

- 控制时间

    ```js
    const v = document.getElementById('my_video');
    v.currentTime = 60; // 设置时间的单位是秒 s
    ```

- 切换视频地址（比如说切换高清、超清）

    ```js
    const v = document.getElementById('my_video');
    v.src = './other.mp4';
    ```

- 备用视频地址

    ```html
    <video controls>
      <source src="./video1.mp4" type="video/mp4"/>
      <source src="./video2.mp4" type="video/mp4"/>
    </video>
    ```

