# commit 1 学习

## ts-node

在 ts 项目中，可以在项目入口目录中引入这个包，就能够不用编译而直接运行项目。

```typescript
require('ts-node/register');
require('./server');
```

## reflect-metadata

可以使用这个库对类或者方法反射元数据，我们可以获取类或者方法上的装饰器的信息，通过这样的操作来进行注解的解析。

```typescript
import 'reflect-metadata';

Reflect.defineMetadata(key, value, target);
Reflect.getMetadata(key, target);

// 比如说
Reflect.defineMetadata('path', '/users', target);
Reflect.getMetadata('path', route);
```

## 装饰器

## 依赖注入

## 依赖查找

