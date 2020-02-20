# Redux 源码解析之 combineReducers

[[toc]]

## 源码简读

```js
/**
 * 将多个 reducer => { user: function() {}, product: function() {} }
 */
const combineReducers = (reducers) => {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  for(let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    finalReducers[key] = reducers[key];
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return (state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  }
};
```

源码比较简单，从上一节我们可以知道 redux 会根据传入的 reducer 来生成 state，那么如果我们要管理一个 state 树，也就是我们有多个 reducer，就需要使用到这个函数。

## 测试流程

```js
const reducer = combineReducers({
  user: userReducer,
  product: productReducer,
});

const store = createStore(reducer);
// 这个地方初始化的 state 是长这样的
state = {
  user: xxx,
  product: xxx,
};
```
