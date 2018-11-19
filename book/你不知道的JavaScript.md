# 你不知道的JavaScript

> 这本书也是业界知名，从中也可以获取非常多的知识，这次翻看算是查缺补漏吧，记录一些以前不知道的问题。

1. __为什么不建议使用 eval 和 with 呢？__ 因为这两者会在运行时修改或创建新的作用域，而 js 引擎会在编译阶段进行各种优化，其中有些优化是依靠代码的词法进行静态分析的，并预先确定代码的位置。

2. __闭包和模块机制？__ 利用闭包的机制。

   ```js
   const myModules = (function Manage() {
       const modules = {};
       
       function define(name, deps, impl) {
           deps.map((dep, index) => {
               modules[index];
           });
           modules[name] = impl.apply(impl, deps);
       }
       
       function get(name) {
           return modules[name];
       }
       
       return {
           define,
           get,
       };
   })();
   ```

3. __new 发生了什么？__ 当 new 一个构造函数的时候，会自动执行下面的操作，第一、创建一个全新的对象，第二、这个新对象继承了原型，第三、这个新对象绑定到函数调用的 this，第四、如果函数没有返回新对象，就将这个对象返回回去。

4. __如何实现一个 bind？__ 