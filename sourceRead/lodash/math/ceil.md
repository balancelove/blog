# ceil

阅读 ceil 的源码可以看出，最重要的也就是 createRound 这个函数了。

```js
function createRound(methodName) {
  const func = Math[methodName]
  return (number, precision) => {
    precision = precision == null ? 0 : Math.min(precision, 292)
    if (precision) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      let pair = `${number}e`.split('e')
      const value = func(`${pair[0]}e${+pair[1] + precision}`)

      pair = `${value}e`.split('e')
      return +`${pair[0]}e${+pair[1] - precision}`
    }
    return func(number)
  }
}
```

## 解释

- 从上面的代码可以看出，如果是自身 Math 有的函数的话是直接返回，没有的话是根据传入参数的精度来进行计算。