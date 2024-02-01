/*
  55 - 联合类型转化为交叉类型
  -------
  by Zheeeng (@zheeeng) #困难 #utils #infer

  ### 题目

  实现高级工具类型 `UnionToIntersection<U>`

  例如

  ```ts
  type I = UnionToIntersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true
  ```

  > 在 Github 上查看：https://tsch.js.org/55/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type ToUnionOfFunction<T> = any;
type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never;
type UnionToIntersection<U> = ToUnionOfFunction<U> extends (a: infer U) => any ? U : never;

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<UnionToIntersection<'foo' | 42 | true>, 'foo' & 42 & true>>,
  Expect<Equal<UnionToIntersection<(() => 'foo') | ((i: 42) => true)>, (() => 'foo') & ((i: 42) => true)>>,
]