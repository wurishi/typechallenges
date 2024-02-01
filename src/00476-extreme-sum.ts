/*
  476 - Sum
  -------
  by null (@uid11) #extreme #math #template-literal

  ### Question

  Implement a type `Sum<A, B>` that summing two non-negative integers and returns the sum as a string. Numbers can be specified as a string, number, or bigint.

  For example,

  ```ts
  type T0 = Sum<2, 3> // '5'
  type T1 = Sum<'13', '21'> // '34'
  type T2 = Sum<'328', 7> // '335'
  type T3 = Sum<1_000_000_000_000n, '123'> // '1000000000123'
  ```

  > View on GitHub: https://tsch.js.org/476
*/

/* _____________ Your Code Here _____________ */

// type Sum<A extends string | number | bigint, B extends string | number | bigint> = string

type DigitStringToArray<S extends string, R extends any[] = []> =
    S extends '' ? R : (`${R['length']}` extends S ? R : DigitStringToArray<S, [...R, 1]>)
type Mod10<T extends any[]> = T extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8, infer A9, infer A10, ...infer R] ? [R, [1]] : [T, []]
type NumberStringToArray<S extends string> = S extends `${infer L}${infer R}` ? [DigitStringToArray<L>, ...NumberStringToArray<R>] : DigitStringToArray<S>
type ArrayToDigitString<T extends any[], R extends string = ''> = T[0] extends undefined ? R : ArrayToDigitString<Next<ToAnyArray<T>>, `${R}${T[0]['length']}`>;
type ReverseString<S extends string, R extends string = ''> = S extends `${infer A}${infer B}` ? ReverseString<B, `${A}${R}`> : R
type SumHelper<A extends any[], B extends any[], R extends any[] = [], K extends any[] = []> =
    A[0] extends undefined ?
        (B[0] extends undefined ?
            (K extends [1] ? [[1], ...R] : R)
            : SumHelper<B, A, R, K>)
        :
        (B[0] extends undefined ? SumHelper<Next<A>, [], [Mod10<[...K, ...A[0]]>[0], ...R], Mod10<[...K, ...A[0]]>[1]> :
            (SumHelper<Next<A>, Next<B>, [Mod10<[...K, ...A[0], ...B[0]]>[0], ...R], Mod10<[...K, ...A[0], ...B[0]]>[1]>)
            )
type Next<T extends any[]> = T extends [infer A, ...infer R] ? R : []
type ToAnyArray<T> = T extends any[] ? T : never
type Sum<A extends string | number | bigint, B extends string | number | bigint> = ArrayToDigitString<SumHelper<NumberStringToArray<ReverseString<`${A}`>>, NumberStringToArray<ReverseString<`${B}`>>>>

type t0 = Sum<2, 3>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Sum<2, 3>, '5'>>,
  Expect<Equal<Sum<'13', '21'>, '34'>>,
  Expect<Equal<Sum<'328', 7>, '335'>>,
  Expect<Equal<Sum<1_000_000_000_000n, '123'>, '1000000000123'>>,
  Expect<Equal<Sum<9999, 1>, '10000'>>,
  Expect<Equal<Sum<4325234, '39532'>, '4364766'>>,
  Expect<Equal<Sum<728, 0>, '728'>>,
  Expect<Equal<Sum<'0', 213>, '213'>>,
  Expect<Equal<Sum<0, '0'>, '0'>>,
]
