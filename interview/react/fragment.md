# 什么是 Fragment？

在 `React` 里，我们的组件都需要一个父元素，但是有时候我们并不希望返回这个父元素，因为这会造成向 DOM 树中添加了多余的结构，同时也改变了我们设想的结构。

这时候，我们就可以使用 `Fragment` 来将我们的内容包起来，当然了，使用 `<>`也是一样的，这样就不会带来多余的 DOM 结构。

```jsx
// 不使用 Fragment
return (
  <div>
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </div>
);

// 使用 Fragment
return (
  <React.Fragment>
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </React.Fragment>
);

// 使用 <>
return (
  <>
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </>
);
```
