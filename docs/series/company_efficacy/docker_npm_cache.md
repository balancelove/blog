# 如何有效减少 Node、Web 应用的构建时间？

Docker 能够让我们快速的进行应用的部署，同时，我们能够很好的和持续集成的工具进行集成，如 Drone、Jenkins 等等，但是在使用过程中，我们慢慢发现了我们需要很长的时间去进行构建 Docker 镜像，通常来说我们需要 6-10 分钟左右的时间完成镜像的构建。

在查看了整个 CI 流程之后，我们发现大部分的时间都花在装包上，并且由于网络的波动，很可能就会造成半个小时、一个小时甚至更久都构建不完，同时还有可能会造成构建失败。

通过简单的 Dockerfile 的修改，我们就能够大幅度减少构建的时间。因为我们项目的 `package.json` 在项目基本稳定之后，是几乎没有什么变化的。

所以优化的关键在于，每次安装包只在项目依赖变更时进行，而项目依赖没有变化时不用进行安装，也就是跳过了安装的过程，自然构建速度就上去了。

资源：

- https://www.aptible.com/documentation/deploy/tutorials/faq/dockerfile-caching/npm-dockerfile-caching.html
- https://gist.github.com/armand1m/b8061bcc9e8e9a5c1303854290c7d61e
