# 第一步

## 内容

1. [第一步](#第一步)
   1. [Playground](#Playground)
   2. [你自己的 HTML](#你自己的-HTML)
      1. [HTML 模版](#HTML-模版)
   3. [贴士](#贴士)
2. [下一步](#下一步)
3. [延展阅读](#延展阅读)
4. [相关链接](#相关链接)

## 第一步

Babylon.JS 是使用 H5 canvas 元素在 Web 平台编写 3D 的非常优秀的库。

### Playground

这是一种非常简单快速的方法去创建一个场景。创建一个 3D 场景非常简单，只需要添加一个摄像头、灯光和 3D 形状（网格）就可以了。[Playground]是一个网站，它拥有你自己创建场景或者编辑现有场景所需要的所有资源。[更多关于 Playground](http://doc.babylonjs.com/features/Playground)。

在 Playground 创建场景的模版是这样的：

```js
var createScene = function () {

    // 创建一个场景
    var scene = new BABYLON.Scene(engine);

    // 向场景中添加一个相机并且把它和 canvas 关联起来
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // 往场景中添加光源
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // 这就是你创建和操作网格模型的地方
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

    return scene;

};
```

你需要的一切资源 Playground 都有了。

- 上面代码在 Playground 的[预览](http://www.babylonjs-playground.com/#WG9OY#1)。

### 你自己的 HTML

在编辑自己的 HTML 文件的时候，只需要将 `createScene` 函数嵌到 script 标签里就行了。同时，你需要去加载 BabylonJS 的 JS 代码。为了同样适应平板电脑和手机，BabylonJS 需要使用指针事件而不是鼠标事件，所以要加载 PEP 事件系统的代码。

另外，需要在 body 元素中添加 canvas 元素，因为 3D 场景要在 canvas 中渲染，并且要在 js 代码中用变量引用这个 canvas 元素。就像上面说的，在编写代码和创建场景之前，需要先生成 Babylon 引擎。

最后，调用 scene 的方法，让引擎能够不断的渲染，并且能够随着浏览器窗口的调整不断的调整场景的大小。

#### HTML 模版

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <title>Babylon Template</title>

      <style>
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #renderCanvas {
            width: 100%;
            height: 100%;
            touch-action: none;
        }
    </style>

    <script src="https://cdn.babylonjs.com/babylon.js"></script>
        <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://code.jquery.com/pep/0.4.1/pep.js"></script>

   </head>

   <body>

    <canvas id="renderCanvas" touch-action="none"></canvas>

    <script>

            var canvas = document.getElementById("renderCanvas"); // 获取 canvas 元素

            var engine = new BABYLON.Engine(canvas, true); // 生成BABYLON 3D 引擎


            /******* 添加创建场景的方法 ******/
            var createScene = function () {

                        // 创建场景
                        var scene = new BABYLON.Scene(engine);

                        // 添加一个相机并且和 canvas 元素关联
                        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
                        camera.attachControl(canvas, true);

                        // 向场景添加光源
                        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
                        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);


                        // 向场景中添加并且操作网格模型
                        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

                        return scene;
                };

                /******* 创建场景方法结束 ******/    

                var scene = createScene(); // 调用创建场景的方法

            engine.runRenderLoop(function () { // 注册一个渲染循环不断的渲染场景
                    scene.render();
            });


            window.addEventListener("resize", function () { // 监听浏览器/canvas 的 resize 事件
                    engine.resize();
            });
    </script>

   </body>

</html>
```

### 贴士

1. 上面的例子使用了比较新的 MeshBuilder 方法来创建形状，关于形状的变量通过 options 对象参数进行设置，相对于早期的 BABYLON.Mesh.Create 使用参数列表拥有一些优势。大多数的 Playground 使用的是比较旧的方法，因为很多的 Playground 是在 MeshBuilder 方法之前创建的。
2. 指针事件使用 PEP 是最近的方法，较老的方法是使用一个名为 hand.js 的系统。两者都可以工作，尽管 hand.js 不再被维护了。你仍然可以在文档中找到 hand.js 对应的地址。

## 下一步

现在你已准备好进一步学习如何创建更多形状，如球体，圆柱体，盒子等。

下一节：[设置形状](./set-shapes.md)

## 延展阅读

- [BabylonJS Forum](http://www.html5gamedevs.com/forum/16-babylonjs) 
- [PEP and hand.js](http://www.html5gamedevs.com/topic/22474-how-does-babylonjs-get-pointer-events-working/#comment-127993)

## 相关链接

- [BabylonJS Main Website](http://www.babylonjs.com/) 
- [BabylonJS Playground](http://babylonjs-playground.com/) 
- [PEP Github](https://github.com/jquery/PEP) 
- [hand.js Github](https://github.com/Deltakosh/handjs)

[Playground]: http://doc.babylonjs.com/features/Playground