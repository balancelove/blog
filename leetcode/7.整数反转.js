/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 *
 * https://leetcode-cn.com/problems/reverse-integer/description/
 *
 * algorithms
 * Easy (32.64%)
 * Likes:    1153
 * Dislikes: 0
 * Total Accepted:    147.7K
 * Total Submissions: 452.5K
 * Testcase Example:  '123'
 *
 * 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
 *
 * 示例 1:
 *
 * 输入: 123
 * 输出: 321
 *
 *
 * 示例 2:
 *
 * 输入: -123
 * 输出: -321
 *
 *
 * 示例 3:
 *
 * 输入: 120
 * 输出: 21
 *
 *
 * 注意:
 *
 * 假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−2^31,  2^31 − 1]。请根据这个假设，如果反转后整数溢出那么就返回
 * 0。
 *
 */
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  // 判断第一位是不是符号，剩下的 reverse 就好了
  const range = [Math.pow(-2, 31), Math.pow(2, 31) - 1];
  const splitNum = x.toString().split('');
  let symbol = '';
  if (splitNum[0] === '-') {
    symbol = splitNum.shift();
  }
  splitNum.reverse().unshift(symbol);
  const result = Number(splitNum.join(''));
  return result < range[1] && result > range[0] ? result : 0;
};
