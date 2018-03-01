# 盒模型

> CSS 盒模型是 CSS 的基石，非常重要的一块内容。

## 盒模型基本概念

1. margin + border + padding + content
2. 标准模型： 计算内容宽度时 width = content width，高度计算相同。
3. IE 模型： 计算内容宽度时 width = content + padding + border。
4. box-sizing: border-box、content-box。 
5. __JS 获取盒模型的宽高。__
6. __边距重叠及 BFC。__

## JS 获取盒模型的宽高

- dom.style.width/height: 只能取到内联样式
- dom.currentStyle.width/height: 拿到选然后的宽高，但只有 IE 支持
- window.getComputedStyle(dom).width/height: 兼容浏览器
- dom.getBoundingClientRect().width/height: 拿到四条边相对左边上边的距离。

## 边距重叠

父子边距重叠、兄弟边距重叠、空元素边距重叠(自身上下边距重叠)，取最大值。

## BFC

块级格式化上下文

### 原理（渲染规则）

1. 在同一个 BFC 元素内部垂直方向发生边距重叠
2. BFC 区域不会与浮动元素 box 重叠
3. 独立容器，内外互不影响
4. 计算 BFC 高度，浮动元素参与计算

### 创建 BFC

- position的值不为 static 或者 relative。
- float 不为 none
- display 为 table 相关
- overflow 不为 visible

