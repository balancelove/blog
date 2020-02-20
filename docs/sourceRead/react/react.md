# React 的整体流程梳理

## 创建核心数据结构 ReactRoot、FiberRoot、RootFiber

从 `ReactDOM.render` 函数进入流程，在第一遍的时候会创建一个 `ReactRoot` 对象，在这个对象中有一个 `_internalRoot` 属性，这个属性是创建的 `FiberRoot` 对象，这个对象上存放了很多整个应用的信息。

```js
// fiberRoot
_internalRoot = {
  // rootFiber 对象
  current: uninitializedFiber,
  // 挂载 html 的那个 dom 节点
  containerInfo
};

// 同时将 rootFiber 的 stateNode 属性指向当前的 fiberRoot 对象
uninitializedFiber.stateNode = _internalRoot;
```

到这里第一阶段的数据结构也就创建完成了。

## 调用 ReactRoot 的 render 方法

当我们把上面的数据结构准备好之后，就会去调用 `ReactRoot` 上的 `render` 方法。

首先，我们会调用一个 `updateContainer` 的方法：

```js
// 计算 ExpirationTime
function updateContainer(element, container, parentComponent, callback) {
  // 获取 FiberRoot 的 current 属性，也就是 RootFiber
  var current$$1 = container.current;
  // 获取 performance.now() - 文件加载时的时间（也就是从文件加载到这句执行的时间差），然后将 ms 转换成 ExpirationTime 的表示
  var currentTime = requestCurrentTime();
  // 这里面会根据是否有强制指定 ExpirationContext，或者 fiber 的 mode 是不是 ConcurrentMode(异步) 来返回不同的 ExpirationTime，这里其实也就是 Sync
  var expirationTime = computeExpirationForFiber(currentTime, current$$1);
  // 这个方法会有一些和 context 相关的操作，这里可以不管
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback
  );
}
```

经过上面的操作，我们进入到了 `scheduleRootUpdate` 函数。

## 创建更新

在 `scheduleRootUpdate` 函数中，我们会创建 `Update` 对象，这个对象存放了更新的相关信息。

比如说，我们第一次更新，更新的内容是整个 ReactElement。

```js
update = {
  expirationTime: expirationTime,
  tag: UpdateState,
  payload: null,
  callback: null,
  next: null,
  nextEffect: null,
  payload: {
    element: ReactElement
  }
};
```

当我们创建好了 `update` 之后就将它插入到 `updateQueue` 中去，这个队列也是 `fiber` 上的那个 `updateQueue`。

## 任务调度

在上面创建了更新之后，就调用 `scheduleWork` 进入任务调度。

进入 `scheduleWork` 后调用的第一个函数就是 `scheduleWorkToRoot`，这函数干了什么呢？

```js
function scheduleWorkToRoot(fiber, expirationTime) {
  // 更新 fiber 的 expirationTime
  if (fiber.expirationTime < expirationTime) {
    // fiber 上的 expirationTime 小于传入的 expirationTime，说明当前的优先级更高
    fiber.expirationTime = expirationTime;
  }

  // 当前 fiber 的 alternate
  var alternate = fiber.alternate;

  // 如果有 alternate，还要更新 alternate 上的 ExpirationTime
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }
  // Walk the parent path to the root and update the child expiration time.

  // fiber 的父节点
  var node = fiber.return;
  var root = null;

  // 下面的一系列操作就是寻找当前更新的 FiberRoot，并且修改这个更新路径上的 childExpirationTime
  if (node === null && fiber.tag === HostRoot) {
    // 如果 node === null，tag === HostRoot，就说明当前 fiber 节点是 RootFiber
    // RootFiber 的 stateNode 就是 FiberRoot
    root = fiber.stateNode;
  } else {
    while (node !== null) {
      alternate = node.alternate;

      if (node.childExpirationTime < expirationTime) {
        node.childExpirationTime = expirationTime;

        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
        alternate.childExpirationTime = expirationTime;
      }

      if (node.return === null && node.tag === HostRoot) {
        root = node.stateNode;
        break;
      }

      node = node.return;
    }
  }
  return root;
}
```

接下来就设置了 `FiberRoot` 上的各种 `time`，还有 `nextExpirationTimeToWorkOn`，也就是当前这次更新的 `ExpirationTime`。

## 请求工作(requestWork)

在 `requestWork` 中，第一个调用的函数是 `addRootToSchedule`。

这个函数是将当前要更新的 `root` 加入到 `root` 调度链中去。

TODO: 批量更新

在这里，有关于批量更新的优化。

然后，根据不同的 `ExpirationTime` 来调用不同的执行工作。

```js
if (expirationTime === Sync) {
  // 同步任务
  performSyncWork();
} else {
  // 异步任务
  scheduleCallbackWithExpirationTime(root, expirationTime);
}
```

## 执行工作(performWork)

同步的时候，传入的参数是 `Sync` 和 `false`。

第二个参数传入的代表任务是否可以中断，`true` 就是可以中断，`false` 就是不能够中断。

最后就是在 `while` 循环中调用 `performWorkOnRoot` 函数。

```js
var finishedWork = root.finishedWork;

if (finishedWork !== null) {
  // This root is already complete. We can commit it.
  completeRoot(root, finishedWork, expirationTime);
} else {
  root.finishedWork = null;
  // If this root previously suspended, clear its existing timeout, since
  // we're about to try rendering again.

  var timeoutHandle = root.timeoutHandle;

  if (timeoutHandle !== noTimeout) {
    root.timeoutHandle = noTimeout;
    // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above

    cancelTimeout(timeoutHandle);
  }

  renderRoot(root, isYieldy);
  finishedWork = root.finishedWork;

  if (finishedWork !== null) {
    // We've completed the root. Commit it.
    completeRoot(root, finishedWork, expirationTime);
  }
}
```

在 `renderRoot` 中，通过 `FiberRoot` 创建了一个 `workInProgress`。

最主要的流程就是调用了 `workLoop` 函数。

## workLoop

```js
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    // 不能打断，第一个 nextUnitOfWork 就是 RootFiber 的 workInProgress
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until there's a higher priority event
    // 可以被高优先级任务打断
    while (nextUnitOfWork !== null && !shouldYieldToRenderer()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}
```

## performUnitOfWork

```js
// performUnitOfWork 的主要流程就是调用 beginWork 以及 completeUnitOfWork
function performUnitOfWork(workInProgress) {
  // The current, flushed, state of this fiber is the alternate.
  // Ideally nothing should rely on this, but relying on it here
  // means that we don't need an additional field on the work in
  // progress.
  var current = workInProgress.alternate;
  // See if beginning this work spawns more work.

  var next = beginWork(current, workInProgress, nextRenderExpirationTime);
  workInProgress.memoizedProps = workInProgress.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(workInProgress);
  }

  ReactCurrentOwner$2.current = null;
  return next;
}
```

在这个过程中有几个比较重要的函数。

### beginWork

```js
function beginWork(current, workInProgress, renderExpirationTime) {
  // Fiber 节点上的 ExpirationTime，是 Fiber 产生的 ExpirationTime
  const updateExpirationTime = workInProgress.expirationTime;

  // current 只有第一次渲染这个节点的时候会为 null，如果不为 null，就说明这个节点之前渲染过了
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    // 如果 props 不相同，或者 context 改变了，说明这个节点需要更新
    if (oldProps !== newProps || hasLegacyContextChanged()) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
      // 或者是当前节点的 ExpirationTime 要小于这次更新的 ExpirationTime
      // 就说明不需要更新，可以跳过
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false;
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      // 通过不同的 tag 来执行不同的操作
      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress);
          resetHydrationState();
          break;
        case HostComponent:
          pushHostContext(workInProgress);
          break;
        case ClassComponent: {
          const Component = workInProgress.type;
          if (isLegacyContextProvider(Component)) {
            pushLegacyContextProvider(workInProgress);
          }
          break;
        }
        case HostPortal:
          pushHostContainer(
            workInProgress,
            workInProgress.stateNode.containerInfo
          );
          break;
        case ContextProvider: {
          const newValue = workInProgress.memoizedProps.value;
          pushProvider(workInProgress, newValue);
          break;
        }
        case Profiler:
          if (enableProfilerTimer) {
            workInProgress.effectTag |= Update;
          }
          break;
        case SuspenseComponent: {
          const state: SuspenseState | null = workInProgress.memoizedState;
          const didTimeout = state !== null;
          if (didTimeout) {
            // If this boundary is currently timed out, we need to decide
            // whether to retry the primary children, or to skip over it and
            // go straight to the fallback. Check the priority of the primary
            // child fragment.
            const primaryChildFragment: Fiber = (workInProgress.child: any);
            const primaryChildExpirationTime =
              primaryChildFragment.childExpirationTime;
            if (
              primaryChildExpirationTime !== NoWork &&
              primaryChildExpirationTime >= renderExpirationTime
            ) {
              // The primary children have pending work. Use the normal path
              // to attempt to render the primary children again.
              return updateSuspenseComponent(
                current,
                workInProgress,
                renderExpirationTime
              );
            } else {
              // The primary children do not have pending work with sufficient
              // priority. Bailout.
              const child = bailoutOnAlreadyFinishedWork(
                current,
                workInProgress,
                renderExpirationTime
              );
              if (child !== null) {
                // The fallback children have pending work. Skip over the
                // primary children and work on the fallback.
                return child.sibling;
              } else {
                return null;
              }
            }
          }
          break;
        }
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime
      );
    }
  } else {
    // 不需要更新
    didReceiveUpdate = false;
  }

  // Before entering the begin phase, clear the expiration time.
  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      const elementType = workInProgress.elementType;
      return mountIndeterminateComponent(
        current,
        workInProgress,
        elementType,
        renderExpirationTime
      );
    }
    case LazyComponent: {
      const elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        updateExpirationTime,
        renderExpirationTime
      );
    }
    case FunctionComponent: {
      // 读取 workInProgress 的 type，这个 type 就是 ReactElement 上的 $$typeof
      // 对于 FunctionComponent 来说就是那个 function
      const Component = workInProgress.type;
      // 新的一次渲染产生的 props
      const unresolvedProps = workInProgress.pendingProps;
      // 跟 Suspend 组件有关
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        // current Fiber
        current,
        // WorkInProgress
        workInProgress,
        // 函数
        Component,
        resolvedProps,
        // 当前更新的优先级
        renderExpirationTime
      );
    }
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      );
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    case HostText:
      return updateHostText(current, workInProgress);
    case SuspenseComponent:
      return updateSuspenseComponent(
        current,
        workInProgress,
        renderExpirationTime
      );
    case HostPortal:
      return updatePortalComponent(
        current,
        workInProgress,
        renderExpirationTime
      );
    case ForwardRef: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps);
      return updateForwardRef(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderExpirationTime
      );
    }
    case Fragment:
      return updateFragment(current, workInProgress, renderExpirationTime);
    case Mode:
      return updateMode(current, workInProgress, renderExpirationTime);
    case Profiler:
      return updateProfiler(current, workInProgress, renderExpirationTime);
    case ContextProvider:
      return updateContextProvider(
        current,
        workInProgress,
        renderExpirationTime
      );
    case ContextConsumer:
      return updateContextConsumer(
        current,
        workInProgress,
        renderExpirationTime
      );
    case MemoComponent: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      // Resolve outer props first, then resolve inner props.
      let resolvedProps = resolveDefaultProps(type, unresolvedProps);
      if (__DEV__) {
        if (workInProgress.type !== workInProgress.elementType) {
          const outerPropTypes = type.propTypes;
          if (outerPropTypes) {
            checkPropTypes(
              outerPropTypes,
              resolvedProps, // Resolved for outer only
              'prop',
              getComponentName(type),
              getCurrentFiberStackInDev
            );
          }
        }
      }
      resolvedProps = resolveDefaultProps(type.type, resolvedProps);
      return updateMemoComponent(
        current,
        workInProgress,
        type,
        resolvedProps,
        updateExpirationTime,
        renderExpirationTime
      );
    }
    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        updateExpirationTime,
        renderExpirationTime
      );
    }
    case IncompleteClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return mountIncompleteClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      );
    }
    default:
      invariant(
        false,
        'Unknown unit of work tag. This error is likely caused by a bug in ' +
          'React. Please file an issue.'
      );
  }
}
```

### updateHostRoot

```js
// 更新 RootFiber
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  pushHostRootContext(workInProgress);
  // 获取 HostRoot 上的更新队列（update.payload = { element: ReactElement }）
  const updateQueue = workInProgress.updateQueue;
  invariant(
    updateQueue !== null,
    'If the root does not have an updateQueue, we should have already ' +
      'bailed out. This error is likely caused by a bug in React. Please ' +
      'file an issue.'
  );
  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState !== null ? prevState.element : null;
  // 通过 updateQueue 计算新的 state，并且赋值 effect 链
  processUpdateQueue(
    workInProgress,
    updateQueue,
    nextProps,
    null,
    renderExpirationTime
  );
  // 也就是 { element: ReactElement }
  const nextState = workInProgress.memoizedState;
  // nextState.element 也就是 App 那些 ReactElement
  const nextChildren = nextState.element;
  // 如果和之前的一样，说明可以复用
  if (nextChildren === prevChildren) {
    // If the state is the same as before, that's a bailout because we had
    // no work that expires at this time.
    resetHydrationState();
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderExpirationTime
    );
  }
  // 获取当前节点的实例，也就是 stateNode(FiberRoot)
  const root = workInProgress.stateNode;
  // hydrate 模式
  if (
    (current === null || current.child === null) &&
    root.hydrate &&
    enterHydrationState(workInProgress)
  ) {
    workInProgress.effectTag |= Placement;

    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime
    );
    resetHydrationState();
  }
  return workInProgress.child;
}
```

### reconcileChildren

```js
function reconcileChildren(
  current,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  // current 为 null，说明第一次
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    // 如果这是一个还没有渲染的新组件，我们将不会使用最小的 side-effects 来更新它，
    // 相反，我们会将他们全部加到子节点中去
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
  } else {
    // 说明之前渲染过
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime
    );
  }
}
```

### reconcileChildFibers

```js
function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    expirationTime,
  ) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

    // Handle object types
    // 是不是个对象，并且不为空
    const isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        // React Element
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
        // portal
        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime,
            ),
          );
      }
    }

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          '' + newChild,
          expirationTime,
        ),
      );
    }

    if (isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime,
      );
    }

    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime,
      );
    }

    if (isObject) {
      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (__DEV__) {
      if (typeof newChild === 'function') {
        warnOnFunctionType();
      }
    }
    if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
      // If the new child is undefined, and the return fiber is a composite
      // component, throw an error. If Fiber return types are disabled,
      // we already threw above.
      switch (returnFiber.tag) {
        case ClassComponent: {
          if (__DEV__) {
            const instance = returnFiber.stateNode;
            if (instance.render._isMockFunction) {
              // We allow auto-mocks to proceed as if they're returning null.
              break;
            }
          }
        }
        // Intentionally fall through to the next case, which handles both
        // functions and classes
        // eslint-disable-next-lined no-fallthrough
        case FunctionComponent: {
          const Component = returnFiber.type;
          invariant(
            false,
            '%s(...): Nothing was returned from render. This usually means a ' +
              'return statement is missing. Or, to render nothing, ' +
              'return null.',
            Component.displayName || Component.name || 'Component',
          );
        }
      }
    }

    // Remaining cases are all treated as empty.
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}
```

### performUnitOfWork 的流程

举个例子，比如这样的结构

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        { id: 1, name: 'Cory' },
        { id: 2, name: 'Meg' },
        { id: 3, name: 'Bob' }
      ]
    };
  }

  deleteUser = id => {
    this.setState(prevState => {
      return {
        users: prevState.users.filter(user => user.id !== id)
      };
    });
  };

  render() {
    return (
      <div>
        <h1>Users</h1>
        <ul>
          {this.state.users.map(user => {
            return (
              <User key={user.id} user={user} onDeleteClick={this.deleteUser} />
            );
          })}
        </ul>
      </div>
    );
  }
}

class User extends Component {
  render() {
    const {
      onDeleteClick,
      user: { id, name }
    } = this.props;
    return (
      <li>
        <input type='button' value='Delete' onClick={() => onDeleteClick(id)} />
        {name}
      </li>
    );
  }
}
```

那么上面的代码是如何表示的呢？

![Fiber Tree](/react/fiber-tree.png)

就拿上面的流程来说：

1. 第一次进入 performUnitOfWork，执行的这个单元是 `RootFiber`，然后进入 `beginWork`。
