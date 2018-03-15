# 希尔排序

希尔排序重要的是选择步长，至于到底选择多少，这是一个哲学问题。

https://www.cnblogs.com/chengxiao/p/6104371.html

```js
function shellSort(arr) {
  const len = arr.length;  // 保存数组长度
  let gap = parseInt(len / 2); // 定义间隔
  // 定义循环，逐渐减小步长，直至小于 1
  while(gap>=1) {
    for (let i = gap; gap < len; gap++) {
      for (let j = i - gap; j >= 0 && arr[j] > arr[j+gap]; j -= gap) {
        // 进行交换
        const temp = arr[j];
        arr[j] = arr[j+gap];
        arr[j+gap] = temp;
      }
    }
    gap = parseInt(gap / 2);
  }
}
```
