/*
  30575 - BitwiseXOR
  -------
  by jiangshan (@jiangshanmeta) #hard

  ### Question

  Implement ```BitwiseXOR<S1,S2>``` which takes two binary string literal type and returns a binary string that reprents the bitwise XOR of S1 and S2

  For example:

  ```typescript
  BitwiseXOR<'0','1'> // expect '1'
  BitwiseXOR<'1','1'> // expect '0'
  BitwiseXOR<'10','1'>  // expect '11'
  ```

  > View on GitHub: https://tsch.js.org/30575
*/

/* _____________ Your Code Here _____________ */

// type BitwiseXOR<S1 extends string, S2 extends string> = any

type XorLowestBit<S1 extends string, S2 extends string> =
[S1, S2] extends [`${string}0`, `${string}1`] | [`${string}1`, `${string}0`]
    ? '1'
    : '0'

type BitwiseXOR<S1 extends string, S2 extends string> =
S1 extends ''
    ? S2
    : S2 extends ''
        ? S1
        : [S1, S2] extends [`${infer Rest1}${'0' | '1'}`, `${infer Rest2}${'0' | '1'}`]
            ? `${BitwiseXOR<Rest1, Rest2>}${XorLowestBit<S1, S2>}`
            : never

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<BitwiseXOR<'0', '1'>, '1'>>,
  Expect<Equal<BitwiseXOR<'1', '1'>, '0'>>,
  Expect<Equal<BitwiseXOR<'10', '1'>, '11'>>,
  Expect<Equal<BitwiseXOR<'110', '1'>, '111'>>,
  Expect<Equal<BitwiseXOR<'101', '11'>, '110'>>,
]
