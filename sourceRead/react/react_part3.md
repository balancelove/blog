> 这一小节主要是关于 React 更新流程的梳理。

## 在 React 中更新的方式

在 React 中更新有大概这么三种方式：

1. setState
2. forceUpdate
3. ReactDOM.render 或者是 hydrate (第一次渲染的时候)

## 更新的流程，我们先说 ReactDOM.render

我们先深入源码中，找到 `ReactDOM.js` 这个文件，找到 `ReactDOM.render` 这个函数：

```js
// ReactDOM.render(<App />, document.getElementById('root'));
render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  }
```

我们可以看到上面的三个参数，以我们平常使用 render 函数来说：

1. 第一个参数就是 `React.createElement` 返回的 `ReactElement`。
2. 第二个参数是 DOM 节点，也就是我们传入的 `document.getElementById('root')` 传入的元素节点。
3. 第三个参数是回调函数，也就是渲染完成后调用的 `callback`。

关于这些参数要记清楚，不然的话，到后面就会记不清了，看起来就很困惑。

从上面的的代码片段中我们可以看到，它调用了一个叫 `legacyRenderSubtreeIntoContainer` 的函数：

```js
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>, // null
  children: ReactNodeList,                     // ReactElement
  container: DOMContainer,                     // DOM
  forceHydrate: boolean,                       // false
  callback: ?Function,                         // callback
) {
  // 第一次渲染在 container 上肯定没有相应的方法，肯定是空的，所以第一次必然会走 !root 的逻辑
  let root: Root = (container._reactRootContainer: any);
  if (!root) {
    // Initial mount
    // 返回了 ReactRoot
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      // 处理 callback
    }
    // Initial mount should not be batched.
    // 批量更新
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        // ...
      } else {
        root.render(children, callback);
      }
    });
  } else {
    // ...
  }
  return getPublicRootInstance(root._internalRoot);
}
```

因为第一次 `container` 上并没有对应的属性，所以调用了 `legacyCreateRootFromDOMContainer` 函数去创建了一个 `ReactRoot` 对象，关于这个对象有不清楚的可以去第一部看看。

接下来我们关注的是 `root.render`，根据 `ReactRoot` 的结构，我们轻松的找到了挂载到 `ReactRoot` 上的 `render` 方法。

```js
// 在这个函数中其实我们只需要关心 updateContainer 函数，所以我们直接看这个函数
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  // 计算 Expiration time
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}

export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  // parentComponent = null
  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(current, element, expirationTime, callback);
}

function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // 标记需要更新的地方
  const update = createUpdate(expirationTime);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  flushPassiveEffects();
  // 把 update 加到 queue 里面
  enqueueUpdate(current, update);
  // 开始进行任务调度
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```