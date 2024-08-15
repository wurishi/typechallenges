/*
  31824 - Length of String 3
  -------
  by Eosellmay Li (@E0SelmY4V) #hard

  ### Question

  Implement a type `LengthOfString<S>` just like `Array#length`:

  Differing to two previous challenges about strings' length, this times the type must support strings about $10^6$ characters long, which makes it more challenging.

  > View on GitHub: https://tsch.js.org/31824
*/

/* _____________ Your Code Here _____________ */

// type LengthOfString<S extends string> = any

// type X10<S extends string> = `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}`
// type D1 = `${any}`
// type D10 = X10<D1>
// type D100 = X10<D10>
// type D1000 = X10<D100>
// type D10000 = X10<D1000>
// type D100000 = X10<D10000>
// type Digits = [D10000, D1000, D100, D10, D1]

// type PlusOne<S extends string>
//   = S extends `${infer L}9` ? L extends '' ? '10' : `${PlusOne<L>}0`
//   : S extends `${infer L}8` ? `${L}9` : S extends `${infer L}7` ? `${L}8` : S extends `${infer L}6` ? `${L}7` : S extends `${infer L}5` ? `${L}6` : S extends `${infer L}4` ? `${L}5` : S extends `${infer L}3` ? `${L}4` : S extends `${infer L}2` ? `${L}3` : S extends `${infer L}1` ? `${L}2` : S extends `${infer L}0` ? `${L}1`
//   : '1'

// type CountDigits<D extends string, S, C extends string = '0'> = S extends `${D}${infer R}` ? CountDigits<D, R, PlusOne<C>> : [C, S]

// type LengthAssessment<S0, D1, R extends string = ''>
//   = D1 extends [infer L extends string, ...infer D2]
//     ? S0 extends `${L}${infer S1}` ? S1 extends `${L}${infer S2}` ? S2 extends `${L}${infer S3}` ? S3 extends `${L}${infer S4}` ? S4 extends `${L}${infer S5}`
//     ? S5 extends `${L}${infer S6}` ? S6 extends `${L}${infer S7}` ? S7 extends `${L}${infer S8}` ? S8 extends `${L}${infer S9}`
//     ? LengthAssessment<S9, D2, `${R}9`> : LengthAssessment<S8, D2, `${R}8`> : LengthAssessment<S7, D2, `${R}7`> : LengthAssessment<S6, D2, `${R}6`> : LengthAssessment<S5, D2, `${R}5`>
//     : LengthAssessment<S4, D2, `${R}4`> : LengthAssessment<S3, D2, `${R}3`> : LengthAssessment<S2, D2, `${R}2`> : LengthAssessment<S1, D2, `${R}1`> : LengthAssessment<S0, D2, `${R}0`>
//   : R

// type LengthOfString<S extends string>
//   = CountDigits<D100000, S> extends [infer C extends string, infer R extends string]
//     ? TrimLeft<'0', `${C}${LengthAssessment<R, Digits>}`> extends `${infer N extends number}` ? N
//     : 0
//   : never

// /* _____________ Test Cases _____________ */
// import type { Equal, Expect } from '@type-challenges/utils'

// type Deced = [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// type Signum = Deced[number]
// type Reped<
//     S extends string,
//     C extends Signum,
//     R extends string = '',
// >
//     = (C extends 0
//         ? R
//         : Reped<S, Deced[C], `${R}${S}`>
//     )
// type t0 = 'k'
// type t1 = Reped<t0, 10>
// type t2 = Reped<t1, 10>
// type t3 = Reped<t2, 10>
// type t4 = Reped<t3, 10>
// type t5 = Reped<t4, 10>
// type t6 = Reped<t5, 10>
// type Gened<N extends string> = N extends `${''
//     }${infer N6 extends Signum
//     }${infer N5 extends Signum
//     }${infer N4 extends Signum
//     }${infer N3 extends Signum
//     }${infer N2 extends Signum
//     }${infer N1 extends Signum
//     }${infer N0 extends Signum
//     }` ? `${''
//     }${Reped<t6, N6>
//     }${Reped<t5, N5>
//     }${Reped<t4, N4>
//     }${Reped<t3, N3>
//     }${Reped<t2, N2>
//     }${Reped<t1, N1>
//     }${Reped<t0, N0>
//     }` : never

type cases = [
    Expect<Equal<LengthOfString<Gened<'0000000'>>, 0>>,
    Expect<Equal<LengthOfString<Gened<'0000001'>>, 1>>,
    Expect<Equal<LengthOfString<Gened<'0000002'>>, 2>>,
    Expect<Equal<LengthOfString<Gened<'0000003'>>, 3>>,
    Expect<Equal<LengthOfString<Gened<'0000004'>>, 4>>,
    Expect<Equal<LengthOfString<Gened<'0000005'>>, 5>>,
    Expect<Equal<LengthOfString<Gened<'0000055'>>, 55>>,
    // Expect<Equal<LengthOfString<Gened<'0000555'>>, 555>>,
    // Expect<Equal<LengthOfString<Gened<'0005555'>>, 5555>>,
    // Expect<Equal<LengthOfString<Gened<'0055555'>>, 55555>>,
    // Expect<Equal<LengthOfString<Gened<'8464592'>>, 8464592>>,
    // Expect<Equal<LengthOfString<Gened<'1373690'>>, 1373690>>,
    // Expect<Equal<LengthOfString<Gened<'1707793'>>, 1707793>>,
    // Expect<Equal<LengthOfString<Gened<'0196268'>>, 196268>>,
    // Expect<Equal<LengthOfString<Gened<'6646734'>>, 6646734>>,
    // Expect<Equal<LengthOfString<Gened<'0538159'>>, 538159>>,
    // Expect<Equal<LengthOfString<Gened<'0058901'>>, 58901>>,
    // Expect<Equal<LengthOfString<Gened<'8414001'>>, 8414001>>,
    // Expect<Equal<LengthOfString<Gened<'1740697'>>, 1740697>>,
    // Expect<Equal<LengthOfString<Gened<'2281441'>>, 2281441>>,
]
