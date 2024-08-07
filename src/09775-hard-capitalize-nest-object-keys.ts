/*
  9775 - Capitalize Nest Object Keys
  -------
  by MayanDev (@Mayandev) #hard #object #array

  ### Question

  Capitalize the key of the object, and if the value is an array, iterate through the objects in the array.

  > View on GitHub: https://tsch.js.org/9775
*/

/* _____________ Your Code Here _____________ */

// type CapitalizeNestObjectKeys<T> = any

// type CapitalizeNestObjectKeys<T> = T extends any[]
//     ? {
//         [K in keyof T]: CapitalizeNestObjectKeys<T[K]>
//     }
//     : T extends Record<any, any>
//         ? {
//             [K in keyof T as Capitalize<K & string>]: CapitalizeNestObjectKeys<T[K]>
//         }
//         : T

type Test<T extends any[]> = {[K in keyof T]: K}
type T1 = Test<[1, 2, 3]>

type CapitalizeNestObjectKeys<T> = T extends [infer F, ...infer R]
    ? [
        CapitalizeNestObjectKeys<F>,
        ...(R extends [] ? [] : CapitalizeNestObjectKeys<R> extends any[] ? CapitalizeNestObjectKeys<R> : never)
    ]
    : {
        [K in keyof T as K extends string ? Capitalize<K> : K]: CapitalizeNestObjectKeys<T[K]>
    }

type bar = {
    bar: string
    arr: [
        {a: string}, {b: string}
    ]
}
type A = CapitalizeNestObjectKeys<bar>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type foo = {
  foo: string
  bars: [{ foo: string }]
}

type Foo = {
  Foo: string
  Bars: [{
    Foo: string
  }]
}

type cases = [
  Expect<Equal<Foo, CapitalizeNestObjectKeys<foo>>>,
]
