# React 的整体流程 - commit

> Commit 阶段是不能够被打断的，在这个阶段会处理上个阶段的 `side effect`，更新 dom 树，将所有的更新都 commit 到 dom 上。

在 `commitRoot` 这个函数中，主要有三个 `while` 循环，每一层循环都是在 `sideEffect` 链上进行操作。

## while 1

这一步就是调用 `ClassComponent` 上可能存在的 `getSnapshotBeforeUpdate` 生命周期。

```js
while (nextEffect !== null) {
  let didError = false;
  let error;
  try {
    // 调用 classComponent 上的 getSnapshotBeforeUpdate 那个生命周期
    commitBeforeMutationLifecycles();
  } catch (e) {
    didError = true;
    error = e;
  }
  if (didError) {
    captureCommitPhaseError(nextEffect, error);
    // Clean-up
    if (nextEffect !== null) {
      nextEffect = nextEffect.nextEffect;
    }
  }
}
```

## while 2

在这个阶段就是根据不同的 `effect tag` 来更新 `dom` 结构，至于具体是怎么更新的就等待后续了，这里就不具体说了。

```js
while (nextEffect !== null) {
  let didError = false;
  let error;
  try {
    // 操作对于 dom 的，节点的内容，增加、删除、更新
    commitAllHostEffects();
  } catch (e) {
    didError = true;
    error = e;
  }
  if (didError) {
    captureCommitPhaseError(nextEffect, error);
    // Clean-up
    if (nextEffect !== null) {
      nextEffect = nextEffect.nextEffect;
    }
  }
}
```

## while 3

在这个 `while` 循环里会去调用剩下的相关的生命周期方法。

```js
while (nextEffect !== null) {
  let didError = false;
  let error;
  try {
    // 调用相关的生命周期方法
    commitAllLifeCycles(root, committedExpirationTime);
  } catch (e) {
    didError = true;
    error = e;
  }
  if (didError) {
    invariant(
      nextEffect !== null,
      'Should have next effect. This error is likely caused by a bug ' +
        'in React. Please file an issue.'
    );
    captureCommitPhaseError(nextEffect, error);
    if (nextEffect !== null) {
      nextEffect = nextEffect.nextEffect;
    }
  }
}
```

整个 React 的更新流程大概就是这样了，具体细节，下回再见分晓。
