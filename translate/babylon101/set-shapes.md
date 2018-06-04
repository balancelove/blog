# 认识基本形状

## 内容

1. [设置形状 101](#设置形状-101)
   1. [MeshBuilder 方法](#meshbuilder-方法)
      1. [盒子](#盒子)
      2. [球体](#球体)
      3. [平面](#平面)
      4. [地基](#地基)
   2. 
2. [下一节](#下一节)
3. [延展阅读](#延展阅读)

## 设置形状 101

这些日常使用频率很高的形状都有自己的名字。比如立方体(box/cuboid)、球体(sphere)、圆柱体(cylinder)、圆锥体(cone)、正多边形(regular polygons)、平面(plane)和特殊的水平面地面(ground)。还有比如说圆环(torus)、圆环结(torus knot)和多面体(polyhedra)。你将会在下一节学习到如何通过数据集和参数去创建无法通过名字直接创建的形状。这些形状被叫做参数形状。

在 101 课程中，你只会看到其中一些形状，在这一节中会有立方体、球体、平面和地面。此外，你将会使用新的 MeshBuilder 方法来创建形状，而不是使用原来的 Mesh 方法。你可以通过延展阅读了解到如何通过这两种方法创建形状以及这两者之间的优缺点。

### MeshBuilder 方法

一般创建形状的方式为：

```js
var shape = BABYLON.MeshBuilder.CreateShape(name, options, scene);
```

通过 options 参数，你可以设置形状的大小以及你是否能够更新它。下面将是一些具体的例子。

#### Box

```js
var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene); // 默认立方体

var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 5, width: 2, depth: 0.5}, scene);
```

|选项(option)|值(value)|默认值(default value)|
|:---:|:---:|:---:|
|size|(number)立方体的每条边|1|
|height|(number)高度（y轴），覆盖 size 属性|size|
|width|(number)宽度（x轴），覆盖 size 属性|size|
|depth|(number)深度（z轴），覆盖 size 属性|size|
|faceColors|(Color4[])数组里有 6 个 Color4，每一个都对应着一个面|每个面都是 Color(1, 1, 1, 1)|
|faceUV|(Vector4[])数组里有6个 Vector4，每一个都对应着一个面|每个面都是 UVs(0, 0, 1, 1)|
|updatable|(boolean)形状是否更新，true 则为更新|false|
|sideOrientation|(number)排列方向|DEFAULTSIDE|

- [查看示例](https://www.babylonjs-playground.com/#3QW4J1#1)

#### 球体

```js
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene); // 默认的球体

var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 2, diameterX: 3}, scene);
```

|选项(option)|值(value)|默认值(default value)|
|:---:|:---:|:---:|
|segment|(number)水平分段的数量|32|
|diameter|(number)球体的直径|1|
|diameterX|(number)X 轴直径，覆盖 diameter 属性|diameter|
|diameterY|(number)Y 轴直径，覆盖 diameter 属性|diameter|
|diameterZ|(number)Z 轴直径，覆盖 diameter 属性|diameter|
|arc|(number)周长（纬度），0 - 1 之间|1|
|slice|(number)高度（经度），0 - 1 之间|1|
|updatable|(boolean)形状是否更新，true 则为更新|false|
|sideOrientation|(number)排列方向|DEFAULTSIDE|

- [查看示例](https://www.babylonjs-playground.com/#K6M44R)

#### 平面

```js
var plane = BABYLON.MeshBuilder.CreatePlane('plane', {}, scene); // 默认平面

var myPlane = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 5, height: 2 }, scene);
```

|选项(option)|值(value)|默认值(default value)|
|:---:|:---:|:---:|
|size|(number)平面的变长|1|
|width|(number)宽度|size|
|height|(number)高度|size|
|updatable|(boolean)形状是否更新，true 则为更新|false|
|sideOrientation|(number)排列方向|DEFAULTSIDE|
|frontUVs|||
||||
||||
