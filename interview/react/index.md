# React 知识点积累

## 1. react 异步数据加载应该放在哪个生命周期？

1. 放在 DidMount 里保证数据请求完成之后 Dom 是已经渲染了的
2. react16.0以后，componentWillMount可能会被执行多次
3. 跟服务器端渲染（同构）有关系，如果在componentWillMount里面获取数据，fetch data会执行两次，一次在服务器端一次在客户端，在componentDidMount中可以解决这个问题

## 2. 什么是纯函数？什么是副作用？有什么好处？

1. 纯函数是指，函数返回结果只依赖于参数，并且没有副作用。

   ```js
   // 不是纯函数，因为它的结果是依赖于外部的 a，返回结果是不可预测的
   const a = 1
   const foo = (b) => a + b
   foo(2) // => 3
   // 是纯函数，返回结果只依赖于参数，结果是可预测的，不管到什么地方，只要参数一样，返回结果就一样
   const a = 1
   const foo = (x, b) => x + b
   foo(1, 2) // => 3
   ```

2. 函数内部修改了函数外部的变量称为副作用。

   ```js
   const foo = (obj, b) => {
     obj.x = 2
     return obj.x + b
   }
   const counter = { x: 1 }
   foo(counter, 2) // => 4
   counter.x // => 2
   ```

## 3. 对你来说 React 的主要卖点是什么。为什么你选择使用 React？

对于 JSX、Virtual DOM 这些特点，我们在 react 主页就能了解到，所以这些就不说了，下面说的是，为什么我会使用 react。

1. 第一点，重要的是公司在使用 react。
2. 其次，react 灵活的方式也让我很喜欢。
3. 当然了，react 需要记忆的 api 量非常少。
4. 丰富的解决方案，各种问题的解决方法都能在论坛在找到。

## 4. 什么是 JSX 和我们怎样在 JavaScript 代码中书写它 —— 浏览器是如何识别它的？

JSX 是 React 的一种标记语法，他会通过像 babel 等工具将代码转换成 React.createElement 的语法调用。这也就是为什么我们在编写 react 代码的时候没有用到 react，却要在开头引入 React 的原因。

## 5. Pure Component 是什么？

除了为你提供了一个具有浅比较的`shouldComponentUpdate`方法，`PureComponent`和`Component`基本上完全相同。当`props`或者`state`改变时，`PureComponent`将对`props`和`state`进行浅比较。另一方面，Component不会比较当前和下个状态的`props`和`state`。因此，每当`shouldComponentUpdate`被调用时，组件默认的会重新渲染。

## 6. HTML 和 React 事件有什么不同？

- HTML 中，事件都是小写的，在 React 里是驼峰命名。
- 在 HTML 里返回 false 阻止默认事件，在 React 中必须要调用 `event.preventDefault()`。

## 7. 怎么绑定方法或事件？

- 在 constructor 中 bind：this.clickHandle.bind(this)
- 定义函数时，使用 `handleClick = () => {}`
- 在回调中使用箭头函数，`onClick={e => this.handleClick(e)}`

## 8. key 在渲染元素数组有什么用？

- 如果项目的顺序可能会改变，则不建议使用 key，可能会对性能产生负面影响
- 如果将列表提取为单独的组件，则应该在列表组件上应用 key，而不是 li 标签

## 9. 什么时候该使用 refs？

当你需要直接访问 DOM 元素或者组件实例的时候。

## 10. React 16.3 中的 Refs 和 Forwarding Refs？

重点是 Forwarding Refs，它能够在父组件中得到子组件中的 dom 节点。

**父组件myRef——>React.forwardRef中的实参——>通过forwardRef方法创建的子组件中的ref——>指向子组件中的某一个dom节点**

