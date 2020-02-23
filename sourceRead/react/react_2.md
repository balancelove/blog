> 在这节里，我会跟大家一起到 React 源码中查看我们用到的一些 API 是如何实现的，跟大家剧透一波，其实 React 库所做的功能并不复杂，因为这个库只是定义了一些结构，而真正核心的流程都在 React-dom 等平台相关库中，这样一种良好的拆分方式，可以让 React 更好地适应各个平台，下面我们就来一起看一看。

[[toc]]

ps: 在这里，我并不会深入的去看所有的代码（react-dom 里的），只是理清 React 提供给我们 API，这对我们之后

下面我们就根据 `React.js` 来一部分一部分看：

![React](/react/react.png)

## React.Children

## React.createRef

在 React 中，我们是通过数据的变化来让视图进行变化，但是在一些场景下我们需要直接更改子组件，而不去通过数据流的方式，React ref 就是这个场景的解决方案。

在查看源码之前，我们先补充一点知识，在 React 中，我们有 3 种方式来使用 ref。

### 字符串

这个方案在 16 之前是用的比较多的，但是这个方案已经不被官方推荐了，并且在未来的版本会移除。

```jsx
<input ref="myref" />

// 获取 ref
this.ref.myref;
```

### 回调函数

```jsx
<input ref={
  el => {
    this.myref = el;
  }
} />

// 获取 ref
this.myref;
```

### createRef

我们可以看一下，其实你会大吃一惊，因为它的定义就几行代码。

![create_ref](/react/ref.png)
