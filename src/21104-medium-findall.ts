/*
  21104 - FindAll
  -------
  by tunamagur0 (@tunamagur0) #medium #template-literal #string

  ### Question

  Given a pattern string P and a text string T, implement the type `FindAll<T, P>` that returns an Array that contains all indices (0-indexed) from T where P matches.

  > View on GitHub: https://tsch.js.org/21104
*/

/* _____________ Your Code Here _____________ */

// type FindAll<T extends string, P extends string> = any

type Test<T> = T extends `${string}${infer A}POP`
    ? A
    : ''
// type A1 = Test<'cPOP'>

// type FindAll<
// T extends string,
// P extends string,
// Index extends 0[] = [],
// Result extends number[] = [],
// > = T extends `${string}${infer L}${P}${infer R}`
//     ? FindAll<`${L}${P}${R}`, P, [...Index, 0], L extends '' ? [...Result, Index['length']] : Result>
//     : Result

// type FindAll<
// T extends string,
// P extends string,
// Index extends 0[] = [],
// Result extends number[] = []
// > = P extends ''
//   ? Result
//   : T extends `${string}${infer Rest}`
//     ? T extends `${P}${string}`
//       ? FindAll<Rest, P, [...Index, 0], [...Result, Index['length']]>
//       : FindAll<Rest, P, [...Index, 0], Result>
//     : Result

type GetStrLen<S, C extends 0[] = []> = S extends `${string}${infer Rest}`
  ? GetStrLen<Rest, [...C, 0]>
  : C['length']

type A1 = GetStrLen<'AAAA'>

type FindAll<
T extends string,
P extends string,
S extends string = '',
Result extends number[] = []
> = P extends ''
  ? Result
  : T extends `${S}${infer L}${P}${string}`
    ? FindAll<T, P, `${S}${L}${P extends `${infer F}${string}` ? F : P}`, [...Result, GetStrLen<`${S}${L}`>]>
    : Result

// 你的答案
// type getStrL<T extends string, U extends ''[] = []> = T extends `${any}${infer R}` ? getStrL<R, [...U, '']> : U['length']
// type FindAll<T extends string, P extends string, S extends string = '', R extends number[] = []> =
//   P extends '' ? [] :
//   T extends `${S}${infer F}${P}${any}` ?
//   FindAll<T, P, `${S}${F}${P extends `${infer F}${any}` ? F : P}`, [...R, getStrL<`${S}${F}`>]>
//   : R

type A = FindAll<'Collection of TypeScript type challenges', 'Type'>
type B = FindAll<'AAAA', 'A'>
type C = FindAll<'AAAA', 'AA'>
type D = FindAll<'AAAAA', 'AAA'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'Type'>, [14]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'pe'>, [16, 27]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', ''>, []>>,
  Expect<Equal<FindAll<'', 'Type'>, []>>,
  Expect<Equal<FindAll<'', ''>, []>>,
  Expect<Equal<FindAll<'AAAA', 'A'>, [0, 1, 2, 3]>>,
  Expect<Equal<FindAll<'AAAA', 'AA'>, [0, 1, 2]>>,
]
