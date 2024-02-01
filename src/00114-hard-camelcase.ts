/*
  114 - CamelCase
  -------
  by Anthony Fu (@antfu) #困难 #template-literal

  ### 题目

  实现 `CamelCase<T>` ，将 `snake_case` 类型的表示的字符串转换为 `camelCase` 的表示方式。

  例如

  ```ts
  type camelCase1 = CamelCase<"hello_world_with_types"> // 预期为 'helloWorldWithTypes'
  type camelCase2 = CamelCase<"HELLO_WORLD_WITH_TYPES"> // 期望与前一个相同
  ```

  > 在 Github 上查看：https://tsch.js.org/114/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type CamelCase<S extends string> = any

// type IsLetter<S extends string> = Uppercase<S> extends Lowercase<S> ? false : true
// type CamelCase<S extends string, R extends string = ''> = S extends `${infer L}${infer REST}`
//     ? CamelCase<
//         REST, 
//         IsLetter<L> extends true
//             ? R extends `${infer P}_` 
//                 ? `${P}${Uppercase<L>}`
//                 : `${R}${Lowercase<L>}`
//             : `${R}${L}`
//         >
//     : R

type CamelCase<S extends string> = S extends `${infer L}_${infer R1}${infer R2}`
    ? Uppercase<R1> extends Lowercase<R1>
        ? `${Lowercase<L>}_${CamelCase<`${R1}${R2}`>}`
        : `${Lowercase<L>}${Uppercase<R1>}${CamelCase<R2>}`
    : Lowercase<S>

type t1 = CamelCase<'foo_bar'>
type t2 = CamelCase<'foo_$bar'>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CamelCase<'foobar'>, 'foobar'>>,
  Expect<Equal<CamelCase<'FOOBAR'>, 'foobar'>>,
  Expect<Equal<CamelCase<'foo_bar'>, 'fooBar'>>,
  Expect<Equal<CamelCase<'foo__bar'>, 'foo_Bar'>>,
  Expect<Equal<CamelCase<'foo_$bar'>, 'foo_$bar'>>,
  Expect<Equal<CamelCase<'foo_bar_'>, 'fooBar_'>>,
  Expect<Equal<CamelCase<'foo_bar__'>, 'fooBar__'>>,
  Expect<Equal<CamelCase<'foo_bar_$'>, 'fooBar_$'>>,
  Expect<Equal<CamelCase<'foo_bar_hello_world'>, 'fooBarHelloWorld'>>,
  Expect<Equal<CamelCase<'HELLO_WORLD_WITH_TYPES'>, 'helloWorldWithTypes'>>,
  Expect<Equal<CamelCase<'-'>, '-'>>,
  Expect<Equal<CamelCase<''>, ''>>,
  Expect<Equal<CamelCase<'😎'>, '😎'>>,
]
