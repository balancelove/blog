# React 的整体流程 - render/reconciliation

> 在上一部分中，我们提到 React 创建了更新，计算了更新的优先级，接下来我们就进入任务调度的阶段。

## Fiber 与 Fiber tree

说到这个阶段，那么不得不提的就是 `Fiber` 了，这是 React 团队对 React 核心算法的的重构，目的就是进一步的提升交互体验。

在这之前 React 的 reconciler 叫做 `Stack reconciler`，也就是自顶向下的更新过程，无法中断，一口气干完所有事，影响布局、动画等任务的执行，那么 Fiber 就将其拆分成一个一个的小任务，每次做一部分，看是否还剩余时间，如果有就继续，没有就挂起，等待主线程空闲时继续。

那么说了这么多，它的结构是什么呢？我们以这个为例。

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

树结构见下图，其实在 `input` 节点旁应该还有个文本节点，忘画了，大家先这么看着。

![Fiber Tree](/react/fiber-tree.png)

从上图来说，fiber 节点使用下面几个属性来连接整棵树。

1. return: 当前节点的父节点
2. child: 当前节点的第一个子节点
3. sibling: 当前节点的兄弟节点

## 主要流程

### Step 1: 找到当前更新的 Root

在创建完更新进入调度之后，先找到当前更新的这颗 fiber 树的 `FiberRoot` 对象，并且更新对应更新链路上的 `childExpirationTime`。

这个更新 `childExpirationTime` 的操作就是保证了父节点的这个属性存放的是子节点中优先级最高的那个任务的过期时间。

### Step 2: 同步、异步任务

在找到 `FiberRoot` 后，会根据当前更新的 `expirationTime` 来决定调用的函数。

```js
if (expirationTime === Sync) {
  performSyncWork();
} else {
  // 会在线程的空余时间来执行 performWork，这个流程这一节不说，大家只需要知道，React 会在线程空闲的时候调用 performWork 函数来进行运算
  scheduleCallbackWithExpirationTime(root, expirationTime);
}
```

这两个函数最后都会调用 `performWork`，只是同步的任务不可中断，异步的任务可以被中断。

### Step 3: 执行更新

在这里面最关键的流程就是 `performUnitOfWork` 了，这个函数会去遍历所有的 fiber 节点，对节点进行更新。

在这个过程中，React 会从 `RootFiber` 开始向下构造 `workInProgress tree`，也就是构建中的新的 `fiber tree`，这棵树可以用来做断点恢复。

那么对于上面那个例子来说，更新的顺序是什么呢？

在更新过程中，React 会更新当前节点，如果当前节点有子节点，那么 `performUnitOfWork` 就会继续去更新子节点，如此循环，当更新到的节点没有子节点的时候，就会调用 `completeUnitOfWork` 函数，执行了一些函数后，会往上找有兄弟节点的节点，然后返回兄弟节点继续执行 `performUnitOfWork`。

拿我们上面的例子来说，就是从 `RootFiber` 一路往下更新到 `h1` 之后发现没有子节点了，然后发现 `h1` 有兄弟节点于是就更新 `ul` 节点，然后更新第一个 `User` 节点，完成后，继续更新第二个，都更新完成之后就继续找，最后找到了 `RootFiber` 也就说明更新完成了。

在这个阶段更新的过程中，会根据更新情况收集 `side effect`，也就是更新的结果，并且会向上归并，也就是说，到最后 `RootFiber` 上会存放着这次更新所有的情况。

完成了这里对 fiber 节点的更新之后就要进入第三阶段了，也就是 `commit` 阶段。

至于这个阶段更详细的更新过程，就等我梳理完成之后再继续啦。
