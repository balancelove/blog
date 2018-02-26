# 选择排序

> 选择排序是基础算法之一，我们都应该去掌握它，它的核心思想就是从一组数据中选出最小的数，然后将其与第一未排序的第一个位置交换，重复这个过程，最后完成排序。

### 算法基本分析：

- 平均复杂度：O(n^2)，两个嵌套循环
- 空间复杂度：O(1)
- 稳定性：不稳定

### 模拟排序

__1  6  3  8  2  5  4__

第一轮： __1  6  3  8  2__

第二轮： __1  2  3  8  6__

第三轮： __1  2  3  8  6__

第四轮： __1  2  3  6  8__

### JavaScript 代码实现

工具函数 `exchange` 交换数组元素，后续不再介绍：

```js
function exchange(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
```



```js
function selectSort(arr) {
  const len = arr.length;
  for(const i = 0; i < len; i++) {
    const minIndex = i;
    for(const j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    exchange(arr, i, minIndex);
  }
}
```



**input**: [1, 3, 4, 2, 6]

**output**: [1, 2, 3, 4, 6]
