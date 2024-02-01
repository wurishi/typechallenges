/*
  89 - 必需的键
  -------
  by yituan (@yi-tuan) #困难 #utils

  ### 题目

  实现高级工具类型 `RequiredKeys<T>`，该类型返回 T 中所有必需属性的键组成的一个联合类型。

  例如

  ```ts
  type Result = RequiredKeys<{ foo: number; bar?: string }>
  // expected to be “foo”
  ```

  > 在 Github 上查看：https://tsch.js.org/89/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type RequiredKeys<T> = any
// type RequiredKeys<T> = {
//     [K in keyof T as {[K]: T[K]} extends Required<T>[K] ? K : never]: {} 
// }[keyof T]

// type RequiredKeys<T, K = keyof T> = K extends keyof T
//     ? T extends Required<Pick<T, K>>
//         ? K
//         : never
//     : never

// type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
//     ? true : false
// type RequiredKeys<T> = {
//     [K in keyof T]-?: IsEqual<Pick<T, K>, Required<Pick<T, K>>> extends true
//     ? K : never
// }[keyof T]

// type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
//     ? true : false
// type RequiredKeys<T> = {
//     [K in keyof T]-?: IsEqual<{ [P in K]: T[P] }, { [P in K]-?: T[P] }> extends true
//     ? K : never
// }[keyof T]

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]
type t1 = RequiredKeys<{ a: number; b?: string }>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<RequiredKeys<{ a: number; b?: string }>, 'a'>>,
  Expect<Equal<RequiredKeys<{ a: undefined; b?: undefined }>, 'a'>>,
  Expect<Equal<RequiredKeys<{ a: undefined; b?: undefined; c: string; d: null }>, 'a' | 'c' | 'd'>>,
  Expect<Equal<RequiredKeys<{}>, never>>,
]
