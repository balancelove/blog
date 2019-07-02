# 尾递归调用

> 递归调用是一种常见的手段，但是深层次的递归又会造成调用帧太多的问题，很容易发生内存泄漏，下面介绍的就是递归的优化

我们先来看一下对于阶乘的计算，正常的递归是怎么实现的。

```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
```

看这样一个函数我们每次递归都会保存一个调用帧，因为还有变量的引用就不会销毁他，这样如果 n 变得很大的话，我们要保存的调用帧就会越来越多。那么，尾递归又是什么呢？我们看下面一个函数。

```js
function factorial(n, sum) {
  if (n === 1) return sum;
  return factorial(n - 1, n * sum);
}
factorial(5, 1); //  120
```

当我们以这样的方式进行调用就能够解决这个问题了，只会保留一个调用记录，而且在 ES6 中我们也有方法对这个进行优化，毕竟你让用户输入两个变量，第二个变量输个 1 就有点不清不楚的感觉。所以我们可以利用 ES6 中的默认参数来优化一下。

```js
function factorial(n, sum = 1) {
  if (n === 1) return sum;
  return factorial(n - 1, n * sum);
}
factorial(5); //  120
```

好了，关于尾递归就说到这里，如果对这个有兴趣的话，可以多去了解一下。
