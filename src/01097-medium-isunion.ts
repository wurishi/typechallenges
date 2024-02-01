/*
  1097 - IsUnion
  -------
  by null (@bencor) #medium #union

  ### Question

  Implement a type `IsUnion`, which takes an input type `T` and returns whether `T` resolves to a union type.

  For example:

  ```ts
  type case1 = IsUnion<string> // false
  type case2 = IsUnion<string | number> // true
  type case3 = IsUnion<[string | number]> // false
  ```

  > View on GitHub: https://tsch.js.org/1097
*/

/* _____________ Your Code Here _____________ */

// type IsUnion<T> = any

// 1: 将 U 转换为 Tuple，然后判断其长度即可
// type U2I<U> = (U extends any ? (u:U) => any : never) extends (i: infer I) => any ? I : never;
// type Last<U> = U2I<U extends any ? () => U : never> extends () => infer R ? R : never;
// type ToTuple<U> = [U] extends [never] ? [] : [Last<U>, ...ToTuple<Exclude<U, Last<U>>>];
// type IsUnion1<U, Count = ToTuple<U>['length']> = Count extends 0 ? false : Count extends 1 ? false : true;

// 2: 若 U 中仅包含一个，那么结果将是true/false中的一种，否则为 boolean
// type IsUnion2<U, U1 = U> = Equal<(U extends any 
//     ? U1 extends U 
//         ? true 
//         : false 
//     : false), boolean>

// 3: 
type IsUnion3<U, U1 = U> = [U] extends [never]
    ? false
    : (U extends any 
        ? [U1] extends [U] 
            ? false 
            : true 
        : never)

type IsUnion<U> = IsUnion3<U>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsUnion<string>, false>>,
  Expect<Equal<IsUnion<string | number>, true>>,
  Expect<Equal<IsUnion<'a' | 'b' | 'c' | 'd'>, true>>,
  Expect<Equal<IsUnion<undefined | null | void | ''>, true>>,
  Expect<Equal<IsUnion<{ a: string } | { a: number }>, true>>,
  Expect<Equal<IsUnion<{ a: string | number }>, false>>,
  Expect<Equal<IsUnion<[string | number]>, false>>,
  // Cases where T resolves to a non-union type.
  Expect<Equal<IsUnion<string | never>, false>>,
  Expect<Equal<IsUnion<string | unknown>, false>>,
  Expect<Equal<IsUnion<string | any>, false>>,
  Expect<Equal<IsUnion<string | 'a'>, false>>,
  Expect<Equal<IsUnion<never>, false>>,
]
