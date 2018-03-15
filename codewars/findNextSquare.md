# findNextSquare

## 题目大概描述

判断当前给定数是否为一个平方数，如果是，则返回下一个平方数，否则返回 -1。

## 示例

```js
findNextSquare(121) --> returns 144
findNextSquare(625) --> returns 676
findNextSquare(114) --> returns -1 since 114 is not a perfect
```

## 我的第一次解

```js
function findNextSquare(sq) {
  // Return the next square if sq if a perfect square, -1 otherwise
  const sqrt = Math.sqrt(sq);
  if (sqrt % 1 === 0) {
    return Math.pow(sqrt + 1, 2);
  }
  return -1;
}
```

1. 用变量保存解平方的数是考虑避免多次去解平方。
2. 判断解出来的数是否为一个整数，如果为整数，则返回下一个平方数。
