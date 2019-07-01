# 代理模式

> 代理模式就是在我们真正要访问的对象之前添加一层拦截，使得我们不能直接去访问真正的对象，而是通过一层代理去访问他。

## 例子

```js
class Real{
    talk() {
        consoe.log('i am talking');
    }
}

class proxy{
    constructor() {
        this.real = new Real();
    }
    
    talk() {
        this.real.talk();
    }
}
```

很简单的一层代理，其实我们可以在新的 ES 标准也可以看到 Proxy，具体可以到 ECMAScript 下查看。