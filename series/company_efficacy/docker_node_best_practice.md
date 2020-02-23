# Node 在 Docker 中的最佳实践

> 这是在 Docker 中进行 Node 应用构建部署的实践。

1. 使用 Docker 内置的健康检查，通过使用 `HEALTHCHECK` 指定一个路由，比如说 `/health` 来帮助 Docker 知道你的容器是否还在正常运行。
2. 在构建的镜像中指定 NODE_ENV = production。
3. 在构建镜像的时候，不用安装 `devDependencies` 的包。
4. 在容器中不使用 `root` 用户。
5. COPY `package.json` 到容器中，并且进行安装，这样可以节省大量的时间（镜像缓存）。
