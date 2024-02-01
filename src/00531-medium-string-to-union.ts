/*
  531 - String to Union
  -------
  by Andrey Krasovsky (@bre30kra69cs) #中等 #union #string

  ### 题目

  实现一个将接收到的String参数转换为一个字母Union的类型。

  例如

  ```ts
  type Test = '123';
  type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
  ```

  > 在 Github 上查看：https://tsch.js.org/531/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type StringToUnion<T extends string> = any

// type StringToUnion<T extends string> = T extends `${infer F}${infer R}`
//     ? F | StringToUnion<R>
//     : never

type Split<S extends string> = S extends ''
    ? []
    : S extends `${infer F}${infer R}`
        ? [F, ...Split<R>]
        : [S]
type StringToUnion<T extends string> = Split<T>[number]

type t0 = StringToUnion<'t'>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<StringToUnion<''>, never>>,
  Expect<Equal<StringToUnion<'t'>, 't'>>,
  Expect<Equal<StringToUnion<'hello'>, 'h' | 'e' | 'l' | 'l' | 'o'>>,
  Expect<Equal<StringToUnion<'coronavirus'>, 'c' | 'o' | 'r' | 'o' | 'n' | 'a' | 'v' | 'i' | 'r' | 'u' | 's'>>,
]
