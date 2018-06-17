# add

在这个函数中，我们可以看到他使用了一个叫做 `createMathOperation` 的方法，深入到这个方法中，我们可以发现他返回了一个函数。

```js
function createMathOperation(operator, defaultValue) {
  // 返回的这个函数接收两个参数
  return (value, other) => {
    if (value === undefined && other === undefined) {
      return defaultValue
    }
    if (value !== undefined && other === undefined) {
      return value
    }
    if (other !== undefined && value === undefined) {
      return other
    }
    if (typeof value == 'string' || typeof other == 'string') {
      value = baseToString(value)
      other = baseToString(other)
    }
    else {
      value = baseToNumber(value)
      other = baseToNumber(other)
    }
    return operator(value, other)
  }
}
```

## 解释

- 首先这个函数是将将运算的基础做了封装，至于是使用加、减还是什么都不是这个函数需要关心的事，它只需要做的是对参数的处理，我觉得这一点做的很好，将多种运算基础的东西做了抽象封装，同时这个函数也具备了很强的灵活性。