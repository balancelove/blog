# 状态模式

> 在状态模式（State Pattern）中，类的行为是基于它的状态改变的。这种类型的设计模式属于行为型模式。

## 例子

比如说常见的红绿灯切换就可以理解为一种状态模式，还比如 Promise、状态机等等，有个 js 的库叫做 `javascript-state-machine`。

其实 Promise 也是一种状态的变化，从 Pending -> Resolve/Reject。

```js
class MyPromise{
    constructor(fn) {
        this.successList = [];
        this.failList = [];
        
        fn(() => {
            resolve(this);
        }, () => {
            reject(this);
        });
    }
    then(successFn, failFn) {
        this.successList.push(successFn);
        this.failList.push(failFn);
    };
}
```

