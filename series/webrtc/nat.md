# NAT

## 概念

NAT (Network Address Translation)，中文的意思就是网络地址转换，这种技术普遍应用在有多台主机但只通过一个公网 IP 访问因特网的私有网络中。

## 类型

NAT 有四种不同类型，分别是 Full Cone、Address Restricted Cone、Port Restricted Cone 和 Symmetric，接下来我们一一介绍。

### Full Cone - 完全锥形

现在我们内网有一台主机，地址为 `iAddr:iPort`，通过 NAT 访问 `wAddr:wPort` 时，会在 NAT 形成一个映射，映射的地址为 `eAddr:ePort`，这时候因特网上所有的请求都可以通过 `eAddr:ePort` 访问到 `iAddr:iPort` 主机。

### Address Restricted Cone - 地址限制锥形

现在我们内网有一台主机，地址为 `iAddr:iPort`，通过 NAT 访问 `wAddr:wPort` 时，会在 NAT 形成一个映射，映射的地址为 `eAddr:ePort`，这时候只有 IP 地址为 `wAddr` 的主机才能够通过 `eAddr:ePort` 访问到 `iAddr:iPort` 主机。

### Port Restricted Cone - 端口限制锥形

端口限制形更为严格，现在我们内网有一台主机，地址为 `iAddr:iPort`，通过 NAT 访问 `wAddr:wPort` 时，会在 NAT 形成一个映射，映射的地址为 `eAddr:ePort`，这时候只有 `wAddr:wPort` 的请求才能够通过 `eAddr:ePort` 访问到 `iAddr:iPort` 主机。

### Symmetric - 对称形

这种 NAT 更为严格，它会将内部主机地址和外部主机地址完全相同的看作一个连接，也就是说对称形 NAT 是一对一的，上面的锥型都是一对多的。

对称形会在每一个新的连接都创建一个新的外网映射地址。
