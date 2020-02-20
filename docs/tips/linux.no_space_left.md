# 【Linux】No space left on device

## 问题背景

在我安装 node_modules 的时候，系统告诉我，你的空间不足了，我惊了，马上去看了一下我的磁盘还剩多少，一看还剩了一半多，我去这系统乱报错么？然后我在 google 上找了一会儿，发现了问题。

真实的情况是 Inodes 不足了，我之前删除 node_modules 是通过图形界面来删除的，这个删除并不是真正的删除，所以 inodes 越来越多，最后导致空间不足。

所以如果你真的确定要删除就直接 rm 删除。

## 解决方案

我找到了一个[博客](https://www.ivankuznetsov.com/2010/02/no-space-left-on-device-running-out-of-inodes.html/comment-page-2#comment-992817)，这个博客里面给出了具体的解决方案。

## Why?

因为我之前删除 node_modules 是通过图形界面来删除的，这个删除并不是真正的删除，所以 inodes 越来越多，最后导致空间不足。
