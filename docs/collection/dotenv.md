# 【npm 库】环境变量加载

> 这个库可以解决我们环境变量的设置问题，我们可以将环境变量写在文件中进行读取。

[[toc]]

## dotenv

我们只需要在 `.env` 中书写我们的配置，然后再在启动的时候 `require('dotenv').config()`，这样我们就能够愉快的使用环境变量了。

```js
// .env
BUILD_FOR = xxx;
DB_HOST = localhost;
```

## 参考资料

dotenv: https://github.com/motdotla/dotenv
