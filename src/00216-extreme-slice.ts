/*
  216 - Slice
  -------
  by Anthony Fu (@antfu) #extreme #array

  ### Question

  Implement the JavaScript `Array.slice` function in the type system. `Slice<Arr, Start, End>` takes the three argument. The output should be a subarray of `Arr` from index `Start` to `End`. Indexes with negative numbers should be counted from reversely.

  For example

  ```ts
  type Arr = [1, 2, 3, 4, 5]
  type Result = Slice<Arr, 2, 4> // expected to be [3, 4]
  ```

  > View on GitHub: https://tsch.js.org/216
*/

/* _____________ Your Code Here _____________ */

// type Slice<Arr, Start, End> = any
// type Slice<Arr extends unknown[], Start extends number = 0, End extends number = Arr['length']> = 
//     InitialN<Arr, ToPositive<End, Arr>> extends [...InitialN<Arr, ToPositive<Start, Arr>, ...infer Rest]
//         ? Rest
//         : []

// type InitialN<Arr extends unknown[], N extends number, _Acc extends unknown[] = []> =  
//     _Acc['length'] extends N | Arr['length']
//         ? _Acc
//         : InitialN<Arr, N, [..._Acc, Arr[_Acc['length']]]>

// type ToPositive<N extends number, Arr extends unknown[]> = `${N}` extends `-${infer P extends number}`
//     ? Slice<Arr, P>['length']
//     : N

type Slice<Arr extends unknown[], Start extends number = 0, End extends number = Arr['length']>
    = SliceIndex<SliceIndex<Arr, End>[0], SliceIndex<Arr, Start>[0]['length']>[1]

type SliceIndex<Arr extends unknown[], Index extends number> = 
    IsNegative<Index> extends false
        ? SliceLeft<Arr, Index>
        : SliceRight<Arr, Absolute<Index>>

type Absolute<T extends string | number | bigint> = T extends string
    ? T extends `-${infer R}`
        ? R
        : T
    : Absolute<`${T}`>

type IsNegative<T extends number> = `${T}` extends `-${infer _}` ? true : false

type SliceLeft<Arr extends unknown[], Index extends number, Tail extends unknown[] = []> = 
    Tail['length'] extends Index
        ? [Tail, Arr]
        : Arr extends [infer Head, ...infer Rest]
            ? SliceLeft<Rest, Index, [...Tail, Head]>
            : [Tail, []]

type SliceRight<Arr extends unknown[], Index extends string, Tail extends unknown[] = []> = 
    `${Tail['length']}` extends Index
        ? [Arr, Tail]
        : unknown extends Arr[0]
            ? [[], Tail]
            : Arr extends [...infer Rest, infer Last]
                ? SliceRight<Rest, Index, [Last, ...Tail]>
                : [[], Tail]
        
/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Arr = [1, 2, 3, 4, 5]

type t1 = Slice<Arr, 0, 1>

type cases = [
  // basic
  Expect<Equal<Slice<Arr, 0, 1>, [1]>>,
  Expect<Equal<Slice<Arr, 0, 0>, []>>,
  Expect<Equal<Slice<Arr, 2, 4>, [3, 4]>>,

  // optional args
  Expect<Equal<Slice<[]>, []>>,
  Expect<Equal<Slice<Arr>, Arr>>,
  Expect<Equal<Slice<Arr, 0>, Arr>>,
  Expect<Equal<Slice<Arr, 2>, [3, 4, 5]>>,

  // negative index
  Expect<Equal<Slice<Arr, 0, -1>, [1, 2, 3, 4]>>,
  Expect<Equal<Slice<Arr, -3, -1>, [3, 4]>>,

  // invalid
  Expect<Equal<Slice<Arr, 10>, []>>,
  Expect<Equal<Slice<Arr, 1, 0>, []>>,
  Expect<Equal<Slice<Arr, 10, 20>, []>>,
]
