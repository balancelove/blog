# JS 看不懂的 []+{}

## 面试滑铁卢

有一天，去面试，遇到这样的题：

```js
[] + [];
{
}
+{};
1 + [];
```

???WTF，谁会没事这么写代码，好吧，我错了，大佬别打我。懵逼之后要干嘛？当然是要学习一波，于是我满世界找资料，有好东西当然是要分享一波，好了，接下来我们就一起走进 JavaScript 隐式转换的世界吧。

## 加法运算

在 JavaScript 中加法运算规则很简单，它只做数字和字符串的加法操作，所有不是这两种类型的都会被转换成这两种原始数据类型再进行操作。

在 JavaScript 中，数据类型分两种：

- 原始数据类型(primitives): undefined, null, boolean, number,string,symbol
- 其他的都是对象，包括数组、函数。

那么对象是如何转换成原始数据类型的呢？不要慌，我们继续看。

## ToPrimitive

JS 有一个内部运算 `ToPrimitive()`，它用于对象转换为原始数据类型。

```js
ToPrimitive(input, PreferredType?)
```

这个函数接收两个参数：

- **input:** 这个参数是输入的值。
- **PreferredType:** 这个参数可以是数字或者是字符串的一种(Number or String)，这代表了我们的对象会转换成哪种原始数据类型。如果缺少这个参数的话，那对于 Date 的实例，默认为 String，其余的都为 Number。

下面我们来看一下对于不同的参数，它的转换过程是什么样的？

### PreferredType 为 Number

1. 如果 input 为原始类型，则直接返回 input。
2. 否则，如果 input 是一个对象，则会去调用对象的 `valueOf()` 方法，如果结果为原始类型就直接返回。
3. 如果上一步返回的依然是对象，那么就回去调用对象的 `toString()` 方法，如果结果为原始数据类型就返回。
4. 如果还不是原始数据类型就抛出错误，一般是 **Uncaught TypeError: Cannot convert object to primitive value**。

### PreferredType 为 String

参数 String 就不细说了，当参数为 String 的时候，上面的第二步和第三步交换就行了，也就是先调用 `toString()` 再调用 `valueOf()`。

## + 运算

```js
value1 + value2;
```

上面的操作方式如下：

1. 将两个操作数转换成基本数据类型：

```js
// PreferredType被省略，因此非日期为 Number，日期为 String。
prim1 = ToPrimitive(value1);
prim2 = ToPrimitive(value2);
```

2. 如果 prim1 或 prim2 是一个字符串，则将其转换为字符串并返回结果的连接。
3. 否则，将 prim1 和 prim2 都转换为数字并返回结果的总和。

## valueOf 和 toString

这两个都是 Object 的属性，可以自己定义，现在我们不管，我们去看看下面几种情况这两个方法返回的都是什么。

```js
// 对象
const a1 = {
  a: 1
};
console.log(a1.valueOf());
console.log(a1.toString());
// 数组
const a2 = [1, 2, 3];
console.log(a2.valueOf());
console.log(a2.toString());
// 方法
const a3 = function() {
  const a = 1;
  return 1;
};
console.log(a3.valueOf());
console.log(a3.toString());
```

将上面的代码放到控制台打印一下就知道：

- 对象： valueOf() 返回对象本身，toString() 返回值为 [object Object]。
- 数组： valueOf() 返回对象本身，数组改写了 toString()，返回值相当于用 `join(',')` 的返回值，比如 `[1,2,3].toString()` 返回 "1,2,3"。
- 方法： valueOf() 返回方法本身，Function 也改写了对象的 toString()，它将代码转为字符串值然后返回。

## 举个栗子

好了，根据我们上面说的，那些面试题简直洒洒水，我们来看。

```js
[] + {};
```

我们如何去分析呢？在这里，我们首先将 [] 和 {} 转换成原始数据类型，也就是 ToPrimitive([]) 以及 ToPrimitive({})，PreferredType 默认为 Number，很明显 `[].valueOf()` 还是一个对象，所以我们继续，`[].toString()` 结果为 ""，相同的解析过程 {} 转换成 "[object Object]"。

好了，现在这个式子是 "" + "[object Object]"，我们知道 + 运算只要有字符串就拼接操作数，所以结果是 "[object Object]"。

但是，在我进行测试的时候，发现了几个特殊的例子，`{}+1`、`{}+[]` 这两个例子在控制台打印出的结果为 `1` 和 `""`，很奇怪是吧？我搜了搜资料发现，不同浏览器对其的解析不同，它会将前面一个 {} 当成代码块，于是上面的式子就变成了 `+1` 和 `+[]`，所以得出了上面的结果。

## 总结

好了，经过上面的探究，我相信大家不会再被这些问题难住了，但是要记住，{} 在前面的情况下可能会因为浏览器的差异会造成不同的结果，当然，如果你这样将 {} 用 () 包起来就不会有问题了，或者是先声明在使用。

## 更多资源

- [What is {} + {} in JavaScript?](http://2ality.com/2012/01/object-plus-object.html) —— 作者有着德国阮一峰的称号

> 更多文章尽在 [我的博客仓库](https://github.com/balancelove/readingNotes/)，如果各位读者觉得有用，欢迎 star，不胜感激。
