/*
  4425 - Greater Than
  -------
  by ch3cknull (@ch3cknull) #medium #array

  ### Question

  In This Challenge, You should implement a type `GreaterThan<T, U>` like `T > U`

  Negative numbers do not need to be considered.

  For example

  ```ts
  GreaterThan<2, 1> //should be true
  GreaterThan<1, 1> //should be false
  GreaterThan<10, 100> //should be false
  GreaterThan<111, 11> //should be true
  ```

  Good Luck!

  > View on GitHub: https://tsch.js.org/4425
*/

/* _____________ Your Code Here _____________ */

// type GreaterThan<T extends number, U extends number> = any

// 递归
// type GreaterThan<
// T extends number,
// U extends number,
// A extends unknown[] = []
// > = T extends A['length']
//     ? false
//     : U extends A['length']
//         ? true
//         : GreaterThan<T, U, [...A, unknown]>

// 构造数组
// type NewArr<T extends number, A extends any[] = []> = 
// A['length'] extends T
//   ? A
//   : NewArr<T, [...A, '']>
// type A1 = NewArr<3>
// type GreaterArr<T extends any[], U extends any[]> = 
// U extends [...T, ...any]
//   ? false
//   : true
// type B1 = GreaterArr<[1, 1], [1, 1, 1]>
// type GreaterThan<T extends number, U extends number> = 
// GreaterArr<NewArr<T>, NewArr<U>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  // Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]
