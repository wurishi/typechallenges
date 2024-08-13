/*
  25270 - Transpose
  -------
  by Apollo Wayne (@Shinerising) #medium #array #math

  ### Question

  The transpose of a matrix is an operator which flips a matrix over its diagonal; that is, it switches the row and column indices of the matrix A by producing another matrix, often denoted by A<sup>T</sup>.

  ```ts
  type Matrix = Transpose <[[1]]>; // expected to be [[1]]
  type Matrix1 = Transpose <[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
  type Matrix2 = Transpose <[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
  ```

  > View on GitHub: https://tsch.js.org/25270
*/

/* _____________ Your Code Here _____________ */

// type Transpose<M extends number[][]> = any

// type My<T extends number[], U extends number[][]> = {
//     [K in keyof T]: [T[K], ...(K extends keyof U ? U[K] : never)]
// }
// type A = My<[1, 2, 3], [[10], [10], [10]]>
// type Transpose<M extends number[][], R extends number[][] = []> = 
// M extends [infer F extends number[], ...infer Rest extends number[][]]
//     ? Transpose<Rest, My<F, R>>
//     : M
// type T1 = Transpose<[[1]]>

// type Transpose<M extends number[][], R = M['length'] extends 0 ? [] : M[0]> =
// {
//     [X in keyof R]: {
//         [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never
//     }
// }

type Temp<M extends number[][], Index extends number> = 
M extends [infer F extends number[], ...infer Rest extends number[][]]
    ? [F[Index], ...Temp<Rest, Index>]
    : []
// type Transpose<M extends number[][], Count extends any[] = []> =
// M extends [infer F extends number[], ...any]
//     ? F['length'] extends Count['length']
//         ? []
//         : [Temp<M, Count['length']>, ...Transpose<M, [...Count, any]>]
//     : []
type Transpose<
M extends number[][], 
Count extends 0[] = [],
F extends number[] = M['length'] extends 0 ? [] : M[0]
> = F['length'] extends Count['length']
    ? []
    : [Temp<M, Count['length']>, ...Transpose<M, [...Count, 0]>]


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>, [[1, 4, 7], [2, 5, 8], [3, 6, 9]]>>,
]
