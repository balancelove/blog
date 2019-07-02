# 页面布局

> 页面布局主要考察 HTML 以及 CSS 的功底，对页面布局的把控能力。

## 三栏布局

要求：高度已知，左右固定，中间自适应。

> 只列出一些关键代码。

### 绝对定位布局

优缺点： 简单，快捷，可扩展性差。

```css
.container {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
.main {
  position: absolute;
  left: 300px;
  right: 300px;
}
```

### flex 布局

```css
.container {
  display: flex;
}
.left {
  flex: 300px;
}
.main {
  flex: 1;
}
.right {
  flex: 300px;
}
```

### grid 布局

```css
.container {
  display: grid;
  grid-template-rows: 500px;
  grid-template-columns: 300px 1fr 300px;
}
```

### table 布局

优缺点： 兼容性非常好，但是三栏等高，可能不合适。

```css
.container {
  display: table;
}
.container > div {
  display: table-cell;
}
.left {
  width: 300px;
}
.right {
  right: 300px;
}
```

### float 布局

优缺点： 兼容性好，但是要处理浮动关系

```css
.left {
  float: left;
  width: 300px;
}
.right {
  float: right;
  width: 300px;
}
.main {
  overflow: hidden;
}
```

## 圣杯布局和双飞翼

优点： 圣杯布局使用 float、负 margin 和 relative，不需要添加额外标签。.main 元素设置 padding，为两侧定宽元素留出位置。内容元素设置 100%宽度，占据中间位置。而两侧定宽元素通过设置负 margin 和 relative 的偏移属性配合，到达相应位置

缺点: 并没有实现等高布局；使用了相对定位，扩展性不好

优点：双飞翼布局在圣杯布局的基础上，通过为.main 元素外添加一层 div 结构，不使用相对定位。在.main 元素上设置 margin。两侧的定宽列通过负 margin 来占据.main 元素的 margin 区域

缺点: 并没有实现等高布局，增加了 html 结构

链接： https://www.cnblogs.com/xiaohuochai/p/5459587.html
