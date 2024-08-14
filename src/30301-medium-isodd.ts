/*
  30301 - IsOdd
  -------
  by jiangshan (@jiangshanmeta) #medium #string

  ### Question

  return true is a number is odd

  > View on GitHub: https://tsch.js.org/30301
*/

/* _____________ Your Code Here _____________ */

// type IsOdd<T extends number> = any

type IsOdd<T extends number> = `${T}` extends `${number | ''}${1 | 3 | 5 | 7 | 9}` ? true : false

// type LastWorld<T extends string> = T extends `${infer F}${infer R}`
//     ? R extends ''
//         ? F
//         : LastWorld<R>
//     : never

// type IsOdd<T extends number> = LastWorld<`${T}`> extends '1' | '3' | '5' | '7' | '9' ? true : false

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsOdd<5>, true>>,
  Expect<Equal<IsOdd<2023>, true>>,
  Expect<Equal<IsOdd<1453>, true>>,
  Expect<Equal<IsOdd<1926>, false>>,
  Expect<Equal<IsOdd<2.3>, false>>,
  Expect<Equal<IsOdd<3e23>, false>>,
  Expect<Equal<IsOdd<number>, false>>,
]
