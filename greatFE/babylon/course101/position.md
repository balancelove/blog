# 位置和旋转

## 坐标系

Babylon 使用两个参照坐标系，一个是全局坐标系，原点不会发生改变。

在所有的 Playground 和示意图中红色为 X 轴，绿色为 Y 轴，蓝色为 Z 轴。当一个网格模型被创建的时候，总是相对于全局坐标系放置。而局部坐标系跟随网格模型移动，且原点位于网格模型的中间，网格模型的旋转、缩小放大中心都是局部坐标系的原点。

所有的位置、旋转、缩放都是以三维向量的形式给出。

```js
BABYLON.Vector3(x, y, z);
```

## 位置

当使用 position 改变形状的位置的时候，局部坐标系就跟着移动了。

```js
polit.position = new BABYLON.Vector3(x, y, z);
// 相当于
polit.position.x = x;
polit.position.y = y;
polit.position.z = z;
```

## 旋转

```js
polit.rotation = new BABYLON.Vector3(x, y, z);
// 相当于
polit.rotation.x = x; // 围绕 x 轴旋转
polit.rotation.y = y; // 围绕 y 轴旋转
polit.rotation.z = z; // 围绕 z 轴旋转
```

这些值都是角度值。