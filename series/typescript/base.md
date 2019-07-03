# TypeScript 基础类型

> `TypeScript` 最基础的使用方法就是 `: type`，大家先记住这个，我们开始学习 TS 中最基础的类型吧，这一章相当的简单，大家可以快速学习略过。

## 数字

TS 对数字的定义和 JavaScript 是一样的，所以我们可以通过这样的方式来定义数字类型。

```ts
const num: number = 1;
```

## 布尔值

这也是最基本的数据类型，就是 `true/false` 值，在 TS 里使用 `boolean` 进行定义。

```ts
const flag: boolean = true;
```

## 字符串

我们使用 `string` 来定义字符串。

```ts
const str: string = 'string';
```

## 数组

对于数组，我们可以使用 `type[]` 对数组进行简单的定义，这样我们就能够安全的使用所有的数组类型的操作。

```ts
const arr: number[] = [1, 2, 3, 4];

// 这时候，如果我们往数组里推入一个字符串，就会报错，因为我们定义这个数组里的元素是数字
arr.push('string'); // Error
```

同时我们也可以使用 `Array<T>` 的方式定义数组。

## 元组

JavaScript 是没有元组的这个概念的，通常都是使用数组来实现它，而 TS 可以对其进行定义。

```ts
const tupleType: [string, number] = ['age', 123];
```

## 枚举

通常我们在 JavaScript 里使用对象来做一个映射结构，在 TS 里我们可以定义一个枚举值来完成这个操作。

```ts
// 默认情况下从 0 开始编号
enum Color {
  Red,
  Blue,
  Green
}

// 当然，我们也可以指定值
enum Color {
  Red = 1,
  Blue,
  Green
}

// 我们可以通过这个结构，方便的对值进行转换
const color: Color = Color.Red;
const colorName: string = Color[1];
```

## Any - 任意值

万事不定用 Any，
