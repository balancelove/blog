# React 高阶组件

[[toc]]

> 高阶组件说白点就是一个函数，这个函数接收一个组件作为参数，返回一个组件，高阶组件就是一个没有副作用的纯函数。在 React 中我们一般是通过组件来复用代码，但是如果有两个组件都有相似的行为的时候，我们就可以考虑说将这一部分提出来，用来产生我们所需要的组件。

## 应用

1. 高阶组件的主要功能是封装并抽离组件的通用逻辑

    ```jsx
    export default (WrapComponent) => class extends React.Component {
      render() {
        return <div>
          <h1>HOC</h1>
          <WrapComponent />
        </div>;
      }
    };
    ```
2. 向组件内传入参数

    ```jsx
    export default (title) => (WrapComponent) => class extends React.Component {
      render() {
        return <div>
          <h1>{title}</h1>
          <WrapComponent />
        </div>;
      }
    };
    ```
  3. 基于属性代理的方式

      ```jsx
      export default (title) => (WrapComponent) => class extends React.Component {
        render() {
          const newProps = {
            title: 'new_props',
          };
          return <div>
            <h1>{title}</h1>
            <WrapComponent {...this.props} {...newProps}/>
          </div>;
        }
      };
      ```
  4. 基于反向继承的方式

      ```jsx
      export default (WrapComponent) => class extends React.Component {
        render() {
          return super.render();
        }
      }
      ```

## 模拟 react-redux

```js
```

参考资料： 
- https://segmentfault.com/a/1190000010371752?utm_source=tag-newest
- https://www.jianshu.com/p/0aae7d4d9bc1
