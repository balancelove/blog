# Babylon 学习第一步

## 第一印象

看完一点介绍之后，发现创建一个场景有几个基本要素，首先你需要相机，这决定了你使用什么样的视角去看你构建出来的场景，然后第二点是光源，第三点就是各种各样的形状了。

所以理解之后，我心中的基础代码长这样：

```js
// 以下方法是我自己想的，只是验证思路，不是 babylon 的方法
const createScene = () => {
  // 创建场景
  const scene = new BABYLON.Scene(engine);
  // 创建相机
  const camera = new BABYLON.Camera('camera', scene);
  camera.add(canvas);
  // 创建光源
  const light = new BABYLON.Light('light', scene);
  // 创建形状
  const sphere = new BABYLON.Sphere('sphere', scene);
  return sphere;
};
```

所以再结合上 HTML 的代码，就是这样的：

```html
<body>
  <canvas id="babylon_render"></canvas>
  <!-- 引入 BABYLON 相关库  -->
  <script>
    const el = document.getElementById('babylon_render');
    const engine = new BABYLON.engine(el, true);
    const scene = createScene();
    // 循环渲染
    engine.runRenderLoop(() => {
      scene.render();
    });
    // 窗口变化自适应
    window.addEventListener('resize', () => {
      engine.resize();
    });
  </script>
</body>
```

那么基本的代码结构搞清楚，我们就去一点一点的看细节了。
