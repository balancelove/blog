> 这里记录着在阅读 React 源码中所遇的所有数据结构及相应解释。

[[toc]]

## ElementType

这是在创建元素时给对应元素的 `$$typeof` 属性赋的值。

```js
export const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;
export const REACT_PORTAL_TYPE = hasSymbol
  ? Symbol.for('react.portal')
  : 0xeaca;
export const REACT_FRAGMENT_TYPE = hasSymbol
  ? Symbol.for('react.fragment')
  : 0xeacb;
export const REACT_STRICT_MODE_TYPE = hasSymbol
  ? Symbol.for('react.strict_mode')
  : 0xeacc;
export const REACT_PROFILER_TYPE = hasSymbol
  ? Symbol.for('react.profiler')
  : 0xead2;
export const REACT_PROVIDER_TYPE = hasSymbol
  ? Symbol.for('react.provider')
  : 0xeacd;
export const REACT_CONTEXT_TYPE = hasSymbol
  ? Symbol.for('react.context')
  : 0xeace;
export const REACT_ASYNC_MODE_TYPE = hasSymbol
  ? Symbol.for('react.async_mode')
  : 0xeacf;
export const REACT_CONCURRENT_MODE_TYPE = hasSymbol
  ? Symbol.for('react.concurrent_mode')
  : 0xeacf;
export const REACT_FORWARD_REF_TYPE = hasSymbol
  ? Symbol.for('react.forward_ref')
  : 0xead0;
export const REACT_SUSPENSE_TYPE = hasSymbol
  ? Symbol.for('react.suspense')
  : 0xead1;
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
export const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
```

从名字就能够看出对应的是哪一类元素的 `$$typeof`，要说明的 `REACT_ELEMENT_TYPE` 是对应的是所有被 `React.createElement()` 创建出来的元素的 `$$typeof`。

## ReactElement

这是通过 `React.createElement()` 创建元素时返回的 ReactElement。

```js
const element = {
  // This tag allows us to uniquely identify this as a React Element
  $$typeof: REACT_ELEMENT_TYPE,
  // type 属性是该函数的第一个参数
  type: type,
  key: key,
  ref: ref,
  props: props,
  // Record the component responsible for creating this element.
  _owner: owner,
};
```

值得注意的是，所有通过这个函数创建的元素的 `$$typeof` 的值都是 `REACT_ELEMENT_TYPE`。

## ReactComponent

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

上面就是 `Component` 的结构了，至于 `setState` 里面调用的函数是在 `react-dom` 里处理的。

至于 `PureComponent` 是在原型上有一个 `isPureReactComponent` 属性为 `true`。

## ReactRoot

```js
function ReactRoot(
  container: Container,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  // createContainer 创建了一个 FiberRoot
  const root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}
ReactRoot.prototype.render = () => {};
ReactRoot.prototype.unmount = () => {};
ReactRoot.prototype.legacy_renderSubtreeIntoContainer = () => {};
ReactRoot.prototype.createBatch = () => {};
```

## FiberRoot

```js
type FiberRoot = {
  containerInfo: any,             // Dom 元素
  pendingChildren: any,           // 只有在持续更新的时候用到？什么是持续更新？React-dom 没有用到
  current: Fiber,                 // 对应着 ReactRoot 的 Fiber 对象，也是 Fiber 结构中的 Root Fiber
  /** 
  * 以下的优先级是用来区分：
  * 1) 没有提交的 (uncommitted) 任务
  * 2) 没有提交的、挂起的任务
  * 3) 没有提交的、可能被挂起的任务
  */
  // 最老的、最新的在提交时被挂起
  earliestSuspendedTime: ExpirationTime,
  latestSuspendedTime: ExpirationTime,
  // 最老的、最新的不确定会挂起
  earliestPendingTime: ExpirationTime,
  latestPendingTime: ExpirationTime,
  // 通过 Promise 的 resolve 重新尝试
  latestPingedTime: ExpirationTime,
  // 缓存相关？暂时不知道用来干什么
  pingCache:
    | WeakMap<Thenable, Set<ExpirationTime>>
    | Map<Thenable, Set<ExpirationTime>>
    | null,
  // 标记整个应用在渲染时是否错误
  didError: boolean,
  // 正在等待提交的任务
  pendingCommitExpirationTime: ExpirationTime,
  // 更新完之后可以提交了
  finishedWork: Fiber | null,
  // 标记 Suspense 的超时
  timeoutHandle: TimeoutHandle | NoTimeout,
  // 只有调 renderSubtreeIntoContainer 才会有
  context: Object | null,
  pendingContext: Object | null,
  // 是否要合并
  +hydrate: boolean,
  // 记录整个应用优先级最高的 ExpirationTime
  nextExpirationTimeToWorkOn: ExpirationTime,
  expirationTime: ExpirationTime,
  firstBatch: Batch | null,             // 没有找到？
  nextScheduledRoot: FiberRoot | null,  // 单向链表的属性
  interactionThreadID: number,
  memoizedInteractions: Set<Interaction>,
  pendingInteractionMap: PendingInteractionMap,
};
```

## Fiber

ReactElement => Fiber

```js
type Fiber = {
  // 标记 Fiber 类型
  tag: WorkTag,
  // key
  key: null | string,
  // React.Element 的 type，lazy 组件 resolve 之后是一个 func 还是 class 组件
  type: any,
  // 对应的实例，class component 对应的就是 class 的实例，dom 对应的就是 dom 实例。func component 就没有这个属性
  stateNode: any,
  // 链表结构
  return: Fiber | null,
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,
  ref: null | (((handle: mixed) => void) & {_stringRef: ?string}) | RefObject,
  pendingProps: any,   // 新的 props
  memoizedProps: any,  // 老的 props
  updateQueue: UpdateQueue<any> | null,  // 这个节点的更新队列
  memoizedState: any,  // 老的 state
  contextDependencies: ContextDependencyList | null, // context 相关
  mode: TypeOfMode,    // StrictMode、ConcurrentMode
  // 副作用
  effectTag: SideEffectTag,
  nextEffect: Fiber | null,
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,
  // 节点任务的过期时间
  expirationTime: ExpirationTime,
  // 子节点的过期时间
  childExpirationTime: ExpirationTime,
  alternate: Fiber | null,
  // 渲染时间相关,跟 devtool 有关
  actualDuration?: number,
  actualStartTime?: number,
  selfBaseDuration?: number,
  treeBaseDuration?: number,
  // __DEV__ 环境
  _debugID?: number,
  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
};
```

### WorkTag

```js
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
```

## Update && UpdateQueue

```js
export type Update<State> = {
  // 过期时间
  expirationTime: ExpirationTime,
  // 对应的四种情况，更新、替代、强制更新、捕获 Update 错误（组件内部捕获错误状态）
  tag: 0 | 1 | 2 | 3,
  // 操作内容
  payload: any,
  // 回调
  callback: (() => mixed) | null,
  // 下一个 Update
  next: Update<State> | null,
  // sideEffect
  nextEffect: Update<State> | null,
};

export type UpdateQueue<State> = {
  // 基础的 State
  baseState: State,
  // 记录单向链表的数据结构
  firstUpdate: Update<State> | null,
  lastUpdate: Update<State> | null,
  // 对应 capture
  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,

  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,

  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null,
};

```
