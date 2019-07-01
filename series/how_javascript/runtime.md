# 【译】JavaScript 如何工作：对引擎、运行时、调用堆栈的概述

> 原文地址: https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf

PS: 好久没写东西了，最近一直在准备写一个自己的博客，最后一些技术方向已经敲定了，又可以开心的学习了，node系列后续再开始。

---
&emsp;&emsp;随着JavaScript越来越流行，越来越多的团队广泛的把JavaScript应用到前端、后台、hybrid 应用、嵌入式等等领域。

&emsp;&emsp;这篇文章旨在深入挖掘JavaScript，以及向大家解释JavaScript是如何工作的。我们通过了解它的底层构建以及它是怎么发挥作用的，可以帮助我们写出更好的代码与应用。据 GitHut 统计显示，JavaScript 长期占据GitHub中 `Active Repositories` 和 `Total Pushes` 的榜首，并且在其他的类别中也不会落后太多。

![](https://user-gold-cdn.xitu.io/2017/11/10/085110914b3ecfb71282e39d75dbc77c)

&emsp;&emsp;如果一个项目越来越依赖 JavaScript，这就意味着开发人员必须利用这些语言和生态系统提供更深层次的核心内容去构建一个令人振奋的应用。然而，事实证明，有很多的开发者每天都在使用 JavaScript，但是却不知道在底层 JavaScript 是怎么运作的。

## 概述

&emsp;&emsp;几乎每个人听说过 V8 引擎的概念，而且，大多数人都知道 JavaScript 是单线程的，或者是它是使用回调队列的。

&emsp;&emsp;在这篇文章中，我们将详细的介绍这些概念，并解释 JavaScript 是怎么工作的。通过了解这些细节，你就能利用这些提供的 API 来写出更好的，非阻塞的应用来。如果你对 JavaScript 比较陌生，那么这篇文章将帮助您理解为什么 JavaScript 相较于其他语言显得如此“怪异”。如果您是一位经验丰富的 JavaScript 开发人员，希望它能给你带来一些新的见解，说明 JavaScript 的运行时，尽管你可能每天都会用到它。

## JavaScript 引擎

&emsp;&emsp;JavaScript 引擎说起来最流行的当然是谷歌的 V8 引擎了， V8 引擎使用在 Chrome 以及 Node 中，下面有个简单的图能说明他们的关系：


![](https://user-gold-cdn.xitu.io/2017/11/11/5d0653fff3ec904dbe210161f3ec9196)

&emsp;&emsp;这个引擎主要由两部分组成:

+ 内存堆：这是内存分配发生的地方
+ 调用栈：这是你的代码执行时的地方

## 运行时

&emsp;&emsp;有些浏览器的 API 经常被使用到(比如说：setTimeout)，但是，这些 API 却不是引擎提供的。那么，他们是从哪儿来的呢？事实上这里面实际情况有点复杂。


![](https://user-gold-cdn.xitu.io/2017/11/11/ceb8f35afdeaee60e60053fa73a5cc01)

&emsp;&emsp;所以说我们还有很多引擎之外的 API，我们把这些称为浏览器提供的 Web API，比如说 DOM、AJAX、setTimeout等等。

&emsp;&emsp;然后我们还拥有如此流行的事件循环和回调队列。

## 调用栈

&emsp;&emsp;JavaScript 是一门单线程的语言，这意味着它只有一个调用栈，因此，它同一时间只能做一件事。

&emsp;&emsp;调用栈是一种数据结构，它记录了我们在程序中的位置。如果我们运行到一个函数，它就会将其放置到栈顶。当从这个函数返回的时候，就会将这个函数从栈顶弹出，这就是调用栈做的事情。

&emsp;&emsp;让我们来看一看下面的例子：

```js
    function multiply(x, y) {
      return x * y;
    }
    function printSquare(x) {
      var s = multiply(x, x);
      console.log(s);
    }
    printSquare(5);
```

&emsp;&emsp;当程序开始执行的时候，调用栈是空的，然后，步骤如下：

![](https://user-gold-cdn.xitu.io/2017/11/11/bc37a6231fca3b0aa3cd36369e866837)

&emsp;&emsp;每一个进入调用栈的都称为__调用帧__。

&emsp;&emsp;这能清楚的知道当异常发生的时候堆栈追踪是怎么被构造的，堆栈的状态是如何的。让我们看一下下面的代码：

```js
    function foo() {
      throw new Error('SessionStack will help you resolve crashes :)');
    }
    function bar() {
      foo();
    }
    function start() {
      bar();
    }
    start();
```

&emsp;&emsp;如果这发生在 Chrome 里(假设这段代码实在一个名为 foo.js 的文件中)，那么将会生成以下的堆栈追踪：

![](https://user-gold-cdn.xitu.io/2017/11/11/f6e50bf394efe82889e3a53b788a46fc)

&emsp;&emsp;"__堆栈溢出__"，当你达到调用栈最大的大小的时候就会发生这种情况，而且这相当容易发生，特别是在你写递归的时候却没有全方位的测试它。我们来看看下面的代码：

```js
    function foo() {
      foo();
    }
    foo();
```

&emsp;&emsp;当我们的引擎开始执行这段代码的时候，它从 foo 函数开始。然后这是个递归的函数，并且在没有任何的终止条件的情况下开始调用自己。因此，每执行一步，就会把这个相同的函数一次又一次地添加到调用堆栈中。然后它看起来就像是这样的：


![](https://user-gold-cdn.xitu.io/2017/11/11/3925f8363d7a763e6474709ccddf7d96)

&emsp;&emsp;然后，在某一时刻，调用栈中的函数调用的数量超过了调用栈的实际大小，浏览器决定干掉它，抛出一个错误，它看起来就像是这样:

![](https://user-gold-cdn.xitu.io/2017/11/11/dd22fb2bbec4be37367155083e61773a)

&emsp;&emsp;在单个线程上运行代码很容易，因为你不必处理在多线程环境中出现的复杂场景——例如死锁。但是在一个线程上运行也非常有限制。由于 JavaScript 只有一个调用堆栈，当某段代码运行变慢时会发生什么?

## 并发与事件循环

&emsp;&emsp;调用栈中的函数调用需要大量的时间来处理，那么这会发生什么情况呢?例如，假设你想在浏览器中使用 JavaScript 进行一些复杂的图片转码。

&emsp;&emsp;你可能会问？这算什么问题？事实上，问题是当调用栈有函数要执行，浏览器就不能做任何事，它会被堵塞住。这意味着浏览器不能渲染，不能运行其他的代码，它被卡住了。如果你想在应用里让 UI 很流畅的话，这就会产生问题。

&emsp;&emsp;而且这不是唯一的问题，一旦你的浏览器开始处理调用栈中的众多任务，它可能会停止响应相当长一段时间。大多数浏览器都会这么做，报一个错误，询问你是否想终止 web 页面。


![](https://user-gold-cdn.xitu.io/2017/11/11/4bb4fad58264a60cc6c7d9b1219dde10)

&emsp;&emsp;这样看来，这并不是最好的用户体验，不是吗？

&emsp;&emsp;那么，如何在不阻塞 UI 的情况下执行复杂的代码，让浏览器不会不响应?解决方案就是异步回调。这将在“ JavaScript 如何工作”教程的第2部分中详细解释:“在V8引擎中，如何编写优化代码”。