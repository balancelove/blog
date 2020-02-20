# React 的整体流程 - 创建更新

> 在了解 React 的源码之前，我们首先要了解 React 代码运行的大概流程是什么，下面这张图是我认为的 React 大体流程。

![flow](/react/flow.png)

在说流程之前，我们要明确一点，`react` 这个包里面只有一些基本的数据结构等等相关操作，具体的更新等流程主要是和平台相关，于是放在了 `react-dom` 这个包里。

## 创建更新

在 React 程序中，主要的更新入口有这三种：

1. `ReactDOM.render`，也就是我们的第一次渲染
2. 调用 `setState` 进行更新
3. 使用 `forceUpdate` 进行更新

在这三种方式中大体流程都是差不多的，区别比较大的是 `ReactDOM.render` 第一次渲染的时候，会初始化一些数据结构。

那么初始化的时候会创建哪些数据结构呢？

1. `ReactRoot`，这个对象提供了 `render` 的方法，同时在实例化的过程中创建了其余两个重要的数据结构。
2. `FiberRoot`，这就是 `ReactRoot` 创建的第一个对象，这个对象存放着整个 `React` 应用的信息。
3. `RootFiber`，这个对象就是一个 `Fiber` 对象，只不过这个 `Fiber` 对象特殊一点，它是我们应用更新的起点。

![](/react/init-tree.png)

那么创建好基本的数据结构后，会做啥呢？

1. 计算更新的优先级
2. 创建更新

在说更新之前，我们就要提到两个基本的数据结构了，分别是 `Update` 和 `UpdateQueue`。

```flow
// Update
type Update<State> = {
  // 更新的过期时间(理解为优先级)
  expirationTime: ExpirationTime,

  // 更新的类型
  // 1. const UpdateState = 0，更新 state
  // 2. const ReplaceState = 1，替换 state
  // 3. const ForceUpdate = 2，强制更新
  // 4. const CaptureUpdate = 3，捕获错误
  tag: 0 | 1 | 2 | 3,
  // 更新的内容，比如 setState 的第一个参数，比如 element
  payload: any,
  callback: (() => mixed) | null,

  // 下一个 Update，链表结构
  next: Update<State> | null,
  // 对应下一个 side Effect(变化)
  nextEffect: Update<State> | null
};

// UpdateQueue
type UpdateQueue<State> = {
  // 每次操作完更新之后的 state
  baseState: State,

  // 链表的第一个 Update
  firstUpdate: Update<State> | null,
  // 链表的最后一个 Update
  lastUpdate: Update<State> | null,

  // 第一个和最后一个捕获类型的 Update
  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,

  // 第一个和最后一个 side Effect
  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,

  // 第一个和最后一个被捕获的 side Effect
  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null
};
```

上面的数据结构不能理解也没关系，只需要知道两点，不管我们是以什么方式更新，都会创建更新的对象，而这个更新的对象的 `payload` 就是更新的内容，比如我们第一次更新时，`payload` 就是我们整个应用 (ReactElement)，然后 `React` 会将更新插入到更新的链表结构中去。

当我们创建好更新之后，进入下一个阶段之后的流程就是一样的了，这几种方式其实也是大同小异。

```js
// setState
enqueueSetState(inst, payload, callback) {
  const fiber = getInstance(inst);
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, fiber);

  const update = createUpdate(expirationTime);
  update.payload = payload;
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(fiber, update);
  scheduleWork(fiber, expirationTime);
}
// forceUpdate
enqueueForceUpdate(inst, callback) {
  const fiber = getInstance(inst);
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, fiber);

  const update = createUpdate(expirationTime);
  update.tag = ForceUpdate;

  if (callback !== undefined && callback !== null) {
    if (__DEV__) {
      warnOnInvalidCallback(callback, 'forceUpdate');
    }
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(fiber, update);
  scheduleWork(fiber, expirationTime);
}
// render，render 中间还有一层调用，但是没太大关系，就是计算更新的过期时间（优先级），然后下面创建更新
function updateContainer(
  element,
  container,
  parentComponent,
  callback,
) {
  const current = container.current;
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}

function scheduleRootUpdate(
  current,
  element,
  expirationTime,
  callback,
) {
  const update = createUpdate(expirationTime);
  // 更新的内容就是整个 ReactElement
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(current, update);
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```

很多同学可能注意到了，上面我只说了创建更新，那计算更新的优先级，也就是更新的过期时间怎么没说？其实这一部分拿出来单独说比较好，现在只要记住 `ExpirationTime` 越大，优先级越高，最高的就是 `Sync` 任务。

关于第一部分就说到这里，接下来的第二部分就复杂的多了。
