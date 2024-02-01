/*
  57 - 获得必需的属性
  -------
  by Zheeeng (@zheeeng) #困难 #utils #infer

  ### 题目

  实现高级工具类型 `GetRequired<T>`，该类型保留所有必需的属性

  例如

  ```ts
  type I = GetRequired<{ foo: number, bar?: string }> // expected to be { foo: number }
  ```

  > 在 Github 上查看：https://tsch.js.org/57/zh-CN
*/

/* _____________ 你的代码 _____________ */

type GetRequired<T> = {
    [key in keyof T as T[key] extends Required<T>[key] ? key : never ]: T[key]
}

// type GetRequired<T> = {
//     [K in keyof T as {[P in K]: T[K]} extends {[P in K]-?: T[K]} ? K : never]: T[K]
// }

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GetRequired<{ foo: number; bar?: string }>, { foo: number }>>,
  Expect<Equal<GetRequired<{ foo: undefined; bar?: undefined }>, { foo: undefined }>>,
]
