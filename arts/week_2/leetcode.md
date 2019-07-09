## LeetCode

### 2. 两数相加

给出两个  **非空** 的链表用来表示两个非负的整数。其中，它们各自的位数是按照  **逆序**  的方式存储的，并且它们的每个节点只能存储  **一位**  数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 **0** 之外，这两个数都不会以 **0**  开头。

#### 思路一

解题流程：第一种比较笨的方法就是将两个数字加起来，再将其变成链表结构，这种方法的缺点就是数字太大溢出的问题。

#### 思路二

解题流程：简单的相加两条链相同位置的数，这道题唯一需要注意的两个点就是，第一，使用哨兵节点来抹平差异，操作头节点的区别，第二点就是对于进位的控制，前面的进位没什么好说的，最重要的是记得最后整个链表遍历完成之后进位需要新增一个节点。

时间复杂度：O(n)

```js
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
  // 链表结构
  function ListNode(val) {
    this.val = val;
    this.next = null;
  }
  // 哨兵，抹平头尾的区别
  const newLink = new ListNode(-1);
  // 用于下面链表的操作
  let cur = newLink;
  // 用于判断是否需要进位
  let carry = 0;
  // 如果两者有其一有值就行
  while (l1 || l2) {
    // 默认值为 0
    const val1 = (l1 && l1.val) || 0;
    const val2 = (l2 && l2.val) || 0;
    let sum = val1 + val2 + carry;

    // 是否进位
    carry = parseInt(sum / 10);
    // 当前链表节点的值
    sum = sum % 10;
    // 进行下一位操作
    cur.next = new ListNode(sum);
    cur = cur.next;

    // 再初始化两个链表
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  // 如果最后有进位，则进 1
  if (carry === 1) {
    cur.next = new ListNode(carry);
  }
  return newLink.next;
};
```

执行用时 : **192 ms**

内存消耗 : **41.7 MB**
