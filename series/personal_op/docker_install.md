# 在 Ubuntu 安装 Docker

## 前置条件

- Docker 要求 Ubuntu 系统为 64 位，使用 `uname -m` 命令，如果显示 **x86_64** 则为 64 位，显示 **i686** 则为 32 位。
- 更新包管理器
- 提前安装 `curl` 命令

## 安装 Docker

1. 使用官网的一键安装脚本进行安装

   ```bash
   $ curl -s https://get.docker.com/ | sudo sh
   ```

2. 使用阿里云一键安装脚本

   ```bash
   $ curl -sSL http://acs-public-mirror.oss-cn-hangzhou.aliyuncs.com/docker-engine/intranet | sh -
   ```

接下来我们就可以愉快的使用 docker 了。
