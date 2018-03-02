# 类型转换

> JS 基础常考内容，一定要融会贯通。

## 数据类型

JS 中有 7 中数据类型：

基本类型： Null、Boolean、String、Number、Symbol、Undefined

复合类型： Object

## 显示类型转换

下面几个函数说明：

- valueOf(): 将该对象原始值返回
- toString(): 将该对象原始值以字符串返回

1. Number()

  ```js
  // 基本数据转换
  Number(1) // 数字： 数字 -> 数字
  Number('123') // 字符串： 纯数字 -> 数字，不是纯数字 -> NaN，空字符串 -> 0
  Number(true) // 布尔值： true -> 1，false -> 0
  Number(undefined) // NaN
  Number(null) // 0
  // 复合类型数据转换
  // 先调用 valueOf，如果输出为基本类型，则调用 Number，如果为复合类型，继续调用 toString，如果还不是基本数据类型就报错
  ```
    
2. String()

  ```js
  // String() 很简单，就是将这些基本类型都变成字符串：
  // 123 -> '123'
  // true -> 'true'
  // undefined -> 'undefined'
  // null -> 'null'
  // 复合类型转换
  // 这个和上面的有点区别，是先掉 toString 然后掉 valueOf
  ```
    
3. Boolean()

  +0 -0 undefined null '' NaN -> false，其余都为 true

## 隐式类型转换

1. 四则运算
2. 判断语句
3. Native 调用: 比如说 console.log()、alert()

例子：

```js
// Boolean()
![]  // false
!![] // true
!{}  // false
!!{} // true
[]+[] // ""
[]+1 // "1"
{}+{} // "[object Object][object Object]"
{}+[] // 0
[]+{} // "[object Object]"
1+{} // "1[object Object]"
```

一篇博客大家可以去看看，理解会更深入： https://segmentfault.com/a/1190000008038678
