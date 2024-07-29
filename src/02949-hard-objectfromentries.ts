/*
  2949 - ObjectFromEntries
  -------
  by jiangshan (@jiangshanmeta) #hard #object

  ### Question

  Implement the type version of ```Object.fromEntries```

  For example:

  ```typescript
  interface Model {
    name: string;
    age: number;
    locations: string[] | null;
  }

  type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null];

  type result = ObjectFromEntries<ModelEntries> // expected to be Model
  ```

  > View on GitHub: https://tsch.js.org/2949
*/

/* _____________ Your Code Here _____________ */

// type ObjectFromEntries<T> = any
type ObjectFromEntries1<T extends [string, any]> = {
    [K in T as T[0]]: T[1]
}
type A1 = ObjectFromEntries1<ModelEntries>


type ObjectFromEntries<T extends [string, any]> = {
    [K in T[0]]: T extends [K, any] ? T[1] : never
}

type A = ObjectFromEntries<ModelEntries>


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

interface Model {
  name: string
  age: number
  locations: string[] | null
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null]

type cases = [
  Expect<Equal<ObjectFromEntries<ModelEntries>, Model>>,
]
