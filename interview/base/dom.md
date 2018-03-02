# DOM 事件

## DOM 事件级别

- DOM 0 级： DOM0级事件就是将一个函数赋值给一个事件处理属性。
- DOM 2 级： DOM2级事件定义了addEventListener和removeEventListener两个方法，分别用来绑定和解绑事件。
- DOM 3 级： DOM3级事件在DOM2级事件的基础上添加了更多的事件类型。

## DOM 事件模型

- 冒泡： 从当前元素到最外层元素
- 捕获： 从最外层元素到目标元素

## Dom 事件流

捕获 -> 目标阶段 -> 冒泡

## 描述 Dom 事件流捕获的具体流程

window - document - html - body - ... - 目标元素

获取 html 标签： document.documentElement

## Event对象常见应用



## 自定义事件
