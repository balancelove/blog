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