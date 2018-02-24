# Eslint 入门学习

## 安装

```ba
npm install eslint --save-dev
```

通过上面的命令就可以安装 eslint 了。

## 配置

首先，我们需要创建 eslint 的规则，我们可以通过几种文件来进行创建：

- .eslintrc
- package.json
- .eslintrc.yml 或者 .eslintrc.yaml
- .eslintrc.js
- .eslintrc.json

这些都可以创建 eslint 规则，当然了这些文件也有优先级，当有多个配置文件存在的时候，会根据优先级来读取配置，优先级如下：

`.eslintrc.js` > `.eslintrc.yaml` > `.eslintrc.yml` > `.eslintrc.json` > `.eslintrc` > `package.json`

关于 Eslint 的所有规则都可以去 [Eslint 官网](http://eslint.cn/) 查找。

其实对于 eslint 的配置，有非常多需要配置的，我们可以选择一些公认的比较好的一些标准来继承，然后根据自己的需要进行修改覆盖。

比如说 Vue 的项目可以去用 eslint-plugin-vue、以及 standard 等等。
