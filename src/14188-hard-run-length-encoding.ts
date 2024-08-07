/*
  14188 - Run-length encoding
  -------
  by Hen Hedymdeith (@alfaproxima) #hard

  ### Question

  Given a `string` sequence of a letters f.e. `AAABCCXXXXXXY`. Return run-length encoded string `3AB2C6XY`.
  Also make a decoder for that string.

  > View on GitHub: https://tsch.js.org/14188
*/

/* _____________ Your Code Here _____________ */

namespace RLE {
    // export type Encode<S extends string> = any
    // export type Decode<S extends string> = any

    // export type Encode<
    //     S extends string,
    //     _Last extends string = '',
    //     _Length extends 0[] = [0],
    //     _Result extends string = ''
    // > = S extends `${infer F}${infer Rest}`
    //     ? _Last extends ''
    //         ? Encode<S, F>
    //         : F extends _Last
    //             ? Encode<Rest, _Last, [..._Length, 0], `${_Length['length'] extends 1 ? '' : _Length['length']}${F}`>
    //             : `${_Result}${Encode<S>}`
    //     : _Result

    type Help<Count extends unknown[], S extends string> = 
    Count['length'] extends 1
      ? S
      : `${Count['length']}${S}`

    export type Encode<
        S extends string,
        Last extends string = '',
        Count extends 0[] = [],
        Result extends string = ''
    > = S extends `${infer F}${infer Rest}`
        ? Last extends ''
            ? Encode<Rest, F, [0], Result>
            : F extends Last
                ? Encode<Rest, Last, [...Count, 0], Result>
                : Encode<Rest, F, [0], `${Result}${Help<Count, Last>}`>
        : `${Result}${Help<Count, Last>}`
    
    export type Decode<
    S extends string,
    Count extends 0[] = [],
    Result extends string = ''
    > = S extends `${infer N extends number}${infer C}${infer Rest}`
      ? Count['length'] extends N
        ? Decode<Rest, [], Result>
        : Decode<S, [...Count, 0], `${Result}${C}`>
      : S extends `${infer C}${infer Rest}`
        ? Decode<Rest, [], `${Result}${C}`>
        : Result
}

type A = RLE.Encode<'AAABCCXXXXXXYY'>
type B = RLE.Decode<'3AB2C6XY'>

type Test<S extends string> = S extends `${infer A extends number}${infer B}${string}`
  ? `${A}:${B}`
  : S
type T1 = Test<'abcd'>
type T2 = Test<'1abc'>
  
  /* _____________ Test Cases _____________ */
  import type { Equal, Expect } from '@type-challenges/utils'
  
  type cases = [
    // Raw string -> encoded string
    Expect<Equal<RLE.Encode<'AAABCCXXXXXXY'>, '3AB2C6XY'>>,
  
    // Encoded string -> decoded string
    Expect<Equal<RLE.Decode<'3AB2C6XY'>, 'AAABCCXXXXXXY'>>,
  ]
  