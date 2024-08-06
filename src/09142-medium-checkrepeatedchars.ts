/*
  9142 - CheckRepeatedChars
  -------
  by Hong (@RThong) #中等 #union #string

  ### 题目

  判断一个string类型中是否有相同的字符
  ```ts
  type CheckRepeatedChars<'abc'>   // false
  type CheckRepeatedChars<'aba'>   // true
  ```

  > 在 Github 上查看：https://tsch.js.org/9142/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type CheckRepeatedChars<T extends string> = any
// type UnionToIntersectionFn<U> = (U extends unknown
//     ? (k: () => U) => void
//     : never) extends (k: infer I) => void ? I : never

// type A1 = UnionToIntersectionFn<1 | 2>

// type GetUnionLast<U> = UnionToIntersectionFn<U> extends () => infer I
//     ? I : never

// type A2 = GetUnionLast<1 | 2>

// type Prepend<Tuple extends unknown[], First> = [First, ...Tuple]
// type A3 = Prepend<[2, 3], 1>

// type UnionToTuple<Union, T extends unknown[] = [], Last = GetUnionLast<Union>> =
// [Union] extends [never]
//     ? T
//     : UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>
// type A4 = UnionToTuple<1 | 2>

// type CheckRepeatedChars<
// T extends string,
// A extends string[] = [],
// U = UnionToTuple<A[number]>
// > = T extends `${infer F}${infer S}`
//     ? CheckRepeatedChars<S, [...A, F]>
//     : U

type CheckRepeatedChars<T extends string> = T extends `${infer F}${infer R}`
    ? R extends `${string}${F}${string}`
        ? true
        : CheckRepeatedChars<R>
    : false

type T1 = CheckRepeatedChars<'abc'>
type T2 = CheckRepeatedChars<'abb'>
type T3 = CheckRepeatedChars<''>
/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CheckRepeatedChars<'abc'>, false>>,
  Expect<Equal<CheckRepeatedChars<'abb'>, true>>,
  Expect<Equal<CheckRepeatedChars<'cbc'>, true>>,
  Expect<Equal<CheckRepeatedChars<''>, false>>,
]
