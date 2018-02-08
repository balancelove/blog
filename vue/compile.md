# 咱来聊聊 Vue — 编译原理

> 在 Vue 里，模板编译也是非常重要的一部分，里面也非常复杂，这次探究不会深入探究每一个细节，而是走一个全景概要，来吧，大家和我一起去一探究竟。

## 初体验

我们看了 Vue 的初始化函数就会知道，在最后一步，它进行了 vm.$mount(el) 的操作，而这个 $mount 在两个地方定义过，分别是在 __entry-runtime-with-compiler.js(简称：eMount)__ 和 __runtime/index.js(简称：rMount)__ 这两个文件里，那么这两个有什么区别呢？

```js
// entry-runtime-with-compiler.js
const mount = Vue.prototype.$mount // 这个 $mount 其实就是 rMount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  const options = this.$options
  if (!options.render) {
    ...
    if(template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
    ...
  }
  return mount.call(this, el, hydrating)
}
```

其实 eMount 最后还是去调用的 rMount，只不过在 eMount 做了一定的操作，如果你提供了 render 函数，那么它会直接去调用 rMount，如果没有，它就会去找你有没有提供 template，如果你没有提供 template，它就会用 el 去查询 dom 生成 template，最后通过编译返回了一个 render 函数，再去调用 eMount。

那么编译最重要的部分就是 compileToFunctions 这个函数，他最后返回了 render 函数，关于这个函数，它有点复杂，我画了一张图来看一看它的关系。

## 编译三步走

看一下这个编译的整体过程，我们其实可以发现，最核心的部分就是在这里传进去的 baseCompile 做的工作：

- parse: 第一步，我们需要将 template 转换成抽象语法树(AST)。
- optimizer: 第二步，我们对这个抽象语法树进行静态节点的标记，这样就可以优化渲染过程。
- generateCode: 第三步，根据 AST 生成一个 render 函数。

好了我们接下来就一个一个慢慢看。

### 解析器

在解析器中有一个非常重要的概念 AST，大家可以去自行了解一下。

在 Vue 中，ASTNode 分几种不同类型，关于 ASTNode 的定义在 __flow/compile.js__ 里面，请看下图：



### 优化器

### 代码生成器
