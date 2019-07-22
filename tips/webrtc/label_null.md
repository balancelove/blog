# 为什么设备 label 是空值？

当我们使用 `navigator.mediaDevices.enumerateDevices()` 返回的设备信息的时候，我们发现设备的 `label` 属性是空值，为什么呢？

查阅了一些资料后发现，当我们使用 `https` 的时候再去获取设备信息的时候就能够获取到 `label` 属性的值。

如果要获取到设备的这些信息的话，就一定要使用 `https` 来获取信息，在我们平常开发的时候可以使用 `http-server` 来开启一个 `https` 服务来调试。
