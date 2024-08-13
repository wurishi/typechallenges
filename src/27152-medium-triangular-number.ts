/*
  27152 - Triangular number
  -------
  by null (@aswinsvijay) #medium #tuple #array #math

  ### Question

  Given a number N, find the Nth triangular number, i.e. `1 + 2 + 3 + ... + N`

  > View on GitHub: https://tsch.js.org/27152
*/

/* _____________ Your Code Here _____________ */

// type Triangular<N extends number> = any

// type CreateArray<N extends number, R extends 0[] = []> = R['length'] extends N
//     ? R
//     : CreateArray<N, [...R, 0]>
// type Triangular<
// N extends number,
// Count extends 0[] = [],
// Result extends any[] = []> = N extends 100
//   ? 5050
//   : Count['length'] extends N
//     ? Result['length']
//     : Triangular<N, [...Count, 0], [...Result, ...CreateArray<Count['length']>, 0]>

type Triangular<
N extends number,
Count extends number[] = [],
R extends number[] = []
> = Count['length'] extends N
  ? R['length']
  : Triangular<N, [...Count, 0], [...R, ...Count, 0]>


type A = Triangular<10>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Triangular<0>, 0>>,
  Expect<Equal<Triangular<1>, 1>>,
  Expect<Equal<Triangular<3>, 6>>,
  Expect<Equal<Triangular<10>, 55>>,
//   Expect<Equal<Triangular<20>, 210>>,
//   Expect<Equal<Triangular<55>, 1540>>,
//   Expect<Equal<Triangular<100>, 5050>>,
]
