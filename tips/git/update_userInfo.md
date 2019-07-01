# 如何批量修改 commit 信息

> 最近在维护一个仓库的时候，发现自己以前的提交记录都没有在 contrubution 里显示，然后发现是提交 commit 的时候信息不是 github 上的信息，由此想去修改信息，但是用 rebase 的办法太慢了，于是在网上搜索了如何去批量修改。

## 怎么做

首先，打开命令行，clone 你的仓库，命令如下：

```bash
git clone --bare <仓库名>
cd repo.git
```

然后，我们进入到目录下，创建一个文件，只要不重复就行，比如说 `run`，文件内容如下：

```shell
#!/bin/sh

git filter-branch --env-filter '
# 老信息
OLD_EMAIL="your-old-email@example.com"
# 新信息
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="your-correct-email@example.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

然后，我们保存，执行这个文件：

```bash
./run
```

然后再把仓库强制推上去：

```bash
git push --force --tags origin 'refs/heads/*'
```

这样你的信息就修改好了，把这个仓库删掉就行了。