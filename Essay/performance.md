# 试炼之石-Performance

> 最近在阅读 Vue 的源码的时候去溜达了一圈以前没有关注过的几个 API，比如 mark、measure 等等，于是总结一下前端监控利器 performance 相关的知识。

## 何为试炼之石？

可能有些做前端的同学不太了解这个 API，因为其实说实话，平常也不会接触这些，但是这却是一个很有用的 API。我们可以利用这个 API 完成对页面的性能表现达到十分精确的度量和控制。

下面呢，我们将会一起领略一下 performance 的魅力，关于 performance 的 API 等等的信息，网上其实说的已经非常多了，这里就不再赘述，有兴趣的可以自行查阅。

## 耗时统计

在 performance 中的 timing 对象里，存储了各种与浏览器性能有关的时间数据，我们可以通过其中的一些属性来获取到浏览器在不同阶段处理网页的耗时统计。

```js
const { timing } = performance;
const t = {};

// DNS 查询时间
t.dns = timing.domainLookupEnd - timing.domainLookupStart;
// 解析 DOM 树时间
t.dom = timing.domComplete - timing.domInteractive;
// 重定向时间
t.redirect = timing.redirectEnd - timing.redirectStart;
// 请求耗时
t.request = timing.responseEnd - timing.requestStart;
// 白屏时间
t.wait = timing.responseStart - timing.navigationStart;
```

其实我们能从这些时间里还能够得到非常多的信息，上面都是一些很常用的时间，我们可以从这些信息中获知整个页面的整体性能。

比如说：

1. DNS 查询时间长：这时候你就要考虑是不是使用的域名太多了，或者有没有做 DNS 预解析， 关于 DNS 预解析要注意的是在 HTTP 协议下 a 标签是默认开启的，而 HTTPS 是默认关闭的，需要自己开启。
2. 重定向时间：

## 打点分析

## 资源监控

