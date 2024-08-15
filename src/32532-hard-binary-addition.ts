/*
  32532 - Binary Addition
  -------
  by Finley Garton (@finleygn) #hard #recursion #array

  ### Question

  Implement `BinaryAdd` to add two binary numbers together. The numbers should not be translated out of binary at any point.

  Note the two inputs will always have the same length.

  > View on GitHub: https://tsch.js.org/32532
*/

/* _____________ Your Code Here _____________ */

// type Bit = 1 | 0

// type BinaryAdd<A extends Bit[], B extends Bit[]> = any

type Bit = 1 | 0

type BinaryAdd<A extends Bit[], B extends Bit[], _Carry extends Bit = 0> =
  A['length'] extends 0
    ? _Carry extends 1 ? [1] : []
    : [A, B] extends [[...infer RestA extends Bit[], infer LastA extends Bit], [...infer RestB extends Bit[], infer LastB extends Bit]]
      ? [...BinaryAdd<RestA, RestB, Carry<[LastA, LastB, _Carry]>>, XOr<_Carry, XOr<LastA, LastB>>]
      : never

type XOr<A extends Bit, B extends Bit> = A extends B ? 0 : 1
type Carry<T extends Bit[]> = Reject<T, 0>['length'] extends 0 | 1 ? 0 : 1
type Reject<T extends any[], K> = T extends [infer Head, ...infer Rest]
  ? Head extends K ? Reject<Rest, K> : [Head, ...Reject<Rest, K>]
  : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<
    BinaryAdd<[1], [1]>,
    [1, 0]
  >>,
  Expect<Equal<
    BinaryAdd<[0], [1]>,
    [1]
  >>,
  Expect<Equal<
    BinaryAdd<[1, 1, 0], [0, 0, 1]>,
    [1, 1, 1]
  >>,
  Expect<Equal<
    BinaryAdd<[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]>,
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
  >>,
  Expect<Equal<
    BinaryAdd<[1, 0, 1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 1, 0, 0]>,
    [1, 0, 0, 1, 1, 1, 0, 1, 0]
  >>,
]
