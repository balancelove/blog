# 适配器模式

> 适配器模式是当用户期待的接口和 api 提供的接口不兼容，同时又避免大量改写现有的接口代码，这时候适配器就派上用场了。

## 例子

就像我们现在使用的有些手机一样，他不支持耳机接口，只有 TypeC 的接口，怎么办呢？这时候我们就需要一个适配器，也就是转接口，适配器也就是这个意思。

```js
// 手机 TypeC 接口
class Phone {
    listen() {
        return 'TypeC 接口';
    }
}
// 转接线
class Adapter {
    constructor() {
        this.adaptee = new Phone();
    }
    listen() {
        const music = this.adaptee.listen();
        // 做适配处理
        return `耳机接口`;
    }
}

// 用户
const Erji = new Adapter();
Erji.listen();
```

## 使用场景

1. 封装一些旧接口的时候。
2. 就是对老数据做处理，然后返回新数据，需要转换