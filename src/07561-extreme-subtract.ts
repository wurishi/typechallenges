/*
  7561 - Subtract
  -------
  by Lo (@LoTwT) #extreme #tuple

  ### Question

  Implement the type Subtraction that is ` - ` in Javascript by using BuildTuple.

  If the minuend is less than the subtrahend, it should be `never`.

  It's a simple version.

  For example

  ```ts
  Subtract<2, 1> // expect to be 1
  Subtract<1, 2> // expect to be never
  ```

  > View on GitHub: https://tsch.js.org/7561
*/

/* _____________ Your Code Here _____________ */

// M => minuend, S => subtrahend
// type Subtract<M extends number, S extends number> = any

type Tuple<T, Res extends any[] = []> = Res['length'] extends T
        ? Res
        : Tuple<T, [...Res, any]>

type Subtract<M extends number, S extends number> = 
Tuple<M> extends [...Tuple<S>, ...infer Rest]
  ? Rest['length']
  : never

type A = Subtract<14, 4>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Subtract<1, 1>, 0>>,
  Expect<Equal<Subtract<2, 1>, 1>>,
  Expect<Equal<Subtract<1, 2>, never>>,
  Expect<Equal<Subtract<10, 9>, 1>>
  // Expect<Equal<Subtract<1000, 999>, 1>>,
]
