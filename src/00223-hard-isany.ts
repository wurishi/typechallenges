/*
  223 - IsAny
  -------
  by Pavel Glushkov (@pashutk) #hard #utils

  ### Question

  Sometimes it's useful to detect if you have a value with `any` type. This is especially helpful while working with third-party Typescript modules, which can export `any` values in the module API. It's also good to know about `any` when you're suppressing implicitAny checks.

  So, let's write a utility type `IsAny<T>`, which takes input type `T`. If `T` is `any`, return `true`, otherwise, return `false`.

  > View on GitHub: https://tsch.js.org/223
*/

/* _____________ Your Code Here _____________ */

// type IsAny<T> = any

// type IsAny<T> = 0 extends (1 & T) ? true : false

// type IsAny<T> = [{}, T] extends [T, null] ? true : false

// type IfEquals<X, Y, A=X, B=never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B
// type IsAny<T> = IfEquals<T, any, true, false>

// type IsAny<T> = ((a: [any]) => [any]) extends (a: T) => [T] ? true : false

type IsBoolean<T> = false extends T
    ? true extends T
        ? true
        : false
    : false

type MapToBoolean<T> = unknown extends T
    ? T extends never
        ? true
        : false
    : false

type IsAny<T> = IsBoolean<MapToBoolean<T>>


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsAny<any>, true>>,

  Expect<Equal<IsAny<undefined>, false>>,
  Expect<Equal<IsAny<unknown>, false>>,
  Expect<Equal<IsAny<never>, false>>,
  Expect<Equal<IsAny<string>, false>>,
]
