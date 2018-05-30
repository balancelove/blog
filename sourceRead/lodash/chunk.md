# Chunk 函数

```js
 chunk(['a', 'b', 'c', 'd'], 2)
 // => [['a', 'b'], ['c', 'd']]

 chunk(['a', 'b', 'c', 'd'], 3)
 // => [['a', 'b', 'c'], ['d']]
```

## 我猜它是如何实现的

如果是我，我会根据传入的数组长度去 slice 数组，然后组装成新的数组。


## 它是如何实现的

```js
function chunk(array, size) {
  // 取 0 和 size 的最大值，应该是防止传入参数是负数的情况
  size = Math.max(size, 0)
  // 判断是否传入了数组
  const length = array == null ? 0 : array.length
  if (!length || size < 1) {
    return []
  }
  // 数组索引
  let index = 0
  // 生成新数组索引
  let resIndex = 0
  // 初始化数组
  const result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size))
  }
  return result
}
```

## 总结

这个函数和我预想中的差不多，值得学习的是对数据边界的限制。

