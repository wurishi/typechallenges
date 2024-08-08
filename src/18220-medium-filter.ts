/*
  18220 - Filter
  -------
  by Muhun Kim (@x86chi) #medium #array #filter

  ### Question

  Implement the type `Filter<T, Predicate>` takes an Array `T`, primitive type or union primitive type `Predicate` and returns an Array include the elements of `Predicate`.

  > View on GitHub: https://tsch.js.org/18220
*/

/* _____________ Your Code Here _____________ */

// type Filter<T extends any[], P> = []

// type Filter<T extends any[], P, R extends any[] = []> = T extends [infer F, ...infer Rest]
//     ? F extends P
//         ? Filter<Rest, P, [...R, F]>
//         : Filter<Rest, P, R>
//     : R

type Filter<T extends any[], P> = T extends [infer F, ...infer Rest]
    ? F extends P
        ? [F, ...Filter<Rest, P>]
        : Filter<Rest, P>
    : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Falsy = false | 0 | '' | null | undefined

type cases = [
  Expect<Equal<Filter<[0, 1, 2], 2>, [2]>>,
  Expect<Equal<Filter<[0, 1, 2], 0 | 1>, [0, 1]>>,
  Expect<Equal<Filter<[0, 1, 2], Falsy>, [0]>>,
]
