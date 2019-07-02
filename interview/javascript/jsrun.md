# 运行机制

## 如何理解 JS 单线程

同一时间只能执行一个任务

## 异步任务

setTimeout setInterval

DOM 事件

ES6 的 Promise

https://github.com/dwqs/blog/issues/61

https://segmentfault.com/a/1190000008595101

https://zhuanlan.zhihu.com/p/26238030

关键词： `Event Loop` `task` `micro-task`

## 正文

从例子开始：

```js
console.log('golb1');
setImmediate(function() {
  console.log('immediate1');
  process.nextTick(function() {
    console.log('immediate1_nextTick');
  });
  new Promise(function(resolve) {
    console.log('immediate1_promise');
    resolve();
  }).then(function() {
    console.log('immediate1_then');
  });
});
setTimeout(function() {
  console.log('timeout1');
  process.nextTick(function() {
    console.log('timeout1_nextTick');
  });
  new Promise(function(resolve) {
    console.log('timeout1_promise');
    resolve();
  }).then(function() {
    console.log('timeout1_then');
  });
  setTimeout(function() {
    console.log('timeout1_timeout1');
    process.nextTick(function() {
      console.log('timeout1_timeout1_nextTick');
    });
    setImmediate(function() {
      console.log('timeout1_setImmediate1');
    });
  });
});
new Promise(function(resolve) {
  console.log('glob1_promise');
  resolve();
}).then(function() {
  console.log('glob1_then');
});
process.nextTick(function() {
  console.log('glob1_nextTick');
});
```

有点长，但是货很足。

### 关于优先级

任务分两类：

- macro-task(宏任务): script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering
- micro-task: process.nextTick, Promises, Object.observe, MutationObserver

**micro-task 的 优先级高于 macro-task。**

老版本的 Node 会优先执行 process.nextTick。

setTimeout 的优先级比 setImmediate 的高(**setTimeout 的时间小于等于 6s 时候优先级比后者高**)

同时异步任务会合并。

在每次轮训检查中，各观察者的优先级分别是：

idle 观察者 > I/O 观察者 > check 观察者。

idle 观察者：process.nextTick

I/O 观察者：一般性的 I/O 回调，如网络，文件，数据库 I/O 等

check 观察者：setImmediate，setTimeout

在新版的 Node 中，process.nextTick 执行完后，会循环遍历 setImmediate(如果有多个被添加到了 list 里)，将 setImmediate 都执行完毕后再跳出循环。所以两个 setImmediate 执行完后队列里只剩下第一个 setImmediate 里的 process.nextTick。最后输出”强势插入”。

在 Chrome 中，上面说的合并会有不同，他会分别执行。

new Promise(fn): fn 是同步执行的。
