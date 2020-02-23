# 【Git】git 多账号管理

> 在工作的时候，使用的是公司配置的电脑，git 配置的是公司的 gitlab 账号，但是空闲的时候想自己在 github 上写点东西，这时候就需要用到多个 git 账号的配置了。

## 配置步骤

1. 首先，你需要创建两个 `ssh key`。

   ```bash
   # 公司的 key
   $ ssh-keygen -t rsa -C "xxxxxx@company.com"
   # 自己用的 key，名字就叫做 id_rsa_personal
   $ ssh-keygen -T rsa -C "xxxxxx@qq.com"
   ```

2. 接下来，我们要把我刚刚创建的新的密钥添加到 `ssh-agent`。

   ```bash
   $ ssh-add ~/.ssh/id_rsa_personal
   ```

3. 这时候，我们需要在 `~/.ssh` 目录下创建一个 config 文件，如果有就不用创建直接编辑了，这样以后我们 clone 的时候可以直接用 Host 去替换 HostName 了。

   ```bash
   # github
   Host github
   HostName github.com
   PreferredAuthentications publickey
   IdentityFile ~/.ssh/id_rsa_personal

   # company
   Host gitlab
   HostName xxx.gitlab.com
   PreferredAuthentications publickey
   IdentityFile ~/.ssh/id_rsa
   ```

4. 好了，现在我们就去我们自己的仓库去设置 name 和 email 了，全局的我们不管，还是公司的。

好了，现在我们就可以尽情的享受我们的空闲时间了。
