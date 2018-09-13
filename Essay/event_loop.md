# 一道面试题引发的血案

这次我们就不要那么多前戏，直奔主题，我们的龙门阵正式开始。

开局一道题，内容全靠吹。（此处应有滑稽）

```js
// 文件名: index.js
// 我们尽量模拟所有的异步场景，包括 timers、Promise、nextTick等等
setTimeout(() => {
  console.log('timeout 1');
}, 1);

process.nextTick(() => {
  console.log('nextTick 1');
});

fs.readFile('./index.js', (err, data) => {
  if(err) return;
  console.log('I/O callback');
  process.nextTick(() => {
      console.log('nextTick 2');
  });
});

setImmediate(() => {
  console.log('immediate 1');
  process.nextTick(() => {
      console.log('nextTick 3');
  });
});

setTimeout(() => {
  console.log('timeout 2');
  process.nextTick(() => {
    console.log('nextTick 4');
  });
}, 100);

new Promise((resolve, reject) => {
  console.log('promise run');
  process.nextTick(() => {
      console.log('nextTick 5');
  });
  resolve('promise then');
  setImmediate(() => {
      console.log('immediate 2');
  });
}).then(res => {
  console.log(res);
});
```

__note:__ 上面的代码执行环境是 node v10.7.0，浏览器的事件循环和 node 还是有一点区别的，有兴趣的可以自己找资料看一看。

好了，上面的代码涉及到定时器、nextTick、Promise、setImmediate 和  I/O 操作。头皮有点小发麻哈，大家想好答案了么？检查一下吧！

```js
promise run
nextTick 1
nextTick 5
promise then
timeout 1
immediate 1
immediate 2
nextTick 3
I/O callback
nextTick 2
timeout 2
nextTick 4
```

怎么样？跟自己想的一样么？不一样的话，就听我慢慢道来。

## event loop

在 Node.js 中，event loop 是基于 libuv 的。通过查看 [libuv](http://docs.libuv.org/en/v1.x/design.html) 的文档可以发现整个 event loop 分为 6 个阶段：

- timers: 定时器相关任务，node 中我们关注的是它会执行 setTimeout() 和 setInterval() 中到期的回调
- pending callbacks: 执行某些系统操作的回调
- idle, prepare: 内部使用
- poll: 执行 I/O callback，一定条件下会在这个阶段阻塞住
- check: 执行 setImmediate 的回调
- close callbacks: 如果 socket 或者 handle 关闭了，就会在这个阶段触发 close 事件，执行 close 事件的回调

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

event loop 的代码在文件 `deps/uv/src/unix/core.c` 中。

```c++
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  // 确定 event loop 是否继续
  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop); // 更新时间
    uv__run_timers(loop); // timers 阶段
    ran_pending = uv__run_pending(loop); // pending callbacks 阶段
    uv__run_idle(loop); // idle 阶段
    uv__run_prepare(loop); // prepare 阶段

    timeout = 0;
    // 设置 poll 阶段的超时时间，有以下情况超时时间设为 0，此时 poll 不会阻塞
    // 1. stop_flag 不为 0
    // 2. 没有活跃的 handles 和 request
    // 3. idle、pending callback、close 阶段 handle 队列不为空
    // 否则的话会将超时时间设置成距离当前时间最近的 timer 的时间
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);

    // poll 阶段
    uv__io_poll(loop, timeout);
    // check 阶段
    uv__run_check(loop);
    // close 阶段
    uv__run_closing_handles(loop);

    if (mode == UV_RUN_ONCE) {
      uv__update_time(loop);
      uv__run_timers(loop);
    }

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }

  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}
```

## 注册加触发

这一小节我们主要看看 Node 如何将我们写的定时器等等注册到 event loop 中去并执行的。

以 setTimeout 为例，首先我们进到了 `timers.js` 这个文件中，找到了 `setTimeout` 函数，我们主要关注这么两句：

```js
function setTimeout(callback, after, arg1, arg2, arg3) {
  // ...
  const timeout = new Timeout(callback, after, args, false);
  active(timeout);

  return timeout;
}
```

我们看到它 new 了一个  Timeout 类，我们顺着这条线索找到了 Timeout 的构造函数：

```js
function Timeout(callback, after, args, isRepeat) {
  // ...
  this._onTimeout = callback;
  // ...
}
```

我们主要关注这一句，Node 将回调挂载到了 `_onTimeout` 这个属性上。那么这个回调是在什么时候执行的呢？我们全局搜一下 `_onTimeout()`，我们可以发现是一个叫做 `ontimeout` 的方法执行了回调，好了，我们开始顺藤摸瓜，可以找到这么一条调用路径 `processTimers -> listOnTimeout -> tryOnTimeout -> ontimeout -> _onTimeout`。

最后的最后，我们在文件的头部发现了这么几行代码：

```js
const {
  getLibuvNow,
  setupTimers,
  scheduleTimer,
  toggleTimerRef,
  immediateInfo,
  toggleImmediateRef
} = internalBinding('timers');
setupTimers(processImmediate, processTimers);
```

我们一看，`setupTimers` 是从 `internalBinding('timers')` 获取的，我们去看一下 `internalBinding` 就知道这就是 js 代码和内建模块关联的地方了。于是，我们顺着这条线索往下找，我们去 `src` 目录下去找叫 timers 的文件，果不其然，我们找到一个叫 `timers.cc` 的文件，同时，找到了一个叫 `SetupTimers` 的函数。

```c++
void SetupTimers(const FunctionCallbackInfo<Value>& args) {
  CHECK(args[0]->IsFunction());
  CHECK(args[1]->IsFunction());
  auto env = Environment::GetCurrent(args);

  env->set_immediate_callback_function(args[0].As<Function>());
  env->set_timers_callback_function(args[1].As<Function>());
}
```

上面的 `args[1]` 就是我们传递的 `processTimers`，在这个函数中我们其实就完成了 `processTimers` 的注册，它成功的注册到了 node 中。

那是如何触发的回调呢？这里我们首先先看到 event loop 代码中的 timers 阶段执行的函数，然后跟进去：

```c++
void uv__run_timers(uv_loop_t* loop) {
  struct heap_node* heap_node;
  uv_timer_t* handle;

  for (;;) {
    heap_node = heap_min(timer_heap(loop));
    if (heap_node == NULL)
      break;

    handle = container_of(heap_node, uv_timer_t, heap_node);
    if (handle->timeout > loop->time)
      break;

    uv_timer_stop(handle);
    uv_timer_again(handle);
    handle->timer_cb(handle);
  }
}
```

这段代码我们将我们的目光放在 `handle->timer_cb(handle)` 这一行，这个函数是在哪儿定义的呢？我们全局搜一下 `timer_cb` 发现 `uv_timer_start` 中有这么一行代码：

```c++
handle->timer_cb = cb;
```

所以我们知道是调用了 `uv_timer_start` 将回调函数挂载到了 handle 上。那么 cb 又是什么呢？其实你沿着代码上去找就能发现其实 cb 就是 `timers_callback_function`，眼熟对么？这就是我们上面注册进来触发回调的函数 `processTimers`。

恍然大悟，原来是这么触发的回调，现在还有个问题，谁去调用的 `uv_timer_start` 呢？这个问题就简单了，我们通过源码可以知道是 `ScheduleTimer` 这个函数调用了，是不是感觉很熟悉，对，这个函数就是我们通过 `internalBinding` 引进来的 `scheduleTimer` 函数。

在这个地方就有点不一样了。现在最新的 tag 版本和 github 上 node 最新的代码是有区别的，在一次 pr 中，将 `timer_wrap.cc` 重构成了 `timers.cc`，并且移除了 `TimerWrap` 类，再说下面的区别之前，先补充一下 `timer` 对应的数据结构：

```js
// 这是在有 TimeWrap 的版本
// 对应的时间后面是一个 timer 链表
refedLists = {
  1000: TimeWrap._list(TimersList(item<->item<->item<->item)),
  2000: TimeWrap._list(TimersList(item<->item<->item<->item)),
};
// 这是 scheduleTimer 的版本
refedLists = {
  1000: TimersList(item<->item<->item<->item),
  2000: TimersList(item<->item<->item<->item),
};
```

在 `TimeWrap` 的版本里，js 是通过调用实例化后的 `start()` 函数去调用了 `uv_timer_start`。

而 `scheduleTimer` 版本是注册定时器的时候通过比较哪个定时器是最近要执行的，从而将对应时间的 `timerList` 注册到 `uv_timer` 中去。

那么，为什么要这么改呢？是为了让定时器和 Immediate 拥有更相似的行为，也就是将单个 uv_timer_t handle 存在 Environment 上（Immediate 是有一个 ImmediateQueue，这也是个链表）。

这里就只说了一个 timer，其他的大家就自己去看看吧，顺着这个思路大家肯定会有所收获的。

## 事件循环流程

在加载 node 的时候，将 setTimeout、setInterval 的回调注册到 timerList，将 Promise.resolve 等 microTask 的回调注册到 microTasks，将 setImmediate 注册到 immediateQueue 中，将 process.nextTick 注册到 nextTickQueue 中。

当我们开始 event loop 的时候，首先进入 timers 阶段（我们只看跟我们上面说的相关的阶段），然后就判断 timerList 的时间是否到期了，如果到期了就执行，没有就下一个阶段（其实还有 nextTick，等下再说）。

接下来我们说 poll 阶段，在这个阶段，我们先计算需要在这个阶段阻塞轮询的时间（简单点就是下个 timer 的时间），然后等待监听的事件。

下个阶段是 check 阶段，对应的是 immediate，当有 immediateQueue 的时候就会跳过 poll 直接到 check 阶段执行 setImmediate 的回调。

那有同学就要问了，nextTick 和 microTasks 去哪儿了啊？别慌，听我慢慢道来。

## process.nextTick 和 microTasks

现在我们有了刚刚找 timer 的经验，我们继续去看看 nextTick 是怎么执行的。

经过排查我们能找到一个叫 `_tickCallback` 的函数，它不断的从 nextTickQueue 中获取 nextTick 的回调执行。

```js
function _tickCallback() {
    let tock;
    do {
      while (tock = queue.shift()) {
        // ...
        const callback = tock.callback;
        if (tock.args === undefined)
          callback();
        else
          Reflect.apply(callback, undefined, tock.args);

        emitAfter(asyncId);
      }
      tickInfo[kHasScheduled] = 0;
      runMicrotasks();
    } while (!queue.isEmpty() || emitPromiseRejectionWarnings());
    tickInfo[kHasPromiseRejections] = 0;
  }
```

我们看到了什么？在将 nextTick 的回调执行完之后，它执行了 `runMicrotasks`。一切都真相大白了，microTasks 的执行时机是当执行完所有的 nextTick 的回调之后。那 nextTick 又是在什么时候执行的呢？

这就需要我们去找 C++ 的代码了，在 `bootstrapper.cc` 里找到了 `BOOTSTRAP_METHOD(_setupNextTick, SetupNextTick)`，所以我们就要去找 `SetupNextTick` 函数。

```c++
void SetupNextTick(const FunctionCallbackInfo<Value>& args) {
  Environment* env = Environment::GetCurrent(args);
  // ...
  env->set_tick_callback_function(args[0].As<Function>());
  // ...
}
```

我们关注这一句，是不是很熟啊，跟上面 timer 一样是吧，我们将 `__tickCallback` 注册到了 node，在 C++ 中通过 `tick_callback_function` 来调用这个函数。

我们通过查看源码可以发现是 `InternalCallbackScope` 这个类调用 `Close` 函数的时候就会触发 nextTixk 执行。

```c++
void InternalCallbackScope::Close() {
  if (closed_) return;
  closed_ = true;
  HandleScope handle_scope(env_->isolate());
  // ...
  if (!tick_info->has_scheduled()) {
    env_->isolate()->RunMicrotasks();
  }
  // ...
  if (!tick_info->has_scheduled() && !tick_info->has_promise_rejections()) {
    return;
  }
  // ...
  if (env_->tick_callback_function()->Call(process, 0, nullptr).IsEmpty()) {
    failed_ = true;
  }
}
```

可能有同学有疑问了，为啥在执行 nextTick 上面还有 `RunMicrotasks` 呢？其实这是对 event loop 的优化，假如没有 `process.nextTick` 就直接从 node 里面调用 `RunMicrotasks` 加快速度。

现在在 `node.cc` 里我们找到了调用 `Close` 的地方：

```c++
MaybeLocal<Value> InternalMakeCallback(Environment* env,
                                       Local<Object> recv,
                                       const Local<Function> callback,
                                       int argc,
                                       Local<Value> argv[],
                                       async_context asyncContext) {
  CHECK(!recv.IsEmpty());
  InternalCallbackScope scope(env, recv, asyncContext);

  scope.Close();

  return ret;
}
```

而 `InternalMakeCallback()` 则是在 `async_wrap.cc` 的 `AsyncWrap::MakeCallback()` 中被调用。

找了半天，只找到了 setImmediate 注册时，注册函数执行回调运行了这个函数，没有找到 timer 的。之前因为使用的 TimeWrap，TimeWrap 继承了 AsyncWrap，在执行回调的时候调用了 `MakeCallback()`，问题是现在移除了 `TimeWrap`，那是怎么调用的呢？我们会到 js 代码，发现了这样的代码：

```js
const { _tickCallback: runNextTicks } = process;
function processTimers(now) {
  runNextTicks();
}
```

一切都明了了，在移除了 `TimeWrap` 之后，将 `_tickCallback` 放到了这里执行，所以我们刚刚在 C++ 里找不到。

其实，每一个阶段执行完之后，都会去执行 `_tickCallback` ，只是方式可能有点不同。

## 答案解析

好了，刚刚了解了关于 event loop 的一些情况，我们再来看看文章开头的那段代码，我们一起来分析。

### 第一步

首先运行 Promise 里的代码，__输出了 promise run__，然后 promise.resolve 将 then 放入 microTasks。

### 第二步

这里要提到的一点是 nextTick 在注册之后，bootstrap 构建结束后运行`SetupNextTick`函数，这时候就会清空 nextTickQueue 和 MicroTasks，所以__输出 nextTick 1、nextTick 5、promise then__。

### 第三步

在 bootstrap 之后便进入了 event loop，第一个阶段 timers，这时 timeout 1 定时器时间到期，执行回调__输出 timeout 1__，timerList 没有其他定时器了，去清空 nextTickQueue 和 MicroTasks，没有任务，这时继续下阶段，这时候有 immediate，所以跳过 poll，进入 check，执行 immediate 回调，__输出 immediate 1 和 immediate 2__，并将 nextTick 3 推入 nextTickQueue，阶段完成 immediateQueue 没有需要处理的东西了，就去清空 nextTickQueue 和 MicroTasks __输出 nextTick 3__。

### 第四步

在这一轮，文件读取完成，并且 timers 没到期，进入 poll 阶段，超时时间设置为 timeout 2 的时间，执行回调__输出 I/O callback__，并且向 nextTickQueue 推入 nextTick 2。阻塞过程中没有其他的 I/O 事件，去清空 nextTickQueue 和 MicroTasks，__输出 nextTick 2__。

### 第五步

这时候又到了 timers 阶段，执行 timeout 2 的回调，__输出 timeout 2__，将 nextTick 4 推入 nextTickQueue，这时 timeList 已经没有定时器了，清空 nextTickQueue 和 MicroTasks __输出 nextTick 4__。

## 总结

不知道大家懂了没有，整个过程其实还比较粗糙，在学习过程中也看了不少的源码分析，但是 node 发展很快，很多分析已经过时了，源码改变了不少，但是对于理清思路还是很有作用的。

各位看官如果觉得还行、OK、有点用，欢迎来我 [GitHub](https://github.com/balancelove/readingNotes) 给个小星星，我会很舒服的，哈哈。