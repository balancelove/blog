# compact 函数

```js
compact([0, 1, false, 2, '', 3])
// => [1, 2, 3]
```

## 预想

如果是我来做，我会选择循环整个数组，然后使用 Boolean() 去判断这个值是不是 false。不是 false 的就 push 到新数组中。

## lodash

```js
function compact(array) {
  let resIndex = 0
  const result = []

  if (array == null) {
    return result
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value
    }
  }
  return result
}
```

## 总结

好吧，其实我想说我想多了，在 if 的隐式转换中，是使用了 Boolean() 去判断 true 和 false。
