# 函数

> 函数是 js 中相当重要的一块。

## 函数定义

```typescript
// 函数声明，输入多余的（或者少于要求的）参数
function sum(x: number, y: number): number {
    return x + y;
}
// 函数表达式
let mySum = function (x: number, y: number): number {
    return x + y;
};
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
// 接口进行定义
interface SumFunc {
    (x: string, y: string): number;
}
let mySum:SumFunc;
mySum = function (x: number, y: number) {
    return x + y;
};
```

## 可选参数

```typescript
// 可选参数必须接在必需参数后面
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
```

## 默认参数

```typescript
function add(x:number, y:number, z:number = 0):number {
    return x + y + z;
}
```

## 剩余参数

```typescript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
```

## 重载

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```



