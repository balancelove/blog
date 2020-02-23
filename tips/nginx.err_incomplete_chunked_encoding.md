# 【Nginx】net::ERR_INCOMPLETE_CHUNKED_ENCODING

在一次部署的过程中，部署好之后，我去访问资源， Chrome 显示 `net::ERR_INCOMPLETE_CHUNKED_ENCODING` 然后，我去搜索了相关内容之后发现，这个问题可能是 nginx 的问题，在超过了 nginx 的缓存大小后，nginx 会创建一个临时文件，最开始我是以为没有权限导致创建失败，搞了半天发现没用。

最后，去在 nginx 打了日志，在日志中发现是没有存储空间了，无语，将一些东西移位之后就好了。

总结一下，发现问题先找到源头，尝试解决，不行的话就直接 debug、看日志，解决问题，不要像个无头苍蝇乱撞。
