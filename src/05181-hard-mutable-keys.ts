/*
  5181 - Mutable Keys
  -------
  by Yugang Cao (@Talljack) #hard #utils

  ### Question

  Implement the advanced util type MutableKeys<T>, which picks all the mutable (not readonly) keys into a union.

  For example:

  ```ts
  type Keys = MutableKeys<{ readonly foo: string; bar: number }>;
  // expected to be “bar”
  ```

  > View on GitHub: https://tsch.js.org/5181
*/

/* _____________ Your Code Here _____________ */

// type MutableKeys<T> = any

// type MutableKeys<T> = keyof {
//     [P in keyof T as Equal<{ [K in P]: T[K]}, { -readonly [K in P]: T[K]}> extends true ? P : never]: any
// };

type MutableKeys<T> = keyof {
    [P in keyof T as Equal<Pick<T, P>, Readonly<Pick<T, P>>> extends false ? P : never]: any
}

type A = MutableKeys<{ a: undefined, readonly b?: undefined, c: string, d: null }>
type B = MutableKeys<{ a: number, readonly b: string }>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MutableKeys<{ a: number, readonly b: string }>, 'a'>>,
  Expect<Equal<MutableKeys<{ a: undefined, readonly b: undefined }>, 'a'>>,
  Expect<Equal<MutableKeys<{ a: undefined, readonly b?: undefined, c: string, d: null }>, 'a' | 'c' | 'd'>>,
  Expect<Equal<MutableKeys<{}>, never>>,
]
