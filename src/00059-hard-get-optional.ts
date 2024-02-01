/*
  59 - 获得可选属性
  -------
  by Zheeeng (@zheeeng) #困难 #utils #infer

  ### 题目

  实现高级工具类型 `GetOptional<T>`，该类型保留所有可选属性

  例如

  ```ts
  type I = GetOptional<{ foo: number, bar?: string }> // expected to be { bar?: string }
  ```

  > 在 Github 上查看：https://tsch.js.org/59/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type GetOptional<T> = any
// type GetOptional<T> = {
//     [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K]
// }
// type GetOptional<T> = Pick<T, {[P in keyof T]-?: {} extends Pick<T, P> ? P : never}[keyof T]>

type Opt<T> = {[K in keyof T]-? : {} extends Pick<T, K> ? K : never}[keyof T]
type GetOptional<T> = Pick<T, Opt<T>>
type t1 = Opt<{ foo: number; bar?: string, a?: boolean }>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GetOptional<{ foo: number; bar?: string }>, { bar?: string }>>,
  Expect<Equal<GetOptional<{ foo: undefined; bar?: undefined }>, { bar?: undefined }>>,
]
