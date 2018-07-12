# Senaca 入门

> 写这个的原因是在看书的过程中，发现了 Seneca 的使用方法有变化了，所以去学习了一波，记录了一下。

__Version：__3.6.0

## 开始

seneca 是使用模式匹配来进行调用的，所以基础 api 就是下面两个：

```js
import seneca from 'seneca';

// ⚠️：这个消息用对象、字符串都可以
/**
* pattern: 在实例中接收的匹配的消息
* action: 模式匹配成功时执行的函数
*/
seneca.add('role:math,cmd:sum', (msg, reply) => {
    reply(null, { answer: msg.left + msg.right });
});
/**
* pattern: 去匹配已注册的服务的消息
* respond: 回掉函数
*/
seneca.act({role: 'math', cmd: 'sum', left: 1, right: 2 }, (err, result) => {
    if(err) {
        return console.error(err);
    }
    console.log(result);
});
// 最后结果： { answer: 3 }
```

好了，上面使用了两个方法，第一个 `add`方法是添加一个服务，而后面一个则是触发注册的这个服务。而触发哪一个服务是越精确的就会被触发，简而言之，匹配项最多的会被触发。

同时，我们可以通过模式重用代码：

```js
seneca.add('role: math, cmd: sum', (msg, respond) => {
  var sum = msg.left + msg.right
  respond(null, {answer: sum})
})

seneca.add('role: math, cmd: sum, integer: true', (msg, respond) => {
  this.act({
    role: 'math',
    cmd: 'sum',
    left: Math.floor(msg.left),
    right: Math.floor(msg.right)
  }, respond)
})
```

并且我们可以使用 `wrap`来匹配一组模式，用相同的函数去覆盖左右的模式。

## 微服务进程、微服务客户端

```js
require('seneca')()
  .use('math')
  .listen();

// 客户端
require('seneca')()
  .client();
```

