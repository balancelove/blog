# LHS 和 RHS

```js
function foo(a) {
  console.log( a ); // 2
}
foo( 2 );
```

foo() 的调用需要编译器对 foo 进行 RHS 引用。其中参数传递是隐式的 a=2，这是一个 LHS 查询。

所以 RHS 是查询源头值，LHS 查询是赋值操作的目标是谁的操作。

题目：

```js
function foo(a) {
  var b = a;
  return a + b;
}
var c = foo( 2 );
```

LHS: 定义 foo，foo(2) 的时候进行的 a=2，foo(2) 赋值给 c
RHS: b = a 查询 a 的值，return 有两次查询，分别是 a 以及 b，还有一处是在给 c 赋值时查询 foo。
