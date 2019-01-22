# 理解 React 更新的关键一 - ExpirationTime

```js
const MAX_SIGNED_31_BIT_INT = 1073741823;

// 理解成值越大优先级越高
export const NoWork = 0;
export const Never = 1;
// V8 系统里最大的整数，优先级最高，同步，立即处理
export const Sync = MAX_SIGNED_31_BIT_INT; 

// 每一个时间单元的大小 10ms
const UNIT_SIZE = 10;
// 偏移量，加一个偏移量是不想和上面定义的 NoWork 啥的冲突，1073741822
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;

// ms => ExpirationTime
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}

// ExpirationTime => ms
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}

// 向上取整
function ceiling(num: number, precision: number): number {
  // num 除以精度，取整，结果加 1，乘以精度
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

// 假如 currentTime = 73741822
// LOW = 1073741822 - (1000000000 + 500, 25) = 73741322
// HIGH = 1073741822 - (1000000000 + 15, 10) = 73741802
// 算出来 HIGH > LOW，所以优先级高的 ET 就大

export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;

export function computeAsyncExpiration(currentTime) {
  // 1073741822 - ceiling(1073741822 - 当前时间计算出来的 ET + 500, 25)
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE,
  );
}

export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

// 涉及到交互的 ExpirationTime
export function computeInteractiveExpiration(currentTime) {
  // 1073741822 - ceiling(1073741822 - 当前时间计算出的 ET + 15, 10)
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}

```

