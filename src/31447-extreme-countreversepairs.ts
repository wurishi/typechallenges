/*
  31447 - CountReversePairs
  -------
  by jiangshan (@jiangshanmeta) #extreme

  ### Question

  Given an integer array nums, return the number of reverse pairs in the array.

  A reverse pair is a pair (i, j) where:

  * 0 <= i < j < nums.length and
  * nums[i] > nums[j].

  > View on GitHub: https://tsch.js.org/31447
*/

/* _____________ Your Code Here _____________ */

// type CountReversePairs<T extends number[]> = any

type SimpleGreaterThan<A extends number, B extends number, _StackA extends 1[] = [], _StackB extends 1[] = []> =
  `${A}${B}` extends `-${infer NA extends number}-${infer NB extends number}` ?
  SimpleGreaterThan<NB, NA> : //Negative
  `${A}` extends `-${number}` ? false : //only A Negative
  `${B}` extends `-${number}` ? true : //only B Negative
  _StackA[`length`] extends A | 999 ? false :
  _StackB[`length`] extends B | 999 ? true :
  SimpleGreaterThan<A, B, [..._StackA, 1], [..._StackB, 1]>;

type CountReversePairsOnce<T extends number, U extends number[], _Recorder extends 1[] = []> =
  U extends [infer F extends number, ...infer R extends number[]] ?
  CountReversePairsOnce<T, R, SimpleGreaterThan<T, F> extends true ? [..._Recorder, 1] : _Recorder> :
  _Recorder/*return*/;

type CountReversePairs<T extends number[], _Recorder extends 1[] = []> =
  T extends [infer F extends number, ...infer R extends number[]] ?
  CountReversePairs<R, [..._Recorder, ...CountReversePairsOnce<F, R>]> :
  _Recorder[`length`]/*return*/;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CountReversePairs<[5, 2, 6, 1]>, 4>>,
  Expect<Equal<CountReversePairs<[1, 2, 3, 4]>, 0>>,
  Expect<Equal<CountReversePairs<[-1, -1]>, 0>>,
  Expect<Equal<CountReversePairs<[-1]>, 0>>,
]
