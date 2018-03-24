# 排序算法

## 目录

- 选择排序
- 冒泡排序
- 插入排序
- 希尔排序
- 归并排序
- 快速排序
- 堆排序

## 工具函数

```js
// 数组项交换
function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
```



## 选择排序

```js
function select(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let index = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[index] > arr[j]) {
        index = j;
      }
    }
    swap(arr, i, index);
  }
  return arr;
}
```

## 冒泡排序

```js
function bubble(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      if (arr[j + 1] < arr[j]) {
        swap(arr, j + 1, j);
      }
    }
  }
  return arr;
}
```

## 插入排序

```js
function insert(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    const index = arr[i];
    let j;
    for (j = i; j > 0 && index < arr[j - 1]; j--) {
      arr[j] = arr[j - 1];
    }
    arr[j] = index;
  }
  return arr;
}
```

## 希尔排序

```js
function shell(arr) {
  const len = arr.length;
  let gap = Math.floor(len / 2);
  while (gap >= 1) {
    for (let i = gap; i < len; i++) {
      for (let j = i - gap; j >= 0 && arr[j + gap] < arr[j]; j -= gap) {
        swap(arr, j + gap, j);
      }
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}
```

## 归并排序

```js
function mergeSort(arr) {
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  const mid = parseInt(len / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] > right[0]) {
      result.push(right.shift());
    } else {
      result.push(left.shift());
    }
  }
  if (left.length > 0) {
    result.push(...left);
  }
  if (right.length > 0) {
    result.push(...right);
  }
  return result;
}
```

## 快速排序

```js
function quickSort(arr) {
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  // 找基准
  const baseIndex = Math.floor(arr.length / 2);
  const base = arr.splice(baseIndex, 1);
  const baseNum = base[0];
  const left = [];
  const right = [];
  for (let i = 0; i < len - 1; i++) {
    if (arr[i] > baseNum) {
      right.push(arr[i]);
    } else if (arr[i] < baseNum) {
      left.push(arr[i]);
    } else {
      base.push(arr[i]);
    }
  }
  return quickSort(left).concat(base, quickSort(right));
}
```

## 堆排序

