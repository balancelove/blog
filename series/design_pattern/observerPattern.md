# 观察者模式

> 观察者模式是前端最频繁的一个模式，一定要掌握的模式。

## 例子

```js
class Subject {
  constructor() {
    this.state = 0;
    this.observer = [];
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    this.notify();
  }
  notify() {
    this.observer.forEach(ob => ob.update());
  }
  attach(observer) {
    this.observer.push(observer);
  }
}

class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }
  update() {
    console.log(this.subject.getState());
  }
}
```

我们在被观察的对象里要维护一个观察者数组，然后当自身的值发生变化的时候，就去调用观察者的更新函数。

## 使用场景

1. 网页事件绑定
2. Promise
3. Vue 双向绑定