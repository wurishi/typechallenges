/*
  28143 - OptionalUndefined
  -------
  by Jesus The Hun (@JesusTheHun) #hard

  ### Question

  Implement the util type `OptionalUndefined<T, Props>` that turns all the properties of `T` that can be `undefined`, into optional properties. In addition, a second -optional- generic `Props` can be passed to restrict the properties that can be altered.

  ```ts
  OptionalUndefined<{ value: string | undefined, description: string }>
  // { value?: string | undefined; description: string }

  OptionalUndefined<{ value: string | undefined, description: string | undefined, author: string | undefined }, 'description' | 'author'>
  // { value: string | undefined; description?: string | undefined, author?: string | undefined }
  ```

  > View on GitHub: https://tsch.js.org/28143
*/

/* _____________ Your Code Here _____________ */

// type OptionalUndefined<T, Props> = any

type OptionalUndefined<T, Props extends keyof T = keyof T> =
Omit<
    Omit<T, Props>
        & {
            [K in Props as undefined extends T[K] ? K : never]?: T[K]
        }
        & {
            [K in Props as undefined extends T[K] ? never : K]: T[K]
        }
    , never>

type A1 = OptionalUndefined<{ value: string | undefined }, 'value'>

type Type = {a: string; b: number}
type T1 = Omit<Type, 'a'> & Omit<Type, 'b'>
type T2 = Omit<Omit<Type, 'a'> & Omit<Type, 'b'>, never>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<OptionalUndefined<{ value: string | undefined }, 'value'>, { value?: string | undefined }>>,
  Expect<Equal<OptionalUndefined<{ value: string, desc: string }, 'value'>, { value: string, desc: string }>>,
  Expect<Equal<OptionalUndefined<{ value: string | undefined, desc: string }, 'value'>, { value?: string, desc: string }>>,
  Expect<Equal<OptionalUndefined<{ value: string | undefined, desc: string | undefined }, 'value'>, { value?: string | undefined, desc: string | undefined }>>,
  Expect<Equal<OptionalUndefined<{ value: string | undefined, desc: string }, 'value' | 'desc'>, { value?: string, desc: string }>>,
  Expect<Equal<OptionalUndefined<{ value: string | undefined, desc: string | undefined }>, { value?: string, desc?: string }>>,
  Expect<Equal<OptionalUndefined<{ value?: string }, 'value'>, { value?: string }>>,
  Expect<Equal<OptionalUndefined<{ value?: string }>, { value?: string }>>,
]
