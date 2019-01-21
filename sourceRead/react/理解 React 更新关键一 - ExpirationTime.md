# 理解 React 更新的关键一 - ExpirationTime

```js
const MAX_SIGNED_31_BIT_INT = 1073741823;

export type ExpirationTime = number;

export const NoWork = 0;
export const Never = 1;
// V8 系统里最大的整数
export const Sync = MAX_SIGNED_31_BIT_INT;

// 每一个时间单元的大小
const UNIT_SIZE = 10;
// 偏移量，加一个偏移量是不想和上面定义的 NoWork 啥的冲突，1073741822
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;

// 1 个过期时间单元是 10ms.
// 毫秒转过期时间，比如传入的参数是 10000，那么公式为 1073741822 - ((10000 / 10) | 0)，| 0 的意思是取整
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}

// 过期时间转成毫秒，和上面的式子是一套的
// (1073741822 - 1073740822) * 10
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}

// 向上取整
function ceiling(num: number, precision: number): number {
  // LOW  1073741322 25 => 1073741325
  // HIGH 1073740837 10 => 1073740840
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(
  currentTime, // 假如传的参数是 1000
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  // 1073741822 - 
  return (
    MAGIC_NUMBER_OFFSET -
    // (1073741822 - 1000 + 150 / 10, 10)
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;

export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE,
  );
}

// We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

// 涉及到交互的 ExpirationTime
export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}

```

