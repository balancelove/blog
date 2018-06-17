# Hash

hash 顾名思义，这是一个根据 key-value 来进行数据存储的格式，在平常工作的过程中，我们就会使用对象来进行 Hash 存储。

那么使用当前 Hash 类实例化出来的是什么样子的呢？

```js
new Hash([['data1', 12], ['data2', 10], ['data3', 8]]);
// 最终实例化出来的是一个对象，他拥有 size 属性，以及 __data__ 属性，同时具备 get、set、has、delete、clear 方法
```

## 源码

```js
const HASH_UNDEFINED = '__lodash_hash_undefined__'

class Hash {
  constructor(entries) {
    let index = -1
    const length = entries == null ? 0 : entries.length

    this.clear()
    while (++index < length) {
      const entry = entries[index]
      this.set(entry[0], entry[1])
    }
  }
    
  clear() {
    this.__data__ = Object.create(null)
    this.size = 0
  }
    
  delete(key) {
    const result = this.has(key) && delete this.__data__[key]
    this.size -= result ? 1 : 0
    return result
  }

  get(key) {
    const data = this.__data__
    const result = data[key]
    return result === HASH_UNDEFINED ? undefined : result
  }

  has(key) {
    const data = this.__data__
    return data[key] !== undefined
  }

  set(key, value) {
    const data = this.__data__
    this.size += this.has(key) ? 0 : 1
    data[key] = value === undefined ? HASH_UNDEFINED : value
    return this
  }
}
```

## 解释

- 上面有一个点，用 Object.create(null) 去代替 {}，因为使用 Object.create(null) 创建的对象是很干净的，没有原型链等等。