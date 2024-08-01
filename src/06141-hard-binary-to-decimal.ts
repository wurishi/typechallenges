/*
  6141 - Binary to Decimal
  -------
  by wotsushi (@wotsushi) #hard #math

  ### Question

  Implement `BinaryToDecimal<S>` which takes an exact string type `S` consisting 0 and 1 and returns an exact number type corresponding with `S` when `S` is regarded as a binary.
  You can assume that the length of `S` is equal to or less than 8 and `S` is not empty.

  ```ts
  type Res1 = BinaryToDecimal<'10'>; // expected to be 2
  type Res2 = BinaryToDecimal<'0011'>; // expected to be 3
  ```

  > View on GitHub: https://tsch.js.org/6141
*/

/* _____________ Your Code Here _____________ */

// type BinaryToDecimal<S extends string> = any

// type BinaryToDecimal<
// S extends string,
// R extends any[] = []
// > = S extends `${infer F}${infer L}`
//     ? F extends '0'
//         ? BinaryToDecimal<L, [...R, ...R]>
//         : BinaryToDecimal<L, [...R, ...R, 1]>
//     : R['length']

type StringToTuple<S extends string> = S extends `${infer F}${infer R}`
    ? [F, ...StringToTuple<R>]
    : []

type Convert<
T extends string[],
Arr extends number[] = [1],
Res extends number[] = []
> = T extends [...infer F extends string[], infer L]
    ? L extends '1'
        ? Convert<F, [...Arr, ...Arr], [...Res, ...Arr]>
        : Convert<F, [...Arr, ...Arr], Res>
    : Res['length']

type BinaryToDecimal<S extends string> = Convert<StringToTuple<S>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<BinaryToDecimal<'10'>, 2>>,
  Expect<Equal<BinaryToDecimal<'0011'>, 3>>,
  Expect<Equal<BinaryToDecimal<'00000000'>, 0>>,
  Expect<Equal<BinaryToDecimal<'11111111'>, 255>>,
  Expect<Equal<BinaryToDecimal<'10101010'>, 170>>,
]
