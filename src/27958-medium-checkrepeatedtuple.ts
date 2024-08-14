/*
  27958 - CheckRepeatedTuple
  -------
  by bowen (@jiaowoxiaobala) #中等

  ### 题目

  判断一个元组类型中是否有相同的成员

  For example:

  ```ts
  type CheckRepeatedTuple<[1, 2, 3]>   // false
  type CheckRepeatedTuple<[1, 2, 1]>   // true
  ```

  > 在 Github 上查看：https://tsch.js.org/27958/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type CheckRepeatedTuple<T extends unknown[]> = any

type CheckRepeatedTuple<T extends unknown[]> = 
T extends [infer F, ...infer Rest]
    ? F extends Rest[number]
        ? true
        : CheckRepeatedTuple<Rest>
    : false

type A = CheckRepeatedTuple<[1, 2, 3, 4, number]>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CheckRepeatedTuple<[number, number, string, boolean]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[number, string]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 3]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 1]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[]>, false>>,
  Expect<Equal<CheckRepeatedTuple<string[]>, false>>,
]
