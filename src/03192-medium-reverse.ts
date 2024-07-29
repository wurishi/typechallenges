/*
  3192 - Reverse
  -------
  by jiangshan (@jiangshanmeta) #中等 #tuple

  ### 题目

  实现类型版本的数组反转 ```Array.reverse```

  例如：

  ```typescript
  type a = Reverse<['a', 'b']> // ['b', 'a']
  type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
  ```

  > 在 Github 上查看：https://tsch.js.org/3192/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type Reverse<T> = any
type Reverse<T extends unknown[]> = T extends [infer F, ...infer R]
    ? [...Reverse<R>, F]
    : T

// type Reverse<T extends any[]> = 
//   T extends [...infer R, infer E] 
//     ? [E, ...Reverse<R>] 
//     : T

type A = Reverse<['a', 'b', 'c']>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Reverse<[]>, []>>,
  Expect<Equal<Reverse<['a', 'b']>, ['b', 'a']>>,
  Expect<Equal<Reverse<['a', 'b', 'c']>, ['c', 'b', 'a']>>,
]

type errors = [
  // @ts-expect-error
  Reverse<'string'>,
  // @ts-expect-error
  Reverse<{ key: 'value' }>,
]
