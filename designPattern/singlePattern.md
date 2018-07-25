# 单例模式

> 单例模式是平常开发中也会经常碰到的一种设计模式。

## 例子

单例模式就是说在全局中只能存在一个实例，如果你想实例化出另一个实例的话，他就会返回已经实例化好的那个唯一的实例。

```js
let singleObj = null;

class SingleObject {  
  constructor() {
    if(singleObj) {
      throw Error('已实例化，不能重复初始化!!');
    }
    singleObj = this;
  }
  static getInstance() {
    if(singleObj === null) {
      singleObj = new SingleObject();
    } else {
      return singleObj;
    }
  }
}
```

这样就写成了一个单例，防止 new 初始化，就在构造函数中做了处理，然后，一般是通过 getInstance 来获取单例。

## 使用场景

1. redux 中的 store 
2. 登录框等等