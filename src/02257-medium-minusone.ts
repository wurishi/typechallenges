/*
  2257 - MinusOne
  -------
  by Mustafo Faiz (@fayzzzm) #中等 #math

  ### 题目

  给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。

  例如:

  ```ts
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
  ```

  > 在 Github 上查看：https://tsch.js.org/2257/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type MinusOne<T extends number> = any
// 数字稍大就不行了
// type Tmp<A extends unknown[]> = A extends [unknown, ...infer R]
//     ? R : never
// type MinusOne<T, Arr extends unknown[] = []> = T extends Arr['length']
//     ? Tmp<Arr>['length']
//     : MinusOne<T, [...Arr, any]>

// type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
// type ConvertDigitToArray<N extends Digit, DigitArray extends any[] = []>
//   = `${DigitArray['length']}` extends N
//     ? DigitArray
//     : ConvertDigitToArray<N, [...DigitArray, 0]>
// type Multiply10<T extends any[]> = 
//   [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T]
// type ToArray<S extends string | number, T extends any[] = []>
//   = `${S}` extends `${infer F}${infer L}`
//     ? F extends Digit
//       ? ToArray<L, [...Multiply10<T>, ...ConvertDigitToArray<F>]>
//       : never
//     : T
// type Minus<S extends number, T extends number>
//   = ToArray<S> extends [...ToArray<T>, ...infer L]
//     ? L['length']
//     : 0
// type MinusOne<S extends number> = Minus<S, 1>

type ParseInt<T extends string> = T extends `${infer Digit extends number}` ? Digit : never
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : ''
type RemoveLeadingZeros<S extends string> = S extends '0'
  ? S
  : S extends `0${infer R}`
    ? RemoveLeadingZeros<R>
    : S
type InternalMinusOne<S extends string> = S extends `${infer Digit extends number}${infer Rest}`
  ? Digit extends 0
    ? `9${InternalMinusOne<Rest>}`
    : `${[9,0,1,2,3,4,5,6,7,8][Digit]}${Rest}`
  : never
// 无法处理<=0
// type MinusOne<T extends number> = ParseInt<RemoveLeadingZeros<ReverseString<InternalMinusOne<ReverseString<`${T}`>>>>>
type InternalPlusOne<S extends string> = S extends '9'
  ? '01'
  : S extends `${infer Digit extends number}${infer Rest}`
    ? Digit extends 9
      ? `0${InternalPlusOne<Rest>}`
      : `${[1,2,3,4,5,6,7,8,9][Digit]}${Rest}`
    : never
type PutSign<S extends string> = `-${S}`
type MinusOne<T extends number> = T extends 0
  ? -1
  : `${T}` extends `-${infer Abs}`
    ? ParseInt<PutSign<ReverseString<InternalPlusOne<ReverseString<`${Abs}`>>>>>
    : ParseInt<RemoveLeadingZeros<ReverseString<InternalMinusOne<ReverseString<`${T}`>>>>>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<0>, -1>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
]
