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
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

let root = null;

// 插入节点
function insertNode(node, newNode) {
  if (newNode.key < node.key) {
    if (node.left === null) {
      node.left = newNode;
    } else {
      insertNode(node.left, newNode);
    }
  } else {
    if (node.right === null) {
      node.right = newNode;
    } else {
      insertNode(node.right, newNode);
    }
  }
}

function insert(key) {
  const newNode = new Node(key);
  if (root === null) {
    root = newNode;
  } else {
    insertNode(root, newNode);
  }
}

// 查询节点
function searchNode(node, key) {
  if (key === node.key) {
    return true;
  } else if (key > node.key && node.right !== null) {
    return searchNode(node.right, key);
  } else if (key < node.key && node.left !== null) {
    return searchNode(node.left, key);
  } else {
    return false;
  }
}
function search(key) {
  if (root !== null) {
    return searchNode(root, key);
  }
}
```

## 深度优先遍历

### 前序遍历

```js
function pre(node) {
  console.log(node.key);
  node.left && pre(node.left);
  node.right && pre(node.right);
}
```

### 中序遍历

```js
function mid(node) {
  node.left && mid(node.left);
  console.log(node.key);
  node.right && mid(node.right);
}
```

### 后序遍历

```js
function after(node) {
  node.left && after(node.left);
  node.right && after(node.right);
  console.log(node.key);
}
```

## 广度优先遍历

利用数组实现

```js
function deep() {
  const deepArr = [];
  deepArr.push(root);
  while (deepArr.length > 0) {
    const front = deepArr.shift();
    console.log(front.key);
    if (front.left) {
      deepArr.push(front.left);
    }
    if (front.right) {
      deepArr.push(front.right);
    }
  }
}
```

