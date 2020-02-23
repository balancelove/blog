# CSS 实现单行文本、多行文本溢出省略号

# 单行文本溢出

```css
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

# 多行文本溢出

> 多行文本有 js 的方法进行截断，添加 ...，这种方法的兼容性比较好。

```css
.muti-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //这里是在第二行有省略号
  overflow: hidden;
}
```
