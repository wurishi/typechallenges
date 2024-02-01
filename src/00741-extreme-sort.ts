/*
  741 - Sort
  -------
  by Sg (@suica) #extreme #infer #array

  ### Question

  In this challenge, you are required to sort natural number arrays in either ascend order or descent order.

  Ascend order examples:
  ```ts
  Sort<[]> // []
  Sort<[1]> // [1]
  Sort<[2, 4, 7, 6, 6, 6, 5, 8, 9]> //  [2, 4, 5, 6, 6, 6, 7, 8, 9]
  ```

  The `Sort` type should also accept a boolean type. When it is `true`, the sorted result should be in descent order. Some examples:

  ```ts
  Sort<[3, 2, 1], true> // [3, 2, 1]
  Sort<[3, 2, 0, 1, 0, 0, 0], true> // [3, 2, 1, 0, 0, 0, 0]
  ```

  Extra challenges:
  1. Support natural numbers with 15+ digits.
  2. Support float numbers.

  > View on GitHub: https://tsch.js.org/741
*/

/* _____________ Your Code Here _____________ */

// type Sort = any

// type Sort<A extends number[], D extends boolean = false> = 
//     A extends [infer A0 extends number, infer A1 extends number, ...infer AR extends number[]]
//         ? Split<[A1, ...AR], A0> extends [infer Lower extends number[], infer Higher extends number[]]
//             ? D extends true
//                 ? [...Sort<Higher, D>, A0, ...Sort<Lower, D>]
//                 : [...Sort<Lower, D>, A0, ...Sort<Higher, D>]
//             : never
//         : A
// type Split<A extends number[], M extends number, Lower extends number[] = [], Higher extends number[] = []> = 
//     A extends [infer H extends number, ...infer T extends number[]]
//         ? IsLower<H, M> extends true
//             ? Split<T, M, [...Lower, H], Higher>
//             : Split<T, M, Lower, [...Higher, H]>
//         : [Lower, Higher]
// ;
// // type IsLower<A extends number, B extends number> = '0123456789' extends `${string}${A}${string}${B}${string}`
// //     ? true
// //     : false
// // 支持BigInt等
// type IsLower<A extends number, B extends number> = Comparator<A, B> extends 'Lower' ? true : false

// type Comparator<A extends number, B extends number>
//   = `${A}` extends `-${infer AbsA}`
//     ? `${B}` extends `-${infer AbsB}`
//       ? ComparePositives<AbsB, AbsA>
//       : 'Lower'
//     : `${B}` extends `-${number}`
//       ? 'Greater'
//       : ComparePositives<`${A}`, `${B}`>

// type ComparePositives<A extends string, B extends string, ByLength = CompareByLength<A, B>>
//   = ByLength extends 'Equal'
//     ? CompareByDigits<A, B>
//     : ByLength

// type CompareByLength<A extends string, B extends string>
//   = A extends `${infer AF}${infer AR}`
//     ? B extends `${infer BF}${infer BR}`
//       ? CompareByLength<AR, BR>
//       : 'Greater'
//     : B extends `${infer BF}${infer BR}`
//       ? 'Lower'
//       : 'Equal'

// type CompareByDigits<A extends string, B extends string>
//   = `${A}|${B}` extends `${infer AF}${infer AR}|${infer BF}${infer BR}`
//     ? CompareDigits<AF, BF> extends 'Equal'
//       ? CompareByDigits<AR, BR>
//       : CompareDigits<AF, BF>
//     : 'Equal'

// type CompareDigits<A extends string, B extends string>
//   = A extends B
//     ? 'Equal'
//     : '0123456789' extends `${string}${A}${string}${B}${string}`
//       ? 'Lower'
//       : 'Greater'

// bubble
type Sort<A extends any[],B2S extends boolean = false> = B2S extends true ? Reverse<BubbleSort<A>> : BubbleSort<A>

type BubbleSort<A extends any[],T extends number = 0> = T extends A['length'] ? A : BubbleSort<BubbleSortOnce<A>,AddOne<T> & number>
type BubbleSortOnce<A extends any[]> = A extends [infer X,infer Y,...infer Rest] ? GreaterThan<X & number,Y & number> extends true ? [Y,...BubbleSort<[X,...Rest]>] : [X,...BubbleSort<[Y,...Rest]>] : A
type GreaterThan<T extends number,U extends number> = NumberToArray<T> extends [...NumberToArray<U>,1,...infer R] ? true : false
type NumberToArray<N extends number, A extends any[] = []> = A['length'] extends N ? A : NumberToArray<N,[...A,1]>
type AddOne<N extends number> = [1,...NumberToArray<N>]['length']
type Reverse<A extends any[]> = A extends [infer X,...infer R] ? [...Reverse<R>,X] : []

type t0 = Sort<[2, 1, 3], true>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Sort<[]>, []>>,
  Expect<Equal<Sort<[1]>, [1]>>,
  Expect<Equal<Sort<[2, 1]>, [1, 2]>>,
  Expect<Equal<Sort<[0, 0, 0]>, [0, 0, 0]>>,
  Expect<Equal<Sort<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 1]>, [1, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 1, 2]>, [1, 2, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 0, 1, 0, 0, 0]>, [0, 0, 0, 0, 1, 2, 3]>>,
  Expect<Equal<Sort<[2, 4, 7, 6, 6, 6, 5, 8, 9]>, [2, 4, 5, 6, 6, 6, 7, 8, 9]>>,
  Expect<Equal<Sort<[1, 1, 2, 1, 1, 1, 1, 1, 1]>, [1, 1, 1, 1, 1, 1, 1, 1, 2]>>,
  Expect<Equal<Sort<[], true>, []>>,
  Expect<Equal<Sort<[1], true>, [1]>>,
  Expect<Equal<Sort<[2, 1], true>, [2, 1]>>,
  Expect<Equal<Sort<[0, 0, 0], true>, [0, 0, 0]>>,
  Expect<Equal<Sort<[1, 2, 3], true>, [3, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 1], true>, [3, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 1, 2], true>, [3, 2, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 0, 1, 0, 0, 0], true>, [3, 2, 1, 0, 0, 0, 0]>>,
  Expect<Equal<Sort<[2, 4, 7, 6, 6, 6, 5, 8, 9], true>, [9, 8, 7, 6, 6, 6, 5, 4, 2]>>,
]
