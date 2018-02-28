# Grid 布局发车啦

> Grid 布局又叫做网格布局，顾名思义是一种基于二维网格的布局方式，Grid 的强大令人兴奋，让我们一起来走进 Grid 的世界吧。

## 兼容性

好了，大家都坐好，我准备发车啦。不符合要求的同学请下车，没满 18 岁的，咳咳，开玩笑。不是所有人现在都能搭上 Grid 的小车车，毕竟项目兼容性问题很现实，不过不耽误我们学习。

![兼容性](grid.png)

我替大家翻译一下上面的浏览器都是啥，顺序从左到右：

- PC 端： Chrome、Edge、Firefox、IE、Opera、Safari
- 移动端： Android、Chrome for Android、Edge Mobile、Firefox for Android、Opera、IOS Safari、Samsung Internet

好了，大家看了看浏览器的兼容性就知道，如今主流浏览器都已经支持了 Grid 布局，还等啥呢？上车吧。

## 第一站：基本概念

乘客们，在开始了解用法之前，我们要了解一些 Grid 布局的基本概念，我想大家应该小时候都用过一种叫小字本的东西，这就是个正儿八经的网格。

![小字本](./grid-paper.jpeg)

- __Container:__ 网格容器，当我们设置 `display: grid;` 就将一个容器变成了网格容器，就比如说上面小字本里外层的那个绿框。
- __Item:__ 网格项，在我们设置的网格容器中的每一个子元素都是一个网各项。
- __Line:__ 网格线，顾名思义啦，这东西就是网格之间分界的线，就上小字本里的横着竖着的线。
- __Track:__ 网格轨道，两条相邻的网格线之间的空间，也就是网格的行或列。
- __Cell:__ 网格单元，两个相邻的行和列之间的区域，也就像是小字本里的每个小格子了。
- __Area:__ 网格区域，四条网格线包围起来的区域。

好了，基本概念了解的差不多了，我们去往下一站。

## 第二站：基本用法

第二站到了，我们要继续吹牛了。

本站要介绍的 api:

1. grid-template-columns 和 grid-template-rows
2. grid-gap

第一件事，掏出代码：

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
```

```css
body {
  background: #CCCCCC;
}

.container > div {
  font-size: 35px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #666666;
}

.container > div:nth-child(2n) {
  background: #336666;
}

.container > div:nth-child(4n) {
  background: #f37e70;
}

.container {
  display: grid;
  grid-template-columns: 120px 120px 120px;
  grid-template-rows: 50px 50px;
}
```

好了，现在它长这个样子。

![](grid-1.png)

我们可以看出上面一些关键的 css 代码：

1. 使用 `display: grid;` 将外层容器变成一个网格布局容器。
2. 现在我们拥有了一个容器，我们现在要开始干什么了？对，没错，我们要开始把这个容器画成一个一个的格子。
3. `grid-template-columns: 120px 120px 120px;` 将容器画成 3 列，每列 120px；`grid-template-rows: 50px 50px;` 画成 2 行，每行 50px。

上面两个 api 给网格加上了两条横线，三条竖线，把容器画成了一个个的格子。然后将网格项一个一个填进去，那么聪明的同学又会想了，你这样画好格子，里面有 6 个格子，那我再添一个 div 会出现什么情况？好吧，满足这位同学的好奇心，我们加一个 div 进去。

然后就会变成这样：

![](grid-2.png)

神奇，是不是，明明俺就画了 6 个格子，居然 7 出现了，并且还有一定高度。其实在 grid 里，它有一个隐式网格轨道。

当我们的网格项处于我们没有定义的网格部分的时候，它会有一个默认的值，我们也可以选择去定义隐式网格轨道的大小，通过 `grid-auto-rows` 和 `grid-auto-columns` 来定义行和列，详细是什么样的我们下面再说。

讲完这个，我们再看看，每个格子挨得太近了，一点都不美观，咋办呢？我们加上 `grid-gap: 2px 4px;` 看看：

![](grid-3.png)

可以看到，使用这个属性我们定了网格的间隙，这个 api 其实是两个 api 的组合(`grid-column-gap` 和 `grid-row-gap`)。

好了，这一站就是基本用法，下面我们继续发车啦。

## fr 单位以及 repeat

上面我们通过一些基础的属性，写了一个 6 个格子的页面。这一节我们不讲属性，讲一下在 grid 中的一个单位值 — fr。那么这个 fr，代表的是什么意思呢？在 flex 中也有类似的属性，fr 的意思就是在自由空间进行分配的一个单位，那么是什么意思呢？

比如说，容器宽度为 1000px，现在我的 `grid-template-columns` 这样设置，`200px 1fr 1fr 2fr`。那么这就表示分了 4 列，第一列为 200px，然后剩下的 800px 就是自由空间了，经过计算可以得出 1fr 为 200px，这就是 fr 的意义。

那么，我们上面的例子其实可以这样写 `grid-template-columns: 1fr 1fr 1fr;`。但是现在又出现了一个问题，这个 1fr 写的好烦，能不能就写一个。好消息，是有的，我们可以使用 repeat 来简写，于是上面的例子又可以改成 `grid-template-columns: repeat(3, 1fr)`。
