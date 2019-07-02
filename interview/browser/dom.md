# DOM 事件

## DOM 事件级别

- DOM 0 级： DOM0 级事件就是将一个函数赋值给一个事件处理属性。
- DOM 2 级： DOM2 级事件定义了 addEventListener 和 removeEventListener 两个方法，分别用来绑定和解绑事件。
- DOM 3 级： DOM3 级事件在 DOM2 级事件的基础上添加了更多的事件类型。

## DOM 事件模型

- 冒泡： 从当前元素到最外层元素
- 捕获： 从最外层元素到目标元素

## Dom 事件流

捕获 -> 目标阶段 -> 冒泡

## 描述 Dom 事件流捕获的具体流程

window - document - html - body - ... - 目标元素

获取 html 标签： document.documentElement

## Event 对象常见应用

- e.preventDefault()
- e.stopPropagation()
- e.target: 获取当前被点击的元素
- e.currentTarget: 指的是当前被绑定事件的元素
- e.stopImmediatePropagation: 事件响应优先级

## 自定义事件

```js
const eve = new Event('custom');
ev.addEventListener('custom', () => {
    ...
});
ev.dispathEvent(eve);
```

Event 不足，只能指定事件名，如果要传参数，可以使用 CustomEvent。
