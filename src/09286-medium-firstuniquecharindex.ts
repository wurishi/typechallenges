/*
  9286 - FirstUniqueCharIndex
  -------
  by jiangshan (@jiangshanmeta) #medium #string

  ### Question

  Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

  > View on GitHub: https://tsch.js.org/9286
*/

/* _____________ Your Code Here _____________ */

// type FirstUniqueCharIndex<T extends string> = any

type FirstUniqueCharIndex<T extends string, A extends string[] = []> =
T extends ''
    ? -1
    : T extends `${infer F}${infer R}`
        ? F extends A[number]
            ? FirstUniqueCharIndex<R, [...A, F]>
            : R extends `${string}${F}${string}`
                ? FirstUniqueCharIndex<R, [...A, F]>
                : A['length']
        : never

type A = FirstUniqueCharIndex<'loveleetcode'>

type Test<T extends any[]> = T[number]
type T1 = Test<[1, 2, 1]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FirstUniqueCharIndex<'leetcode'>, 0>>,
  Expect<Equal<FirstUniqueCharIndex<'loveleetcode'>, 2>>,
  Expect<Equal<FirstUniqueCharIndex<'aabb'>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<''>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<'aaa'>, -1>>,
]
