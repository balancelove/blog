# JS 看不懂的 []+{}

## 面试滑铁卢

有一天，去面试，遇到这样的题：

```js
[]+[]
{}+{}
1+[]
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

- __input:__ 这个参数是输入的值。
- __PreferredType:__ 这个参数可以是数字或者是字符串的一种(Number or String)，这代表了我们的对象会转换成哪种原始数据类型。如果缺少这个参数的话，那对于 Date 的实例，默认为 String，其余的都为 Number。

下面我们来看一下对于不同的参数，它的转换过程是什么样的？

### PreferredType 为 Number

1. 如果 input 为原始类型，则直接返回 input。
2. 否则，如果 input 是一个对象，则会去调用对象的 `valueOf()` 方法，如果结果为原始类型就直接返回。
3. 如果上一步返回的依然是对象，那么就回去调用对象的 `toString()` 方法，如果结果为原始数据类型就返回。
4. 如果还不是原始数据类型就抛出错误，一般是 __Uncaught TypeError: Cannot convert object to primitive value__。

### PreferredType 为 String

参数 String 就不细说了，当参数为 String 的时候，上面的第二步和第三步交换就行了，也就是先调用 `toString()` 再调用 `valueOf()`。


