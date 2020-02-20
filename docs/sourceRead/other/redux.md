# Redux 源码解析之 CreateStore

> Redux 是 React 项目的黄金搭档，但是在使用 Redux 之余，对其实现原理很是好奇，遂前往。

[[toc]]

## 简版代码

这是创建一个 `Redux Store` 来放所有的 `state` 的函数，这个函数中使用了闭包，我们只能通过函数去访问 state，而不能直接访问。

我们现在来看，我们如何通过这个函数创建出一个 store 对象，并且可以 dispatch，所以我们将一些异常处理，边界处理等东西都去掉，保留一小部分。

```js
export default function createStore(reducer, preloadedState, enhancer) {
  // 这里有一个 enhancer 的调用，下面再说，这里不关心。

  // 变量定义
  var currentReducer = reducer        // 把 reducer 赋值给 currentReducer
  var currentState = preloadedState   // 把 preloadedState 赋值给 currentState
  var currentListeners = []           // 初始化 listeners 数组
  var nextListeners = currentListeners// nextListeners 和 currentListeners 指向同一个引用
  var isDispatching = false           // 标记正在进行dispatch

  /**
   * 保存一份订阅快照
   * @return {void}
   */
  function ensureCanMutateNextListeners() {
    //判断 nextListeners 和 currentListeners 是同一个引用
    if (nextListeners === currentListeners) {
      
      //通过数组的 slice 方法,复制出一个 listeners，赋值给 nextListeners
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * 获取 store 里的当前 state tree
   *
   * @returns {any} 返回应用中当前的state tree
   */
  function getState() {

    //当前的state tree
    return currentState
  }

  function subscribe(listener) {
    // 标记有订阅的 listener
    var isSubscribed = true

    // 保存一份快照
    ensureCanMutateNextListeners()

    // 添加一个订阅函数
    nextListeners.push(listener)
    
    // 返回一个取消订阅的函数
    return function unsubscribe() {
      //标记现在没有一个订阅的 listener
      isSubscribed = false
      
      // 保存一下订阅快照
      ensureCanMutateNextListeners()
      // 找到当前的 listener
      var index = nextListeners.indexOf(listener)
      // 移除当前的 listener
      nextListeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    try {
      // 标记 dispatch 正在运行
      isDispatching = true
      // 执行当前 Reducer 函数返回新的 state
      currentState = currentReducer(currentState, action)
    } finally {
      // 标记 dispatch 没有在运行 
      isDispatching = false
    }

    // 遍历所有监听函数并执行
    var listeners = currentListeners = nextListeners
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }

    // 返回传入的 action 对象
    return action
  }

  // 配合组件按需加载，reducer 也可以按需加载
  function replaceReducer(nextReducer) {
    //当前传入的 nextReducer 赋值给 currentReducer
    currentReducer = nextReducer

    //调用 dispatch 函数，传入默认的 action
    dispatch({ type: ActionTypes.INIT })
  }
  // reducer 返回其初始状态 
  // 初始化 store 里的 state tree
  dispatch({ type: ActionTypes.INIT })

  // 返回 store 暴漏出的接口
  return {
    dispatch, // 唯一一个可以改变 state 的哈按时
    subscribe, // 订阅一个状态改变后，要触发的监听函数 
    getState,  // 获取 store 里的 state
    replaceReducer, // Redux热加载的时候可以替换 Reducer
  }
}
```

这就是一个删减版的 redux 了，我们试用一下它。

## 测试流程

```js
// 定义一个 reducer
const reducer = (state = 1, action) => {
  switch(action.type) {
    case 'add':
      return state++;
    default:
      return state;
  }
};
// 定义一个 action
const addOne = () => ({
  type: 'add',
});

// 调用函数，返回一个对象，其中有一些方法，同时代码后面调用了 dispatch({ type: ActionTypes.INIT })，所以
// reducer 执行了 default 选项，返回了 state 的默认值 1.
const store = createStore(reducer);

// 这一次调用 dispatch 执行了 add 选项，state 更新为 2
store.dispatch(addOne());
```
