/*
  27932 - MergeAll
  -------
  by scarf (@scarf005) #medium #object #array #union

  ### Question

  Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.

  For example:

  ```ts
  type Foo = { a: 1; b: 2 }
  type Bar = { a: 2 }
  type Baz = { c: 3 }

  type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
  ```

  > View on GitHub: https://tsch.js.org/27932
*/

/* _____________ Your Code Here _____________ */

// type MergeAll<XS> = any

type Test<T extends unknown[], U = T[number], Keys extends PropertyKey = U extends U ? keyof U : never> = Keys
type A1 = Test<[{a:1}, {b:2}]>

// type MergeAll<
// XS extends object[],
// U = XS[number],
// Keys extends PropertyKey = U extends U ? keyof U : never
// > = {
//     [K in Keys]: U extends U ? U[K & keyof U] : never
// }

type MergeAll<
XS extends object[],
Res = {}
> = XS extends [infer F, ...infer Rest extends object[]]
    ? MergeAll<
        Rest
        , Omit<Res, keyof F> & {
            [P in keyof F]: P extends keyof Res ? F[P] | Res[P] : F[P]
        }>
    : Omit<Res, never>

type B1 = Omit<{a: 1, b: 2}, never>
// type MergeAll<
// XS extends object[],
// U = XS[number]
// > = U

type T1 = MergeAll<[{ a: 1 }, { c: 2 }]>
type T2 = MergeAll<[{ a: 1, b: 2 }, { a: 2 }, { c: 3 }]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MergeAll<[]>, {} >>,
  Expect<Equal<MergeAll<[{ a: 1 }]>, { a: 1 }>>,
  Expect<Equal<
    MergeAll<[{ a: string }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1 }, { c: 2 }]>,
    { a: 1, c: 2 }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1, b: 2 }, { a: 2 }, { c: 3 }]>,
    { a: 1 | 2, b: 2, c: 3 }
>
  >,
  Expect<Equal<MergeAll<[{ a: 1 }, { a: number }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: number }, { a: 1 }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: 1 | 2 }, { a: 1 | 3 }]>, { a: 1 | 2 | 3 }>>,
]
