# 你会 babel 插件么？我也不会

在一个月黑风高的晚上，小黄问我 `babel` 你知道么？

我: 我靠，`babel` 我肯定知道啊，你这是在侮辱谁？

小黄: 那你知道 `babel` 是怎么工作的么？

我: 当然了，第一步是进行词法、语法解析，解析成 AST，第二步就是接收到 AST 之后，对节点进行添加、更新、删除等操作，这也是插件要介入的地方，第三步就是把转换后的 AST 转换成字符串的代码。

小黄: 厉害啊，那你写过插件么？

我: 没有，没写过。

小黄: 你居然没写过？

我: 我靠，你什么眼神？等着，我晚上给你撸一个，对了，你有资料吗？

小黄: 有，拿着 [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

## 要干个啥？

说了要写一个插件，总不能写个 1 + 1 等于 2 吧。正好在看 `antd` 的内容，那就搞个简单的按需加载的插件吧。

```js
// 我们这么写
import { Button, Table } from 'antd';

// 其实相当于
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
```

所以，目标确定了，我们还等啥呢？

## 撸起袖子开干

在大概的了解了上面的资料之后，我们就开干了。

通过阅读资料，我们知道 Babel 插件需要我们暴露一个方法，这个方法返回一个含有 `visitor` 的对象。

```js
module.exports = ({ types: t }) => {
  visitor: {
  }
};
```

那么我们要怎么去分析代码呢？很简单，我们去把代码贴到 [AST explorer](https://astexplorer.net/) 里面，然后把转换的结构就可以拿出来分析了。

![](/babel_plugin/ast.jpg)

通过上面的分析，我们可以知道 `import { Button, Table } from 'antd';` 是一个 `ImportDeclaration` 节点。

```js
module.exports = ({ types: t }) => ({
  visitor: {
    ImportDeclaration(path) {
      // 我们可以通过 specifiers 拿到导入的东西，source 来拿到从哪个库导入的
      const { specifiers, source } = path.node;
      // 排除 default 的导入情况
      if (!t.isImportDefaultSpecifier(specifiers[0])) {
      }
    }
  }
});
```

上面使用的 `babel.types` 大家可以到[这里](https://www.babeljs.cn/docs/babel-types)去看。

上面我们已经拿到了导入的语句，现在我们去拿到导入了什么东西，以及从什么库导入的。

```js
module.exports = ({ types: t }) => ({
  visitor: {
    // 我们可以通过第二个参数里的 opts 来拿到参数配置
    ImportDeclaration(path, { opts }) {
      // 我们可以通过 specifiers 拿到导入的东西，source 来拿到从哪个库导入的
      const { specifiers, source } = path.node;
      // 排除 default 的导入情况
      if (!t.isImportDefaultSpecifier(specifiers[0])) {
        const declarations = specifiers.map(specifier => {
          // 我们可以通过 specifier.imported.name 获取到导入的东西
          // 先写死 antd
          const importPath = `${source.value}/lib/${specifier.imported.name}`;
          // 我们通过上面的信息返回了一条 import 语句
          return t.ImportDeclaration(
            [t.ImportDefaultSpecifier(specifier.local)],
            t.StringLiteral(importPath)
          );
        });
        // 将上面生成的 import 语句替换到原来的语句
        path.replaceWithMultiple(declarations);
      }
    }
  }
});
```

那么编写一个 babel 插件的大概流程就是这样，当然了，这个简单的插件肯定还有很多配置、边界等等没有考虑到，这个简单的 demo 我上传到了我的仓库。

地址：https://github.com/balancelove/babel-plugin-demo
