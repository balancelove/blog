# 二叉搜索树

> 其本质也是二叉树

## 解决了什么问题

查找问题

## 基础：二分查找

```js
function binarySerch(arr, target) {
  // 先定义边界，是在 [l,r] 这个闭区间查找
  let l = 0,
    r = arr.length - 1;
  let mid;
  while (l <= r) {
    mid = parseInt(l + (r - l) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      l = mid + 1;
    }
    if (arr[mid] > target) {
      r = mid - 1;
    }
  }
  return -1;
}
```

注意： arr 必须是有序的

## 二分搜索树的优势

查找表的实现 - 字典数据结构

不一定是完全二叉树

## 实现

```js
class BST {
    constructor(key, left, right) {
        this.key = node.key;
        this.left = node.left || null;
        this.right = node.right || null;
        this.count = 0;
    }
    size() {
        return count;
    }
    insert(key) {
        if () {}
    }
}

const root = new BST(null);



```

