## LeetCode

### 1. 两数之和

给定一个整数数组 `nums`  和一个目标值 `target`，请你在该数组中找出和为目标值的那  **两个**  整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

#### 思路一

解题流程：暴力破解，两个 for 循环，遍历出所有的结果，就能够获取到对应的解。

时间复杂度：O(n^2)

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  // 双 for 循环，暴力破解
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
};
```

执行用时 : **156 ms**

内存消耗 : **34.5 MB**

#### 思路 2

解题流程：使用 Hash，循环时将索引和值保存下来，在循环过程中不断进行比对，找到剩下的那个值。

时间复杂度：O(n)

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  // hash 解法
  const len = nums.length;
  const hash = {};
  for (let i = 0; i < len; i++) {
    if (hash[nums[i]] !== undefined) {
      return [hash[nums[i]], i];
    }
    hash[target - nums[i]] = i;
  }
};
```

执行用时 : **76 ms**

内存消耗 : **34.6 MB**
