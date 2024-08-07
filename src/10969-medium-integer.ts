/*
  10969 - 整数
  -------
  by HuaBing (@hbcraft) #中等 #template-literal

  ### 题目

  请完成类型 `Integer<T>`，类型 `T` 继承于 `number`，如果 `T` 是一个整数则返回它，否则返回 `never`。

  > 在 Github 上查看：https://tsch.js.org/10969/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type Integer<T> = any

type Integer<T extends number> = number extends T
    ? never
    : `${T}` extends `${string}.${string}`
        ? never
        : T

// fantastic way
// type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never

type A = Integer<typeof x>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

let x = 1
let y = 1 as const

type cases1 = [
  Expect<Equal<Integer<1>, 1>>,
  Expect<Equal<Integer<1.1>, never>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<1.000000000>, 1>>,
  Expect<Equal<Integer<0.5>, never>>,
  Expect<Equal<Integer<28.00>, 28>>,
  Expect<Equal<Integer<28.101>, never>>,
  Expect<Equal<Integer<typeof x>, never>>,
  Expect<Equal<Integer<typeof y>, 1>>,
]
