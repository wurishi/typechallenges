/*
  274 - Integers Comparator
  -------
  by Pig Fang (@g-plane) #extreme #template-literal #math

  ### Question

  Implement a type-level integers comparator. We've provided an enum for indicating the comparison result, like this:

  - If `a` is greater than `b`, type should be `Comparison.Greater`.
  - If `a` and `b` are equal, type should be `Comparison.Equal`.
  - If `a` is lower than `b`, type should be `Comparison.Lower`.

  **Note that `a` and `b` can be positive integers or negative integers or zero, even one is positive while another one is negative.**

  > View on GitHub: https://tsch.js.org/274
*/

/* _____________ Your Code Here _____________ */

enum Comparison {
    Greater,
    Equal,
    Lower,
}

// type Comparator<A extends number, B extends number> = any

type Digits<T extends string, S extends 0[][] = [], N extends 0[] = []> =
    T extends ''
        ? S
        : T extends `${infer F}${infer R}`
            ? `${N['length']}` extends F
                ? Digits<R, [...S, N], []>
                : Digits<T, S, [...N, 0]>
            : any

type CompareLength<A extends 0[][], B extends 0[][], I extends 0[] = []> =
    A[I['length']] extends 0[]
        ? B[I['length']] extends 0[]
            ? CompareLength<A, B, [0, ...I]>
            : Comparison.Greater
        : B[I['length']] extends 0[]
            ? Comparison.Lower
            : Comparison.Equal

type CompareDigits<A extends 0[][], B extends 0[][], N extends boolean = false, I extends 0[] = [], C extends 0[] = []> =
    A[I['length']] extends 0[] 
        ? C['length'] extends A[I['length']]['length']
            ? C['length'] extends B[I['length']]['length']
                ? CompareDigits<A, B, N, [0, ...I], []>
                : N extends false
                    ? Comparison.Lower
                    : Comparison.Greater
            : C['length'] extends B[I['length']]['length']
                ? N extends false
                    ? Comparison.Greater
                    : Comparison.Lower
                : CompareDigits<A, B, N, I, [0, ...C]>
        : Comparison.Equal


type Comparator<
    A extends number,
    B extends number
> =
    A extends B 
        ? Comparison.Equal
        : `${A}` extends `-${infer a}` 
            ? `${B}` extends `-${infer b}`
                ? CompareLength<Digits<`${a}`>, Digits<`${b}`>> extends Comparison.Equal
                    ? CompareDigits<Digits<`${a}`>, Digits<`${b}`>, true>
                    : CompareLength<Digits<`${a}`>, Digits<`${b}`>> extends Comparison.Greater 
                        ? Comparison.Lower
                        : Comparison.Greater
                : Comparison.Lower
            : `${B}` extends `-${any}`
                ? Comparison.Greater
                : CompareLength<Digits<`${A}`>, Digits<`${B}`>> extends Comparison.Equal 
                    ? CompareDigits<Digits<`${A}`>, Digits<`${B}`>>
                    : CompareLength<Digits<`${A}`>, Digits<`${B}`>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
    Expect<Equal<Comparator<5, 5>, Comparison.Equal>>,
    Expect<Equal<Comparator<5, 6>, Comparison.Lower>>,
    Expect<Equal<Comparator<5, 8>, Comparison.Lower>>,
    Expect<Equal<Comparator<5, 0>, Comparison.Greater>>,
    Expect<Equal<Comparator<-5, 0>, Comparison.Lower>>,
    Expect<Equal<Comparator<0, 0>, Comparison.Equal>>,
    Expect<Equal<Comparator<0, -5>, Comparison.Greater>>,
    Expect<Equal<Comparator<5, -3>, Comparison.Greater>>,
    Expect<Equal<Comparator<5, -7>, Comparison.Greater>>,
    Expect<Equal<Comparator<-5, -7>, Comparison.Greater>>,
    Expect<Equal<Comparator<-5, -3>, Comparison.Lower>>,
    Expect<Equal<Comparator<-25, -30>, Comparison.Greater>>,
    Expect<Equal<Comparator<15, -23>, Comparison.Greater>>,
    Expect<Equal<Comparator<40, 37>, Comparison.Greater>>,
    Expect<Equal<Comparator<-36, 36>, Comparison.Lower>>,
    Expect<Equal<Comparator<27, 27>, Comparison.Equal>>,
    Expect<Equal<Comparator<-38, -38>, Comparison.Equal>>,

    Expect<Equal<Comparator<1, 100>, Comparison.Lower>>,
    Expect<Equal<Comparator<100, 1>, Comparison.Greater>>,
    Expect<Equal<Comparator<-100, 1>, Comparison.Lower>>,
    Expect<Equal<Comparator<1, -100>, Comparison.Greater>>,
    Expect<Equal<Comparator<-100, -1>, Comparison.Lower>>,
    Expect<Equal<Comparator<-1, -100>, Comparison.Greater>>,

    // Extra tests if you like to challenge yourself!
    Expect<Equal<Comparator<9007199254740992, 9007199254740992>, Comparison.Equal>>,
    Expect<Equal<Comparator<-9007199254740992, -9007199254740992>, Comparison.Equal>>,
    Expect<Equal<Comparator<9007199254740991, 9007199254740992>, Comparison.Lower>>,
    Expect<Equal<Comparator<9007199254740992, 9007199254740991>, Comparison.Greater>>,
    Expect<Equal<Comparator<-9007199254740992, -9007199254740991>, Comparison.Lower>>,
    Expect<Equal<Comparator<-9007199254740991, -9007199254740992>, Comparison.Greater>>,
]
