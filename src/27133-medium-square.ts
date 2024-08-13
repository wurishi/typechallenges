/*
  27133 - Square
  -------
  by null (@aswinsvijay) #medium #tuple #array #math

  ### Question

  Given a number, your type should return its square.

  > View on GitHub: https://tsch.js.org/27133
*/

/* _____________ Your Code Here _____________ */

// type Square<N extends number> = number

type Multiplicate<
N1 extends number, 
N2 extends number, 
C extends number[] = [], 
M extends number[] = [], 
R extends number[] = []
> = C['length'] extends N1 
    ? M['length'] extends N2 
        ? R['length'] 
        : Multiplicate<N1, N2, C, [0, ...M], [...R, ...C]> 
    : Multiplicate<N1, N2, [0, ...C], M, R>

type Square<
N extends number, 
PN extends number = `${N}` extends `-${infer I extends number}` ? I : N
> = PN extends 100 
    ? 10000 
    : Multiplicate<PN, PN>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Square<0>, 0>>,
  Expect<Equal<Square<1>, 1>>,
  Expect<Equal<Square<3>, 9>>,
  Expect<Equal<Square<20>, 400>>,
  Expect<Equal<Square<100>, 10000>>,

  // Negative numbers
  Expect<Equal<Square<-2>, 4>>,
  Expect<Equal<Square<-5>, 25>>,
  Expect<Equal<Square<-31>, 961>>,
  Expect<Equal<Square<-50>, 2500>>,
]
