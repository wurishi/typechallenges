/*
  2946 - ObjectEntries
  -------
  by jiangshan (@jiangshanmeta) #medium #object

  ### Question

  Implement the type version of ```Object.entries```

  For example

  ```typescript
  interface Model {
    name: string;
    age: number;
    locations: string[] | null;
  }
  type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
  ```

  > View on GitHub: https://tsch.js.org/2946
*/

/* _____________ Your Code Here _____________ */

// type ObjectEntries<T> = any
// type ObjectEntries<T, U = Required<T>> = {
//     [K in keyof U]: [K, U[K]]
// }[keyof U]

// type RemoveUndefined<T> = [T] extends [undefined] ? T : Exclude<T, undefined>
// type ObjectEntries<T> = {
//     [K in keyof T]-?: [K, RemoveUndefined<T[K]>]
// }[keyof T]
// type A1 = RemoveUndefined<string | boolean | undefined | Date>

type ObjectEntries<T> = {
    [K in keyof Required<T>]: [K, [T[K]] extends [undefined] ? undefined : Required<T>[K]]
}[keyof T]



type A = ObjectEntries<Model>
type B = ObjectEntries<{ key?: undefined }>
type C = ObjectEntries<{ key: undefined }>
type D = ObjectEntries<{ a?: number, b: number, c?: number }>
type E = ObjectEntries<{ key: string | undefined }>
type F = ObjectEntries<Partial<Model>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

interface Model {
  name: string
  age: number
  locations: string[] | null
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null]

type cases = [
  Expect<Equal<ObjectEntries<Model>, ModelEntries>>,
  Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>,
  Expect<Equal<ObjectEntries<{ key?: undefined }>, ['key', undefined]>>,
  Expect<Equal<ObjectEntries<{ key: undefined }>, ['key', undefined]>>,
  Expect<Equal<ObjectEntries<{ key: string | undefined }>, ['key', string | undefined]>>,
]
