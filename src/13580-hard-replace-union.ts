/*
  13580 - Replace Union
  -------
  by Konstantin Barabanov (@crutch12) #hard

  ### Question

  Given an `union of types` and `array of type pairs` to replace (`[[string, number], [Date, null]]`), return a new union replaced with the `type pairs`.

  > View on GitHub: https://tsch.js.org/13580
*/

/* _____________ Your Code Here _____________ */

// type UnionReplace<T, U extends [any, any][]> = any

type UnionReplace<T, U extends [any, any][]> = U extends [infer F, ...infer Rest extends [any, any][]]
    ? F extends [T, infer Replace]
        ? UnionReplace<Exclude<T, F[0]> | Replace, Rest>
        : UnionReplace<T, Rest>
    : T

type A = UnionReplace<number | string, [[string, null], [Date, Function]]>

type B = UnionReplace<number | string, [[string, null], [Date, Function], [number, RegExp]]>

type Test<T, U> = (<A>() => A extends T ? 1 : 2) extends (<B>() => B extends U ? 1 : 2)
? true : false
type T1 = Test<3, number>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  // string -> null
  Expect<Equal<UnionReplace<number | string, [[string, null]]>, number | null>>,

  // string -> null
  Expect<Equal<UnionReplace<number | string, [[string, null], [Date, Function]]>, number | null>>,

  // Date -> string; Function -> undefined
  Expect<Equal<UnionReplace<Function | Date | object, [[Date, string], [Function, undefined]]>, undefined | string | object>>,
]
