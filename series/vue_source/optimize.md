# optimize

## markStatic

```js
function markStatic(node: ASTNode) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // 不能让插槽组件的内容静态化，可以避免：
    // 1. 组件不能改变 slot 节点
    // 2. 静态 slot 内容无法热加载
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return;
    }
    // 递归对 children 打标记
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      // 如果在子节点中有一个不是静态节点，就把当前节点设为 false
      if (!child.static) {
        node.static = false;
      }
    }
    // 递归对条件语句做处理
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}
```

## markStaticRoots

```js
function markStaticRoots(node: ASTNode, isInFor: boolean) {
  // 当前节点是元素节点
  if (node.type === 1) {
    // 当前节点为静态节点或者 v-once 节点
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 当前节点是静态节点，而且它有子节点，并且子节点不是只有一个文本节点
    // 如果一个静态节点只包含了一个文本节点，那么它不会被标记成静态根节点，它的成本会超过收益
    if (
      node.static &&
      node.children.length &&
      !(node.children.length === 1 && node.children[0].type === 3)
    ) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }
    // 如果当前节点有子节点，进行递归操作
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    // 对条件语句做处理
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor);
      }
    }
  }
}
```
