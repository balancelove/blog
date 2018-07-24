# 工厂模式

> 工厂模式隐藏了背后的制作过程，暴露出来一个统一的接口。

## 例子

比如说，我去麦当劳买东西，我只需要在点餐机点我需要的食物就行了，而我不用关心食物是怎么做出来的。

```js
// 汉堡包类
class Hamburger {
  constructor(name) {
    this.name = name;
  }
  init() {
    alert(`这是一个${this.name}`);
  }
}

// 薯条
class FrenchFries {
  constructor(name) {
    this.name = name;
  }
  init() {
    alert(`这是一份薯条`);
  }
}

// 麦当劳
class Creator {
  create(name) {
    switch(name) {
      case '汉堡':
        return new Hamburger();
      case '薯条':
        return new FrenchFries();
      default:
        return '';
    }
  }
}
```

工厂模式将这一系列的类集合在一起，然后提供了一个公共的方法通过不同的参数去创建不同的类。