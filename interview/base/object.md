# 面向对象

## 类与继承

```js
// 借助构造函数实现继承，缺点： 无法继承 P1.prototype
function P1() {
    this.name = 'parent 1';
}
function C1() {
    P1.call(this);
    this.type = 'c1';
}
const c1 = new C1();
// 借助原型链实现继承，缺点： 修改引用类型的值，会把所有实例的值都修改了
function P2() {
    this.name = 'parent 2';
}
function C2() {
    this.type = 'c2';
}
C2.prototype = new P2();
const c2 = new C2();
// 如何解决上面的问题？借用构造函数给每个子类都 copy 一份数据
function P3() {
    this.name = 'parent 3';
    this.hots = [1,2,3];
}
function C3() {
    P3.call(this);
    this.type = 'c3';
}
C3.prototype = new P3();
const c3 = new C3();
// 如何解决执行了两次父类构造函数的问题？
function P4() {
    this.name = 'parent 4';
    this.hots = [1,2,3];
}
function C4() {
    P4.call(this);
    this.type = 'c4';
}
C4.prototype = P4.prototype;
const c4 = new C4();
// 还有什么问题？父类的 constructor 覆盖了子类的 constructor
function P5() {
    this.name = 'parent 5';
    this.hots = [1,2,3];
}
function C5() {
    P5.call(this);
    this.type = 'c5';
}
C5.prototype = Object.create(P5.prototype);
C5.prototype.constructor = C5;
const c5 = new C5();
```

