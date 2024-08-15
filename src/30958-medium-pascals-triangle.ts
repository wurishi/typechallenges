/*
  30958 - Pascal's triangle
  -------
  by Aswin S Vijay (@aswinsvijay) #medium #array #math

  ### Question

  Given a number N, construct the Pascal's triangle with N rows.
  [Wikipedia](https://en.wikipedia.org/wiki/Pascal%27s_triangle)

  > View on GitHub: https://tsch.js.org/30958
*/

/* _____________ Your Code Here _____________ */

// type Pascal<N extends number> = any

type GetLast<T extends number[][]> = T extends [...any,infer L extends number[]]?L:never;

type ToTuple<T extends number,R extends number[] = []> = R['length'] extends T? R: ToTuple<T,[...R,0]>

type Sum<T extends number,U extends number> = [...ToTuple<T>,...ToTuple<U>]['length']

type GenRow<
  T extends number[],
  R extends number[] = [1]
> = 
  T extends [infer F extends number,infer S extends number,...infer L extends number[]]?
    [Sum<F,S>] extends [infer A extends number]?

      GenRow<[S,...L],[...R,A]>:never
    :[...R,1]

type Pascal<
  N extends number, 
  R extends number[][] = [[1]]
> = 
  R['length'] extends N?
    R:
    Pascal<N,[...R,GenRow<GetLast<R>>]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<
    Equal<
      Pascal<1>,
      [
        [1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<3>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<5>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<7>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
        [1, 5, 10, 10, 5, 1],
        [1, 6, 15, 20, 15, 6, 1],
      ]
    >
  >,
]
