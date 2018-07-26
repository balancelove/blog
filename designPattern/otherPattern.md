# 其他设计模式

## 中介者模式

对象之间互相调用，十分繁杂。这时候就可以写一个中介者，通过中介者将各个对象串联起来。

![](./images/中介者.jpg)

## 原型模式

其实前端对这个模式感觉需求不多，就是有一个 Object.create() 这个函数就能够完成对象的复制。

## 桥接模式

```js
class Color{
    constructor(name) {
        this.name = name;
    }
}

class Shape{
    constructor(name, color) {
        this.shape = name;
        this.color = color;
    }
    draw() {
        console.log(`这是一个${this.color.name}的${this.shape}`);
    }
}

const color = new Color('黄色');
const shape = new Shape('正方形', color);
shape.draw();
```

![](./images/桥接模式.jpg)

## 组合模式

组合模式（Composite Pattern），又叫部分整体模式，是用于把一组相似的对象当作一个单一的对象。组合模式依据树形结构来组合对象，用来表示部分以及整体层次。提供不管是针对整体还是单个对象都提供一致的操作方式，数据结构保持一致。比如菜单、VNode 等等。

## 享元模式

共享内存。

前端不会过多考虑内存问题，同时感觉就像是原型。

## 策略模式

if…else... / switch...case...

处理大量嵌套逻辑，分成不同的策略来处理。比如不同的类。

## 模版方法模式

将一系列方法通过一定的逻辑组合成一个统一的对外的接口。

## 职责链模式

一个操作可能多个角色完成，将角色分开，链起来。

就像请假走 OA 流程一样。

发起者、各个角色隔离。

比如说 Koa 中的中间件处理。

## 命令模式

执行命令时，发起者和执行者分离。

就像将军指挥士兵，将军将命令交给号手，各个士兵就知道了。

## 备忘录模式

备忘录模式（Memento Pattern）保存一个对象的某个状态，以便在适当的时候恢复对象。备忘录模式属于行为型模式。

一般编辑器用的多。

![](./images/备忘录模式.png)