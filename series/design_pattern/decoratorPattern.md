# 装饰器模式

> 装饰器这个名字相信大家能看出点端倪，它只是装饰用的，并不会改变原有的内容。由此可以看出一些特点，它为对象添加新功能，但是不影响原有功能。

## 例子

先做一个简单的装饰器。

```js
class Dot {
  draw() {
    console.log('画一个点');
  }
}

class Decorator {
  constructor(dot) {
    this.dot = dot;
  }
  draw() {
    this.dot.draw();
    console.log('变成红色的');
  }
}

const dot = new Dot();
const deco = new Decorator(dot);
deco.draw();
```

这是一个非常简单的例子，同时在 ES 7 的提案中装饰器就是一个很好的例子。

```js
// 被装饰类
@decorator
class Test {
  
}

// 装饰器
function decorator(target) {
  target.isTest = true;
}

Test.isTest; // true
```

至于详细的装饰器的理解，就移步到 ECMAScript 里去看啦。