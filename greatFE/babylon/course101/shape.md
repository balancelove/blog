# 认识基本形状

## BABYLON.MeshBuilder.CreateShape

这是创建形状的方法，可以用来创建一些叫得上名字的形状，都是 BABYLON 内置的。比如说立方体、球体、圆柱体、圆锥、正多边形、平面、地面、圆环、圆环结、多面体等等。

```js
const shape = BABYLON.MeshBuilder.CreateShape(name, options, scene);
```
下面都是创建形状的方法，至于参数，大家可以到网上看，还是比较简单的。

一起来看看这些形状：

- Box

  ```js
  // 默认立方体
  const box = BABYLON.MeshBuilder.CreateBox('mybox', {}, scene);
  ```

  在 option 参数中有两点要说的就是关于 faceColors 和 faceUV，一个使用的是 rgba，一个使用的是另一种表达方式，具体的可以到[这里](../how_to/faceuv_facecolors.md)去查看。

- Sphere

  ```js
  // 默认球体
  const sphere = BABYLON.MeshBuilder.CreateSphere('mysphere', {}, scene);
  ```

- Plane

  ```js
  // 默认平面
  const plane = BABYLON.MeshBuilder.CreatePlane('myplane', {}, scene);
  ```

- Ground

  ```js
  // 默认地面
  const ground = BABYLON.MeshBuilder.CreateGround('myground', {}, scene);
  ```
