# 【npm 库】vm2, 安全的沙箱环境

> 这是一个 Node 官方 vm 的替代品，主要是解决了安全性的问题。

[[toc]]

## vm 是什么

vm 是 Node.js 官方提供的一个库，用于在 V8 环境中执行 JS 代码，那么我们可以使用它来做什么呢？比如我们可以通过 vm 来执行不受信任的代码，比如说用户提交的代码。

那为什么又说它不安全呢？答案是 Node.js 官方库中的 vm 模块是不安全的，可以被用户脚本轻易的突破，获取主程序的 Context。

## 更安全的 vm2

```js
const { VM } = require('vm2');
const vm = new VM({
  timeout: 1000,
  sandbox: {}
});

vm.run(`process.exit()`); // TypeError: process.exit is not a function
```

vm2 的原理就是使用 JavaScript 的 Proxy 技术来防止沙箱脚本逃逸。

## 更多资源

NPM 酷库：vm2，安全的沙箱环境: https://segmentfault.com/a/1190000012672620
