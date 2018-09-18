# 数据类型

1. 基本数据类型

   ```typescript
   const num:number = 12;
   const str:string = '12';
   const flag:boolean = true;
   const arr:number[] = [1, 2, 3];
   const arr2:Array<number> = [1, 2, 3];
   ```

2. 元组类型

   ```typescript
   // 后面如果要添加值的话，必须是定义中的类型，比如下面的 string 和 number
   const tuple:[string, number] = ['str', 12];
   ```

3. 枚举类型

   ```typescript
   enum ResponseStatus {
       SUCCESS: 1,
       FAILED: -1,
   }
   // response
   const status:ResponseStatus = ResponseStatus.SUCCESS;
   reply({ status });
   ```

4. 任意类型

   ```typescript
   let container:any = 12;
   container = 'str';
   ```

5. undefined 和 null

   ```typescript
   let flag:boolean | undefined;
   let num:number | null | undefined;
   ```

6. void

   ```typescript
   // 没有返回
   function():void {
     console.log('excute');
   }
   ```

7. never

   ```typescript
   // 返回never的函数必须存在无法达到的终点
   function error(message: string): never {
       throw new Error(message);
   }
   ```


