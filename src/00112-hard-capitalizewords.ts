/*
  112 - Capitalize Words
  -------
  by Anthony Fu (@antfu) #困难 #template-literal

  ### 题目

  实现`CapitalizeWords<T>`，它将**字符串的每个单词**的第一个字母转换为大写，其余部分保持原样。

  例如

  ```ts
  type capitalized = CapitalizeWords<"hello world, my friends"> // 预期为 'Hello World, My Friends'
  ```

  > 在 Github 上查看：https://tsch.js.org/112/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type CapitalizeWords<S extends string> = any

// type CapitalizeWords<S extends string> = S extends `${infer W} ${infer O}`
//     ? W extends `${infer F}${infer OW}`
//         ? `${Uppercase<F>}${OW} ${CapitalizeWords<O>}`
//         : W
//     : S

// type CapitalizeRest<S extends string> = S extends `${infer F}${infer R}`
//     ? `${F}${CapitalizeRest<Uppercase<F> extends Lowercase<F> ? Capitalize<R> : R>}`
//     : S;
// type CapitalizeWords<S extends string> = Capitalize<CapitalizeRest<S>>

type CapitalizeWords<S extends string, W extends string = ''> = S extends `${infer A}${infer B}`
    ? Uppercase<A> extends Lowercase<A>
        ? `${Capitalize<`${W}${A}`>}${CapitalizeWords<B>}`
        : CapitalizeWords<B, `${W}${A}`>
    : Capitalize<W>

type T = CapitalizeWords<'foo bar hello world'>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CapitalizeWords<'foobar'>, 'Foobar'>>,
  Expect<Equal<CapitalizeWords<'FOOBAR'>, 'FOOBAR'>>,
  Expect<Equal<CapitalizeWords<'foo bar'>, 'Foo Bar'>>,
  Expect<Equal<CapitalizeWords<'foo bar hello world'>, 'Foo Bar Hello World'>>,
  Expect<Equal<CapitalizeWords<'foo bar.hello,world'>, 'Foo Bar.Hello,World'>>,
  Expect<Equal<CapitalizeWords<'aa!bb@cc#dd$ee%ff^gg&hh*ii(jj)kk_ll+mm{nn}oo|pp🤣qq'>, 'Aa!Bb@Cc#Dd$Ee%Ff^Gg&Hh*Ii(Jj)Kk_Ll+Mm{Nn}Oo|Pp🤣Qq'>>,
  Expect<Equal<CapitalizeWords<''>, ''>>,
]
