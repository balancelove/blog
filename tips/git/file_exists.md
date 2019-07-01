# File exists

## 问题背景

今天提交代码的时候想执行一下 `git checkout -- xx` 的操作，然后就报错了，报错信息如下：

```bash
fatal: Unable to create '/home/use/storage/project/.git/index.lock': File exists.

If no other git process is currently running, this probably means a
git process crashed in this repository earlier. Make sure no other git
process is running and remove the file manually to continue.
```

## 解决方案

解决的办法是根绝错误提示的文件，找到它，然后删掉它就能够正常工作了。

## Why?

这个文件是为了防止同时操作 git，git 操作冲突导致 git 被锁了，这是 git 的一种保护机制。
