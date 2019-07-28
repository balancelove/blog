# NAT 穿越

> NAT 穿越是为了解决 IP 端到端应用在 NAT 环境下遇到的问题。

相关资源：https://www.cnblogs.com/mlgjb/p/8243690.html

## STUN

STUN 就是为了进行 NAT 穿越，并且是 C/S 模式应用。

### 规范

STUN 有两种规范，分别是 `RFC3489/STUN(Simple Traversal of UDP Through NAT)（简单的通过 UDP 进行 NAT 穿越的规范）` 和 `RFC5389/STUN(Session Traversal Utilities of NAT)（在 3489 基础上新增了功能，一些列穿越 NAT 的工具，包括 TCP）`。

## TURN

TURN 的目的是为了解决对称 NAT 无法穿越的问题，建立在 STUN 协议之上，消息格式使用 STUN 格式，TURN Client 要求服务端分配一个公网 IP 和端口接收或者发送数据。

## ICE 框架

ICE 不是一种协议，而是一个框架，它整合了 STUN 和 TURN 协议
