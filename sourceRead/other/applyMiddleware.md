# Redux 源码解析之 applyMiddleware

[[toc]]

## 源码简读

代码量非常少，但是这就是中间件的核心，但看着一个文件不太容易懂，我们结合 `redux-thunk` 一起看就容易懂一些。

```js
// compose
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }
  // 这句话可能大家看的有点小懵，说个例子
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// createStore
if (typeof enhancer !== 'undefined') {
  if (typeof enhancer !== 'function') {
    throw new Error('Expected the enhancer to be a function.')
  }

  return enhancer(createStore)(reducer, preloadedState)
}
// applyMiddleware
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    }
  }
}
// redux-thunk
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
```

## 测试流程

我们在下面将以一个例子的方式来讲述这个流程。

```js
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}
```

假设我们现在有 logger 和 thunk 这两个中间件，我们去执行 applyMiddleware。

```js
// 我们现在可以看一看 chain 里面是什么
chain = [
  function l1(next) {
    return function l2(action) {
      console.group(action.type)
      console.info('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result;
    }
  },
  function t1(next) {
    return function t2(action) {
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    }
  },
];
// 现在我们再看 compose 的结果，也就是这一段的结果
return funcs.reduce((a, b) => (...args) => a(b(...args)));
// 返回的结果是，其实这个地方就是将这一堆中间件函数串起来
function (...args) {
  return l1(t1(...args));
}
// 这个结果再将 store.dispatch 传进去了
// 返回的函数是这样的，先执行 t1，返回
function t2(action) {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument);
  }
  return next(action);
}
// 将这个函数作为下一个函数的 next，最后返回的是
function l2(action) {
  console.group(action.type)
  console.info('dispatching', action)
  // 这里的 next 函数，其实是 t2 函数
  let result = next(action)
  console.log('next state', store.getState())
  return result;
}
```

从这里我们可以看到，通过串联这些中间件实现了中间件的机制了。
