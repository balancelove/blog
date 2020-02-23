# 【npm】windows 下 fsevents 包安装错误

## 问题背景

有朋友在 windows 下安装 webpack 的时候出现了 `-4048 operation not permitted` 的问题。

## 解决方案

- npm 降级，5.3.0 是没有这个问题的
- npm 升级，现在 npm 应该是修复了这个问题的
- 使用 yarn 进行安装（这个方法没试过，大家可以去尝试一下）
- npm install 的时候加上 --no-optional 的参数

## Why?

最先想到的是没有权限，那么就直接管理员运行然后再装呗，这次总该有权限了吧。好吧，事情和我们想的完全不一样，还是继续报错。

试了各种清缓存等等，都不行，于是去 stackoverflow 上找了一发，没想到好像是 npm 5.4.0 有问题，这是 [issue](https://github.com/npm/npm/issues/18287)。

其实是 [fsevents](https://www.npmjs.com/package/fsevents) 这个包是针对 OS X 的，windows 下木有这个东西。
