> 大家都知道 React 官方告诉我们组件名称必须大写字母开头，小写开头代表 DOM 标签，那么你想过为什么是这样的么？下面我们就一起来看一看。

我们都知道我们所书写的 JSX 代码会转化成 JavaScript，下面我们就通过 babel 来看一下这个转换。

首先，我们打开 babel 官网，点击 `Try it out`，我们先写几个代码例子：

```jsx
// 例 1
<div id="demo-1">
  demo-1
</div>

// 转换
React.createElement(
  "div",
  { id: "demo-1" },
  "demo-1"
);

// 例 2
function Demo2(props) {
  return <div>props.children</div>;
}

<Demo2>
  <div>demo-2</div>
</Demo2>

// 转换
function Demo2(props) {
  return React.createElement(
    "div",
    null,
    "props.children"
  );
}

React.createElement(
  Demo2,
  null,
  React.createElement(
    "div",
    null,
    "demo-2"
  )
);

// 例 3
function demo2(props) {
  return <div>props.children</div>;
}

<demo2>
  <div>demo-3</div>
</demo2>

// 转换
function demo2(props) {
  return React.createElement(
    "div",
    null,
    "props.children"
  );
}

React.createElement(
  "demo2",
  null,
  React.createElement(
    "div",
    null,
    "demo-3"
  )
);
```

好了，我们写了三个例子，这几个例子就可以解答我们一些问题。

1. 为啥我们写代码都没用过 React 变量，却要在每个文件都引入一遍？

    这是因为我们在写组件的时候，都会调用 `React.createElement` 函数，所以我们需要引入，虽然看起来我们并没有使用过。

2. 为什么组件名称要大写开头？

    从 2、3 两个例子中我们可以发现，当我们使用大写开头的时候，`React.createElement` 的第一个参数是一个变量，而当我们改成小写之后，第一个参数却是字符串，这两者在代码里的处理也不同，所以如果我们使用小写开头的话，React 会将其作为一个 HTML 标签来处理，就会报错，因为根本就没有这个标签。
