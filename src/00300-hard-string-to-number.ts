/*
  300 - String to Number
  -------
  by Pig Fang (@g-plane) #hard #template-literal

  ### Question

  Convert a string literal to a number, which behaves like `Number.parseInt`.

  > View on GitHub: https://tsch.js.org/300
*/

/* _____________ Your Code Here _____________ */

// type ToNumber<S extends string> = any

// type ToNumber<S extends string, T extends any[] = []> = S extends `${T['length']}`
//     ? T['length']
//     : ToNumber<S, [...T, any]>

type ToNumber<S extends string> = S extends `${infer N extends number}`
    ? N
    : never

// type t1 = ToNumber<'18@7_$%'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ToNumber<'0'>, 0>>,
  Expect<Equal<ToNumber<'5'>, 5>>,
  Expect<Equal<ToNumber<'12'>, 12>>,
  Expect<Equal<ToNumber<'27'>, 27>>,
  Expect<Equal<ToNumber<'18@7_$%'>, never>>,
]
