# Echarts 图表显示问题

因为在初始化图表的时候，判断了 ref 是否有值，但是在 render 的时候因为没有数据时显示的暂无数据，所以没有渲染带 refs 的元素，所以在下一次的 componentWillReceiveProps 重新渲染的时候，因为还没有对挂载图表的元素进行初始化。

```jsx
{
  data ? <div>暂无数据</div> : <div refs={n => (this.chart = n)} />;
}
```

这是生命周期的问题，引起注意。
