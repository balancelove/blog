/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 *
 * https://leetcode-cn.com/problems/add-two-numbers/description/
 *
 * algorithms
 * Medium (34.76%)
 * Likes:    2735
 * Dislikes: 0
 * Total Accepted:    167.2K
 * Total Submissions: 478.8K
 * Testcase Example:  '[2,4,3]\n[5,6,4]'
 *
 * 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
 *
 * 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
 *
 * 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 示例：
 *
 * 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
 * 输出：7 -> 0 -> 8
 * 原因：342 + 465 = 807
 *
 *
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  function ListNode(val) {
    this.val = val;
    this.next = null;
  }
  // 哨兵位
  const newLink = new ListNode(-1);
  let cur = newLink;
  // 用于判断是否需要进位
  let carry = 0;
  while (l1 || l2) {
    const val1 = (l1 && l1.val) || 0;
    const val2 = (l2 && l2.val) || 0;
    let sum = val1 + val2 + carry;

    carry = (sum / 10) | 0;
    sum = sum % 10;
    cur.next = new ListNode(sum);

    cur = cur.next;
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  if (carry === 1) {
    cur.next = new ListNode(carry);
  }
  return newLink.next;
};
