# classList

> 从className到classList，这是一次关于类名的变革，让我们看看强大的classList

## 浏览器兼容的情况

![image.png](http://upload-images.jianshu.io/upload_images/7040756-f5b11336ac3647c0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一张图清晰明了，同时检测也很简单，document.body.classList不是undefined就是支持的。

## classList有什么

我们来看一看在classList里有些什么。

![image.png](http://upload-images.jianshu.io/upload_images/7040756-1ee429506aeaf16b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们可以看到里面有几个属性，我们来解释一下。

1. value:  是class里的所有值
2. length: 这是表示有多少的class值
3. 类数组键值对: 这是每一个class值的键值对
  我们接下来看一看暴露出来的API。

```js
const list = document.getElementById('wrapper').classList
list.add('add1')  //  这是添加类的方法
list.contains('add1')  //  这是判断类中是否有这个类名
list.item(0)  // 通过索引返回类名
list.remove('add1')  //  移除类
list.toString()  //  这个方法类似className
list.keys() //  这个返回的是一个iterator接口，和Object.keys()一样可以用来遍历
list.toggle() //  如果有这个类名就移除，没有就添加
```
