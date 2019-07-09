# async、await 在 for 循环里怎么样？

我们都知道简单的 `async`、`await` 的应用，但是它们在循环中是什么情况呢？我们一起来看看。

## 基础例子

```js
const nums = [0, 1, 2, 3];

const getNumByIndex = index => {
  return new Promise(resolve => {
    setTimeout(() => resolve(nums[index]), 1000);
  });
};
```

## 在 for 循环中 await

```js
async function bootstrap_for() {
  console.log('循环已经开始了');
  for (let i = 0; i < nums.length; i++) {
    const value = await getNumByIndex(i);
    console.log(value);
  }
  console.log('循环已经结束了');
}
```

结果是：

```
循环已经开始了
0
1
2
3
循环已经结束了
```

可以看到在 `for` 循环里，`await` 是串行的，经过试验，在 `for .. of` 、 `for .. in` 、 `while` 这些循环中结果是相同的。

## 在 forEach 里 await

同上，我们先用 `forEach` 来运行上面的例子。

```js
async function bootstrap_forEach() {
  console.log('循环已经开始了');
  nums.forEach(async num => {
    const value = await getNumByIndex(num);
    console.log(value);
  });
  console.log('循环已经结束了');
}
```

结果如下：

```
循环已经开始了
循环已经结束了
0
1
2
3
```

这样看来 `forEach` 就不符合我们的预期，不适合用来做 `await`。

## 在 map 里 await

同上，我们先用 `map` 来运行上面的例子。

```js
async function bootstrap_map() {
  console.log('循环已经开始了');
  const numPromises = nums.map(async num => {
    const value = await getNumByIndex(num);
    console.log(value);
    return value;
  });
  const result = await Promise.all(numPromises);
  console.log('循环已经结束了');
}
```

结果如下：

```
循环已经开始了
0
1
2
3
循环已经结束了
```

如果你在 `map` 中使用 `await` 的话，它会返回一个 `promises` 的数组，这是因为 `async` 函数总是会返回一个 `promises`，那我们要去拿到这些异步函数的值就需要 `await Promise.all()`，这样我们就能够拿到所有返回的值。

## 总结

所以通过以上的一些小实验，我们可以知道，如果你希望串行的执行异步，那么你最好是使用 `for` 循环或与之类似的循环，如果你想要拿到所有异步的值，使用 `map` 也是可行的，通过 `Promise.all()`，当然了，如果你不关心返回的结果，使用 `forEach` 也是可以的。
