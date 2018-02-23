# Webpack 学习

## 目录

- [配置](#配置)
- [loaders](#loaders)
- [插件](#插件)
- [devtool](#devtool)

> 中文文档： https://doc.webpack-china.org/

### 配置

1. 创建配置文件：`webpack.config.js`
2. 文件配置：`entry`、`module`、`plugins`、`output` ；进阶配置：`resolve`、`devServer`、`devtool`。

### 配置选项

1. entry: 入口文件，有两种书写方式，单页应用一个入口和多页应用拥有多个入口。
2. output: 输出文件，它表示的是当 webpack 编译打包完成之后怎么去输出的一个字段，里面比较常用的两个字段是 filename 和 path，这两个字段代表了输出文件的名字和路径。
3. module: 这里面就是对不同的模块进行处理的地方了，我们知道 webpack 把所有的资源都当成模块来处理，所以对应不同类型的模块，加载的方式也会不同，而这些都是通过一个个不同的 loader 来实现的，比如 css 通过 css-loader 来进行打包。
4. plugins: 通过插件这个选项我们能让 webpack 变得丰富多彩，不同的插件会造成不同的打包构建过程。
5. devtool: 这里面其实就是一个 sourcemap，因为当我们打包完成之后，webpack 会生成一个或者几个文件，我们如果要去追踪错误在源码中的位置，会十分困难，这给我们调试带来很大的不方便，于是就有了这个。
6. devServer: 这是 webpack 给我们提供的一个简单的 web 服务器，并且能够实时的重新加载。
7. resolve: 在这里面我们能够配置，在打包编译过程中如何去解析模块，比如常用的别名 alias 等等。

## loaders

```js
module:{
    loaders: [{
        // 正则匹配
        test: '/\.html$/',
        // 对应的 loader
        loader: 'html-loader'
    }]
}
```

我们可以看到对于 loader，我们使用正则匹配去匹配相应的文件，然后使用相应的 loader 去解析。

__特别注意__：对于多个 loader 串行的解析，是从右向左的解析顺序。

## 插件

在这个[地址](https://doc.webpack-china.org/plugins/)我们能够看到许许多多的插件，它能够给我们的 webpack 代理不一样的构建体验。

比如说：

- __html-webpack-plugin:__ 这个插件会动态生成一个 html 文件。
- __clean-webpack-plugin:__ 这个插件会打包生成文件之前删除你提供的路径的文件。
- __HotModuleReplacementPlugin:__ 模块热更新插件，它会实时的更新，可以加快开发的速度。
- __DefinePlugin:__ 它可以创建一个在编译时可以配置的全局常量，做开发与线上区分非常有用。
- 当然了，还有许多的插件，大家可以去尝试，自然就熟悉了。

## devtool

为了更容易地追踪错误和警告，JavaScript 提供了 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。

source map 有很多[不同的选项](https://doc.webpack-china.org/configuration/devtool)可用，请务必仔细阅读它们，以便可以根据需要进行配置。