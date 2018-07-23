# 二分查找

> 这是一步一步学算法的第一篇，从最简单的二分查找开始学起。算法是什么？说高大上，不懂也不至于，算法是用来解决问题的。现在我们就从最基础的二分查找开始一步一步的学习。

## 二分查找游戏

相信大家都玩过这样的游戏，让一个人从 1 到 100 选一个数字，然后让另一个人来猜，每次只回答大了或者小了，怎么才能快速的查找到这个数字呢？这就是我们使用二分查找的时候了，第一次猜 50，第二次猜 25 或者 75，依次往后，我们可以用很少的次数就查找到这个数字，这就是算法，可能大家也不会觉得这是个算法，但其实算法就在我们生活中，帮助我们解决问题。

## 二分查找的前提条件

二分查找有一个前提条件，就是你要是用二分查找的这一组数据是有序的，不然就不能使用二分查找了。

## 如何实现

```js
// 首先我们要确定边界，我们要在 [left, ..., right] 这个前闭后闭区间找到目标数字 target
function binarySearch(target, arr) {
  let left = 0;
  let right = arr.length - 1;
  let mid;
  while(left < right) {
    mid = parseInt(left + (right - left) / 2);
    if(arr[mid] === target) {
      return mid;
    }
    // 如果 mid 比 target 小，则区间变成 [mid + 1, ..., right]
    if(arr[mid] < target) {
      left = mid + 1;
    }
    // 如果 mid 比 target 大，则区间变成 [left, ..., mid - 1]
    if(arr[mid] > target) {
      right = mid - 1;
    }
  }
  return -1;
}
```

