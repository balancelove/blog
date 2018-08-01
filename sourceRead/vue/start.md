# new Vue()

> 从入口的 entry-runtime-with-compiler.js 一步一步的往下找，可以找到 instance 目录下的 index.js 文件。

## 构造函数

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

当我们实例化 Vue 的时候，就是调用了这个函数，并且将参数传递进去，我们可以看到在实例化函数中，Vue 调用了一个 `_init` 函数，而这个函数是在加载代码的时候运行 `initMixin(Vue)` 的时候在 Vue 的原型上挂载了一个 `_init`函数。

## Vue.prototype._init

1. [合并选项](./start/merge.md)
2. [初始化函数](./start/func.md)
3. [$mount](./start/$mount.md)