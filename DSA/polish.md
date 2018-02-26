# 逆波兰表达式

> 逆波兰式也叫作后缀表达式，因为操作符放在运算对象的后面，而我们平时写的叫做中缀表达式，因为操作符放在运算对象中间，那么为什么我们要创造这么一种运算方法呢？其实是因为计算机和我们人的脑子不一样，比如有很多括号的表达式，计算机算起来比较麻烦，于是提出了这么一种计算方法。

## 看逆波兰式计算机如何计算？

实现这个过程我们需要先初始化一个空栈，我们用 JS 数组来模拟这个过程。

```js
const rpn = [];
```

当然了，我们还需要一个逆波兰表达式： `4421-*+(中缀表达式: 4+4*(2-1))`。

规则： 从左到右遍历计算表达式，遇到数字就进栈，遇到操作符就取出栈顶的两个数字，然后进行计算，结果进栈，最后取得结果。

接下来，我们一步一步的进行计算：

1. 遇到数字 `4421`，进栈，rpn 为 [4, 4, 2, 1]。
2. 遇到操作符 `-`，于是取出两个数字进行运算 `2 - 1`，得到结果然后进栈，rpn 为 [4, 4, 1]。
3. 又是操作符 `*`，于是同上操作，`4 * 1` 进栈，rpn 为 [4, 4]。
4. 又是操作符 `+`，同上，`4 + 4` 进栈，rpn 为 [8]。
5. 结果为 8，出栈，栈就变成空栈了。

这种运算方式更加的符合计算机的思考方式，那我们写代码的时候不可能还要这么写吧，毕竟这么写会让我们很头疼，回想起当时考试被中缀转后缀支配的恐惧。

## 中缀表达式转后缀表达式

这个转换最重要的就是，先把例子拿出来，哈哈，开个玩笑，我们来看这个例子： `9+2*(2-1)+9/3`。

那么我们要如何做到转换呢？

首先我们准备一个栈：

```js
const stack = [];
```

规则：从左到右遍历中缀表达式

- 如果遇到的是数字，则进栈
- 如果是符号，则需要判断优先级，是右括号，或者优先级低于栈顶符号的(乘除优先级大于加减)，则栈顶元素依次出栈，并将当前符号进栈，直到栈空。

1. 首先是 9，则输出 9。
2. 然后是 `+`，则 `+` 进栈。
3. 遇到 2，则 2 输出，现在输出为 92。
4. 遇到 `*`，则进栈，栈内现在为 ['+', '*']。
5. 遇到 `(`，则进栈，栈内为 ['+', '*', '(']。
6. 遇到 2，则输出 2，现在输出为 922。
7. 遇到 `-`，进栈，栈内为 ['+', '*', '(', '-']。
8. 遇到 1，输出为 9221。
9. 好了现在遇到了 `)`，是右括号，那么输出两个括号之间的操作符，输出为 9221-，栈内为 ['+', '*']。
10. 接下来遇到 `+`，`+` 的优先级低于 `*`，则输出 `*`，`+` 进栈，现在栈内为 ['+', '+']，输出为 9221-*。
11. 遇到 9，直接输出，现在为 9221-*9，接下来为 `/`，进栈 ['+', '+', '/']，在接下来遇到 3，直接输出，输出为 9221-*93。
12. 好了剩余符号出栈，输出变为 9221-*93/++。

好了，解析完成，大家应该也差不多了解清除这是如何运作的了，接下来我们就用代码来实现一下。

## 代码实现

首先，我们要实现一个计算逆波兰式的方法：

```js
const polish = arr => {
  // 定义一个栈
  const stack = [];
  // 然后一个一个去匹配
  for (const value of arr) {
    // 匹配到数字就入栈
    if (typeof value === 'number') {
      stack.push(value);
    // 是操作符就进行运算
    } else if (typeof value === 'string') {
      // 弹出栈顶两位数
      const v1 = stack.pop();
      const v2 = stack.pop();
      let v3;
      // 进行操作
      switch(value) {
        case '+':
          v3 = v2 + v1;
          break;
        case '-':
          v3 = v2 - v1;
          break;
        case '*':
          v3 = v2 * v1;
          break;
        case '/':
          v3 = v2 / v1;
          break;
        default:
          break;
      }
      // 如果栈空了，就返回值
      if (stack.length === 0) {
        return v3;
      // 如果没空，就将值压入栈中，继续执行
      } else {
        stack.push(v3);
      }
    }
  }
};

const arr = [4, 4, 2, 1, '-', '*', '+'];
// output: 8
console.log(polish(arr));
```

然后，现在我们需要将中缀表达式转换成后缀表达式。

```js
const change = arr => {
  // 定义一个栈以及一个一个返回数组
  const stack = [];
  const result = [];
  // 运算符优先级
  const highLevel = ['*', '/'];
  const lowLevel = ['-', '+'];
  for (const value of arr) {
    // 如果是数字就直接入栈
    if (typeof value === 'number') {
      result.push(value);
    } else if (typeof value === 'string') {
      // 如果是第一次遇到符号，直接进栈
      if (stack.length === 0) {
        stack.push(value);
      // 如果是 )
      } else if (value === ')') {
        // 将 () 之间的符号压入栈中
        for (let i = stack.length; i > 0; i--) {
          if (stack[i - 1] !== '(') {
            const flag = stack.pop();
            result.push(flag);
          } else {
            stack.pop();
            break;
          }
        }
      } else {
        // 判断符号优先级
        let len = stack.length;
        while(len > 0) {
          if (lowLevel.includes(value) && highLevel.includes(stack[stack.length - 1])) {
            const flag = stack.pop();
            result.push(flag);
          } else {
            stack.push(value);
            break;
          }
          len--;
        }
      }
    }
  }
  // 最后将所有剩余操作符压入栈中
  let len = stack.length;
  while(len > 0) {
    const flag = stack.pop();
    result.push(flag);
    len--;
  }
  return result;
};

const arr = [9, '+', 2, '*', '(', 2, '+', 1, '*', 5, ')', '+', 9, '/', 3];
// // 9+2*(2+1*5)+9/3 = 9+14+3 = 26
console.log(polish(change(arr)));
```

这样我们就简单的实现了一把如何将中缀表达式转换成后缀表达式，然后再计算出来，这里我们用数组来模拟这个计算表达式，因为比较好操作。

好了，这次就讲到这里，下回再见了。

>  如果各位看官看的还行，可以到 [GitHub](https://github.com/balancelove/readingNotes) 里给我一颗小小的 star 支持一下，谢谢。

