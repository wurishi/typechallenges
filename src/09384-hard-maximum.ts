/*
  9384 - Maximum
  -------
  by ch3cknull (@ch3cknull) #hard #array

  ### Question

  ### Description

  Implement the type `Maximum`, which takes an input type `T`, and returns the maximum value in `T`.

  If `T` is an empty array, it returns `never`. **Negative numbers** are not considered.

  For example:

  ```ts
  Maximum<[]> // never
  Maximum<[0, 2, 1]> // 2
  Maximum<[1, 20, 200, 150]> // 200
  ```

  ### Advanced

  Can you implement type `Minimum` inspired by `Maximum`?

  > View on GitHub: https://tsch.js.org/9384
*/

/* _____________ Your Code Here _____________ */

// type Maximum<T extends any[]> = any

// " 1|20|200|150 extends 20 ? never : U " ==>> " 1|200|150 "
type Maximum<T extends any[], U = T[number], N extends any[] = []> =
T extends []
    ? never
    : Equal<U, N['length']> extends true
        ? U
        : Maximum<T, (U extends N['length'] ? never : U), [...N, any]>

type T1 = Maximum<[0, 2, 1]>
type T2 = Maximum<[0, 7, 3, 5, 9, 2, 4, 6]>

type Test<U, T extends any[]> = Equal<U, T[number]>
type T3 = Test<1, [1]>

type Foo<U, N> = U extends N ? never : U
type T4 = Foo<1 | 2 | 3, 2>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Maximum<[]>, never>>,
  Expect<Equal<Maximum<[0, 2, 1]>, 2>>,
  // Expect<Equal<Maximum<[1, 20, 200, 150]>, 200>>,
]
