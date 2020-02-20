# React Mixin 到 Hooks

[[toc]]

> 在 React 开发中，我们为了能够复用状态逻辑，通常会使用 Mixin、HOC、Hooks 等方式来进行，今天我们就来聊一聊这三种方式。

## Mixin

比如我们常见的 Lodash 中的 `extend` 函数，就是 Mixin 模式，又比如说，我们通过 extend 的方式扩展 Koa 上的 Context 等对象，也是一种 Mixin。

我们可以使用这种方式将对象上的方法扩展到目标对象上。

相对应的，我们也能够在 React 代码中使用 Mixin 的方式来扩展组件。

```jsx
const loginMixin = {
  login: function() {
    console.log('login');
  }
};

const User = React.createClass({
  mixins: [loginMixin],
  render: function() {
    return <div>login</div>;
  }
});
```

但 React 在官方文档中也提到了 Mixin 的危害：

1. Mixin 可能会相互依赖，相互耦合，不利于代码维护
2. 不同的 Mixin 中的方法可能会相互冲突
3. Mixin 非常多时，组件是可以感知到的，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性

相比与 Mixin 来说，更推荐 HOC 的方式来解决代码复用的问题。

## 高阶组件 - HOC

HOC 不是一种 React 提供的 api，而是一种模式。

```jsx
function isShow(WrappedComponent) {
  return class extends React.Component {
    render() {
      const { isShow } = this.props;
      return isSHow && <WrappedComponent {...this.props} />;
    }
  };
}
```

那么我们有哪些实现 HOC 的方式呢？

### 属性代理

```jsx
function proxyProperty(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

那么上面的 HOC 方式能够增强原组件的什么东西呢？

1. 可以操作所有传入的 props
2. 可以操作组件的生命周期
3. 可操作组件的 static 方法
4. 获取 refs

### 反向继承

反向继承就是继承原组件，然后调用原组件的 render 函数，因为继承了原组件，所以能够通过 this 获取到原组件的 props、state、生命周期等。

```jsx
function proxyProperty(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  };
}
```

反向继承除了上面说的那 4 点，还有两点增强。

1. 可以操作所有传入的 props
2. 可以操作组件的生命周期
3. 可操作组件的 static 方法
4. 获取 refs
5. 可以操作 state
6. 渲染劫持

## HOC 可以干什么？

### 样式、布局复用

```jsx
// 属性代理方式
function reuseLayout(WrappedComponent) {
  return class extends React.Component {
    render() {
      const { title, ...rest } = this.props;

      return (
        <div>
          <h1>{title}</h1>
          <WrappedComponent {...rest} />
        </div>
      );
    }
  };
}

// 反向继承
function reuseLayout(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const { title } = this.props;

      return (
        <div>
          <h1>{title}</h1>
          {super.render()}
        </div>
      );
    }
  };
}
```

### 条件渲染

根据条件来决定是否渲染。

```jsx
// 属性代理
function isShow(WrappedComponent) {
  return class extends React.Component {
    render() {
      const { isShow } = this.props;
      return isSHow && <WrappedComponent {...this.props} />;
    }
  };
}

// 反向继承
function isShow(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const { isShow } = this.props;
      return isSHow && super.render();
    }
  };
}
```

### 操作 props
