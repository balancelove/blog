---
title: generator
date: 2020-02-20 13:21:17
permalink: /pages/bcd65b/
categories: 
  - blog
  - technology
tags: 
  - null
sidebar: auto
---
# ES6 之 generator

[[toc]]

## 从 Gennerator 开始说起

Gennerator 是 ES6 提供的一种一步解决方案，从它的执行方式来看，我们可以将其理解为状态机，执行它会返回一个遍历器对象，通过这个遍历器对象我们可以遍历函数的所有状态。

那 Gennerator 函数怎么写呢？看代码：

```js
// 它的写法就是在 function 和 函数名之间有一个星号，其次就是在函数内部可以使用 yield 关键字
function* gen() {
  yield 'hello';
  yield 'world';
  return 'bye';
}

// 执行这一句并不会有任何效果，我们只是拿到了一个遍历器对象
const getGen = gen();
getGen.next();  // 这里会返回一个遍历器对象 { value: 'hello', done: false }
getGen.next();  // { value: 'world', done: false }
getGen.next();  // { value: 'bye', done: true }
getGen.next();  // { value: undefined, done: true }
```

每次执行 `.next()` 都会在 `yield` 的地方停下，返回的对象中，value 就是当前 yield 表达式的值。

那么我们如何使用它来解决异步的场景呢？我们稍一思索，写下这样的代码：

```js
function* gen(name) {
  const uid = yield getUserByName('/api/users', name);
  const posts = yield getPostsByUid('/api/posts', uid);
  return posts;
}

const getGen = gen('zhx');
getGen.next();
getGen.next();
getGen.next();
```

但是遗憾的是，这样并不能获取到任何的值，虽然我们 yield 能够执行后面的函数，但是它本身其实不会返回任何值，也就是说当我们执行了 next 之后，uid 为 undefined。那么我们要怎样才能够让它获取到值呢，非常简单，我们这样改。

```js
getGen.next(123); // 这就相当于给上一步 yield 的返回值赋值
// 也就是下一句相当于是这样
const uid = 123;
const posts = yield getPostsByUid('/api/posts', uid);
```

那我们要如何让其自动执行，并完成异步操作呢？

```js
// 首先，我们的 run 接收一个 Gennerator 函数
function run(gennerator) {
  // 执行之后获得遍历器对象
  const gen = gennerator();

  // 定义 next 函数，接收一个 data 用来传给下一次 next
  function next(data) {
    // 将 data 穿进去执行 next
    const result = gen.next(data);
    // 如果结束了就返回数据
    if (result.done) {
      return result.value;
    }
    // 递归进行调用，返回的 Promise 数据，在 then 里得到真实数据后再传给下一次 next，这里只是做了 Promise，可能还有些其他的值的形式
    result.value.then(data => {
      next(data);
    });
  }

  next();
}
```

## Gennerator 与协程

协程是多个线程并行执行，但是和多线程不同的是，只有一个线程处于正在运行的状态，其他线程处于暂停态。也就是说一个线程执行到一半可以暂停执行，将执行权交给另一个线程，等到收回执行权的时候再恢复执行。

但是 Gennerator 不能叫协程，只能叫半协程，意思是只有 Gennerator 的函数的调用者才有权利将程序的执行权交还给 Gennerator。
