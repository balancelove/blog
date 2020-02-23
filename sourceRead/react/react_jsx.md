> 在开始读 React 源码之前我们得先了解几个问题，首先就是浏览器为啥就能识别我们写的 JSX，其次为啥我们整篇代码没有用到 React 却要引入 React，最后，为啥我们的组件名非得要大写的呢？好了带着这几个问题，我们一起来看接下来的内容。

## JSX

JSX 是什么我就不多说了，相信大家都知道，那么浏览器如何识别呢？其实浏览器是不认识 JSX，是 babel 将我们写的 JSX 转换成 JavaScript。

我们打开 babel 的 background，当然了各位同学要记得把 react 选项勾上，不然会报错的。

```jsx
function Demo() {
  return (
    <div attr="value" key={1}>
      <span>
        child - 1
      </span>
      <span>
        child - 2
      </span>
    </div>
  );
}

<div>
  <Demo />
</div>
```

我们在左边写下这样的 JSX 代码，我们可以看到在右边 babel 帮我们将其转换成了 JavaScript 代码。

```js
function Demo() {
  return React.createElement(
    "div",
    { attr: "value", key: 1 },
    React.createElement(
      "span",
      null,
      "child - 1"
    ),
    React.createElement(
      "span",
      null,
      "child - 2"
    )
  );
}

React.createElement(
  "div",
  null,
  React.createElement(Demo, null)
);
```

我们写的整个应用就会转换成这样的代码提供给 React 使用，所以我们就能够知道上面的问题了：

1. 为什么浏览器能识别我们的 JSX？因为 babel 将我们写的代码转换了，最后它是 JavaScript，不是 JSX。
2. 为什么我们没有用到 React 却要引入它？因为 babel 在转换我们的 JSX 的时候，最后转换成的就是 `React.createElement` 函数，所以要引入。
3. 为什么组件名一定要大写呢？大家可以自己去试一试，如果将 `Demo` 换成 `demo` 的话，传进去的就是字符串而不是变量了，这是因为 React 在处理的时候会将小写的当成原生标签来处理，所以一定要写大写开头。

## React.createElement

`React.createElement` 就是将 JSX 转换成 ReactElement 的函数，我们打开 React 的源码库，找到 `React.createElement` 的定义。

在这个函数里主要是处理 key、ref、props、defaultProps、children 等信息，最后返回一个 `ReactElement` 对象。其实我们写出来的应用就是被转换成了一颗 `ReactElement` 树。

我们来看一下 `ReactElement` 是个什么结构：

```js
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };
```

依次解释一下上面的结构：

1. $$typeof: 这是 `ReactElement` 的唯一标识，请大家记住所有通过这个函数创建出来的对象的 `$$typeof` 都是 `REACT_ELEMENT_TYPE`，当然了还有其他的值，这里就不说了。
2. type: 这其实就是我们 `React.createElement` 传入的第一个参数。
3. key: 对，这就是你想像中的 key。
4. ref: 没错，这就是那个 ref。
5. props: 大家都懂。

## React.Component

在 React 这个包的源码中，它就是个简单的类，然后类上挂在了一些方法。

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {}
Component.prototype.forceUpdate = function(callback) {}
```

至于说 PureComponent 就是在上面加了一个 `isPureReactComponent = true`。

大家翻阅一下 react 这个源码就知道其实东西很少，大部分的工作都抽象到了 `react-dom`、`react-reconciler` 中去了，也正是这种抽象，能够使得 React 能够跨平台运行。