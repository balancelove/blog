# 检查音视频设备

> 检查音视频设备的 API 为：`navigator.mediaDevices.enumerateDevices`。

## 两个 Interface

- MediaDevices: 它提供了我们访问媒体设备的方法，也就是我们说的 `navigator.mediaDevices`。
- MediaDeviceInfo: 它提供了输入输出设备的信息，包括设备的唯一 ID (deviceID)、设备的名称 (label)、设备的种类 (kind)、设备组 ID (groupID)。

所以我们可以通过这个 API 获取到媒体输入输出设备了。
