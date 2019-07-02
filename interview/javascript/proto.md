# 原型链

## 创建对象有几种方法

1. 对面字向量、new Object()
2. new 创建
3. Object.create()

## 原型、构造函数、实例、原型链

所有函数都有一个 prototype 属性： 原型对象

所有对象都有一个 \_\_proto\_\_ 属性：指向它的原型对象，也就是构造函数的 prototype 属性

F.prototype === 原型对象

f = new F()

f.\_\_proto\_\_ === F.prototype

## instanceof 原理

f.\_\_proto\_\_ 是否等于 F.prototype，链式寻找

## new 运算符

1. 一个新对象创建，继承自 foo.prototype
2. 构造函数 foo 执行，执行的时候传参，同时 this 指向改变为这个新实例。
3. 如果构造函式返回了一个对象，那么会覆盖 new 出来的对象。

```js
function new(constructor) {
    const o = Object.create();
    const k = constructor.call(o);
    if(typeof k === 'object') {
        return k;
    } else {
        return o;
    }
}
```
