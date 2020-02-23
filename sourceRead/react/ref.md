# React 的 ref 是怎么实现的？

## Ref 的创建

在 React 中，我们创建 ref 有几种模式：

1. string ref
2. function ref
3. createRef

```js
// string ref
this.refs.stringref;
<p ref='stringref'>p1</p>;

// function ref
this.funcref;
<p ref={el => (this.funcref = el)}>p2</p>;

// createRef
this.objRef = React.createRef();
<p ref={this.objRef}>p2</p>;
```

## React 源码中的 ref

### 更新处理 ref 的时候

```js
function coerceRef(returnFiber, current, element) {
  // 拿到 reactElement 上的 ref
  let mixedRef = element.ref;
  // 如果是 function 或者 object 就不需要处理
  if (
    mixedRef !== null &&
    // function 和 object 是不需要处理的，需要处理的就是 string ref
    typeof mixedRef !== 'function' &&
    typeof mixedRef !== 'object'
  ) {
    // class component 的 fiber 对象
    if (element._owner) {
      const owner = element._owner;
      let inst;
      if (owner) {
        const ownerFiber = owner;
        // 如果这个 ref 挂载的 fiber 的 tag 不是 classComponent 就不对，就会报错
        invariant(
          ownerFiber.tag === ClassComponent,
          'Function components cannot have refs.'
        );
        // 获取当前 ClassComponent fiber 的实例
        inst = ownerFiber.stateNode;
      }
      invariant(
        inst,
        'Missing owner for string ref %s. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
        mixedRef
      );
      const stringRef = '' + mixedRef;
      // Check if previous string ref matches new string ref
      // 生成一个 ref 的方法，_stringRef 是标识你写的那个 string，因为这里会帮你生成一个 ref function，在更新的时候判断是否需要更新
      if (
        current !== null &&
        current.ref !== null &&
        typeof current.ref === 'function' &&
        current.ref._stringRef === stringRef
      ) {
        // 如果没变就直接 return 就好了
        return current.ref;
      }
      // 否则的话就弄一个方法出来替换 string ref
      const ref = function(value) {
        let refs = inst.refs;
        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {};
        }
        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      };
      ref._stringRef = stringRef;
      return ref;
    } else {
      invariant(
        typeof mixedRef === 'string',
        'Expected ref to be a function, a string, an object returned by React.createRef(), or null.'
      );
      invariant(
        element._owner,
        'Element ref was specified as a string (%s) but no owner was set. This could happen for one of' +
          ' the following reasons:\n' +
          '1. You may be adding a ref to a function component\n' +
          "2. You may be adding a ref to a component that was not created inside a component's render method\n" +
          '3. You have multiple copies of React loaded\n' +
          'See https://fb.me/react-refs-must-have-owner for more information.',
        mixedRef
      );
    }
  }
  return mixedRef;
}
```

### commit 的时候

```js
// 在进行 dom 节点更新之前先清空 ref 里的东西
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      // 是方法就直接传入一个 null
      currentRef(null);
    } else {
      // 使用 createRef 返回的是一个对象 { curernt: null }，这里也就相当于清空了
      currentRef.current = null;
    }
  }
}

// 在更新了之后会赋值 ref
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }
    // 这里就赋值了
    if (typeof ref === 'function') {
      ref(instanceToUse);
    } else {
      ref.current = instanceToUse;
    }
  }
}
```

通过上面的源码梳理，我们也就知道为什么官方推荐我们使用后两种，而不去使用 `string ref`，因为我们需要对其进行一次转换，有点麻烦。

好了，关于 ref 的就说这么多了 see you!
