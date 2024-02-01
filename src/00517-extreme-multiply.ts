/*
  517 - Multiply
  -------
  by null (@uid11) #extreme #math #template-literal

  ### Question

  **This challenge continues from [476 - Sum](https://tsch.js.org/476), it is recommended that you finish that one first, and modify your code based on it to start this challenge.**

  Implement a type `Multiply<A, B>` that multiplies two non-negative integers and returns their product as a string. Numbers can be specified as string, number, or bigint.

  For example,

  ```ts
  type T0 = Multiply<2, 3> // '6'
  type T1 = Multiply<3, '5'> // '15'
  type T2 = Multiply<'4', 10> // '40'
  type T3 = Multiply<0, 16> // '0'
  type T4 = Multiply<'13', '21'> // '273'
  type T5 = Multiply<'43423', 321543n> // '13962361689'
  ```

  > View on GitHub: https://tsch.js.org/517
*/

/* _____________ Your Code Here _____________ */

// type Multiply<A extends string | number | bigint, B extends string | number | bigint> = string

type Multiply1<A extends string | number | bigint, B extends string | number | bigint, AArr extends 0[] = [], BArr extends 0[] = [], Result extends 0[] = []> = 
    `${A}` extends `${AArr['length']}`
        ? `${B}` extends `${BArr['length']}`
            ? `${Result['length']}`
            : Multiply1<A, B, AArr, [...BArr, 0], [...Result, ...AArr]>
        : Multiply1<A, B, [...AArr, 0]>

type Reverse<A> = 
  `${A}` extends `${infer AH}${infer AT}` 
    ? `${Reverse<AT>}${AH}` : A

type Digs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
type DigsNext<I = Digs, R = {}> = 
  I extends [infer Head, infer Next, ...infer Tail]
    ? DigsNext<[Next, ...Tail], R & Record<Head, Next>>
    : {[K in keyof R]: R[K]}
type DigsPrev = {[K in keyof DigsNext as DigsNext[K]]: K}

type AddOne<A> = 
  A extends `${infer AH}${infer AT}` 
    ? AH extends '9' ? `0${AddOne<AT>}` : `${DigsNext[AH]}${AT}`
    : `1`

type SubOne<A> = 
  A extends `${infer AH}${infer AT}`
    ? AH extends '0' ? `9${SubOne<AT>}` : `${DigsPrev[AH]}${AT}`
    : never

type Add<A, B> = 
  A extends `${infer AH}${infer AT}` ?
  B extends `${infer BH}${infer BT}` 
    ? BH extends '0' ? `${AH}${Add<AT, BT>}` : Add<AddOne<A>, SubOne<B>> 
    : A : B

type Mul<A, B, R = '0'> = 
  A extends '0' ? R : 
  B extends '0' ? R :
  A extends `${infer AH}${infer AT}` 
    ? AH extends '0' ? Mul<AT, `0${B}`, R> : Mul<SubOne<A>, B, Add<R, B>>
    : R

type Multiply<A extends string | number | bigint, B extends string | number | bigint> = 
  Reverse<Mul<Reverse<A>, Reverse<B>>>

type t0 = Multiply<21, 3>;
// type a0 = Multiply1<21, 3111>;
type t1 = Multiply<'43423', 321543n>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Multiply<2, 3>, '6'>>,
  Expect<Equal<Multiply<3, '5'>, '15'>>,
  Expect<Equal<Multiply<'4', 10>, '40'>>,
  Expect<Equal<Multiply<0, 16>, '0'>>,
  Expect<Equal<Multiply<'13', '21'>, '273'>>,
  Expect<Equal<Multiply<'43423', 321543n>, '13962361689'>>,
  Expect<Equal<Multiply<9999, 1>, '9999'>>,
  Expect<Equal<Multiply<4325234, '39532'>, '170985150488'>>,
  Expect<Equal<Multiply<100_000n, '1'>, '100000'>>,
  Expect<Equal<Multiply<259, 9125385>, '2363474715'>>,
  Expect<Equal<Multiply<9, 99>, '891'>>,
  Expect<Equal<Multiply<315, '100'>, '31500'>>,
  Expect<Equal<Multiply<11n, 13n>, '143'>>,
  Expect<Equal<Multiply<728, 0>, '0'>>,
  Expect<Equal<Multiply<'0', 213>, '0'>>,
  Expect<Equal<Multiply<0, '0'>, '0'>>,
]
