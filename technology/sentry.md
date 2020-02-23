# 给你的项目装个探头 — Sentry

> 在线上环境中，因为应用跑在用户浏览器中，发生错误时我们如果要对其进行调试就会显得比较困难。所以我们接入了 Sentry 服务对远程错误进行记录，接下来我们将会一步一步接入 Sentry 服务。

## 初始化 Sentry

我们可以到 [Sentry](https://sentry.io/welcome/) 官网中去创建一个账号，然后我们在 Sentry 中根据我们项目类型创建一个项目，由于这里我们做演示是 React 应用，所以我们选择 React，当然了 Sentry 支持非常多的类型，大家可以按照自己项目进行添加。

![](https://user-gold-cdn.xitu.io/2019/6/27/16b97b7cd01f77ee?w=1659&h=379&f=png&s=77892)

这时候，我们会看到这个界面，我们点击按钮。这时候会出现例子，我们先记住，然后开始创建我们的 React 应用。

## 初始化 React 应用

我们用 `create-react-app` 创建好我们的应用，并且安装好 `@sentry/browser`。

接着我们在 `index.js` 里初始化 `Sentry`。

```jsx
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://54ad7a14513e48bbb9b20698da401d1d@sentry.io/1491516'
});
```

然后，在 `App.js` 里写一段抛出错误的代码。

```jsx
<button
  onClick={() => {
    throw new Error('抛出错误');
  }}
>
  throw error
</button>
```

点击按钮，我们就能够在 `Sentry` 中看到错误了。

![](https://user-gold-cdn.xitu.io/2019/6/27/16b985d3b6b69d2b?w=1690&h=177&f=png&s=31640)

我们点击进去之后可以看到非常多的信息，包括错误堆栈，以及浏览器的事件等等，这些都能够帮助我们快速定位问题，并且在邮箱中我们收到了来自 `Sentry` 的报警邮件。

![](https://user-gold-cdn.xitu.io/2019/6/27/16b98614c6bf3528?w=1378&h=1562&f=png&s=568025)

等等，我们好像忘记了一个问题，如果别人也往这里发报错信息，我们会接收到所有的报错信息，但是我们只想收到我们应用的报错。

可以在这个地方设置我们接收的域名。

![](https://user-gold-cdn.xitu.io/2019/6/27/16b98674c72e6336?w=1192&h=142&f=png&s=20623)

## 设置 releases

在我们项目进行版本迭代的过程中，我们在一个新版本修复了一个问题，但是由于用户使用的是老版本，所以同样的错误又暴露出来了，这时候我们就能够清楚的知道，这是因为用户使用了老版本代码造成的。

那么我们要如何在 `Sentry` 中设置项目的版本呢？很简单，就像下面这样：

```jsx
Sentry.init({
  dsn: 'https://54ad7a14513e48bbb9b20698da401d1d@sentry.io/1491516',
  release: 'sentry_example@20190627121204'
});
```

这样新版本上的错误就会被标记成 `sentry_example@20190627121204`。

![](https://user-gold-cdn.xitu.io/2019/6/27/16b987091139cf64?w=1669&h=435&f=png&s=70924)

## sourceMap

上面说的这些，我们能够简单的对项目进行错误预警，但是有个问题就是当我们将项目进行打包之后代码变得极其难阅读，这样的报错信息对于我们来说是不友好的，那么我们要怎么解决这个问题呢？

答案当然就是给 `webpack` 的配置加上 `source-map` 了，我们将 `webpack` 的配置打开，这时候我们再进行编译就会出现 map 文件了。

那么 `Sentry` 是如何知道我们的 map 文件的呢？答案就是我们需要将 map 文件上传到 `Sentry` 中去，也就是说，我们在 `build` 之后需要将文件上传一份到 `Sentry` 中去，同时，我们将版本和 map 文件结合起来，也就是说我们需要先建立一个版本，然后将对应版本的文件上传上去，那么我们该如何操作呢？

1. 第一步，先安装 `@sentry/cli` 工具
2. 第二步，在编译之后进行版本确定以及文件上传工作

```bash
# 我们确定版本号的格式为 sentry_example@20190627220147
# 这时候我们使用 sentry-cli 工具创建对应的版本
$ sentry-cli releases new sentry_example@20190627220147
# 再使用 sentry-cli 上传文件
$ sentry-cli releases files sentry_example@20190627220147 upload-sourcemaps --url-prefix http://localhost:8080 ./build
# 圆满成功
```

上面的操作中有个需要注意的点，就是 `--url-prefix` 参数是你的静态文件访问的前缀，这个一定要写对，不然它对应不起来。

3. 第三步，使用 `http-server` 启动一个服务，然后访问它，再点击抛错按钮。

通过上面几步，我们又在 `Sentry` 中收到了报警。

![](https://user-gold-cdn.xitu.io/2019/6/28/16b9dd31accce861?w=2180&h=776&f=png&s=100867)

bingo，我们看到了更容易阅读的错误报告，同时，你还可以去设置邮件、钉钉、微信等接入报错提醒，关于 `Sentry` 接入更多信息，可以到官网查看[文档](https://docs.sentry.io/)。

最后，大家使用 `Sentry` 还有场景是需要自己在内网搭建部署，如果是配合 Docker，那么搭建 `Sentry` 服务就变得非常简单了。

经过迷茫后，博客将继续更新，欢迎 Star，敬请期待。

https://github.com/balancelove/readingNotes
