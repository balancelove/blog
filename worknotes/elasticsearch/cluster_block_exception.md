---
sidebarDepth: 0
---
# cluster_block_exception

[[toc]]

## 问题背景

在一次删除文档的过程中，突然 es 的 index 都是只读，不能进行其他操作了。

## 解决方案

这个问题由于是在单机上出现的问题，所以也没有往集群上去想，找到两种解决方案：

1. 磁盘扩容，可以在配置文件里修改 ES 数据存储目录，重启 ES 就行了
2. 放开索引只读设置：

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": false}'
```

## why

因为磁盘空间不足，导致接收同步数据失败，ES 集群为了保护数据就自动把 index 设置成了只读。