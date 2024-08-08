/*
  19458 - SnakeCase
  -------
  by Gabriel Vergnaud (@gvergnaud) #hard #template-literal #string

  ### Question

  Create a `SnakeCase<T>` generic that turns a string formatted in **camelCase** into a string formatted in **snake_case**.

  A few examples:

  ```ts
  type res1 = SnakeCase<"hello">; // => "hello"
  type res2 = SnakeCase<"userName">; // => "user_name"
  type res3 = SnakeCase<"getElementById">; // => "get_element_by_id"
  ```

  > View on GitHub: https://tsch.js.org/19458
*/

/* _____________ Your Code Here _____________ */

// type SnakeCase<T> = any

type SnakeCase<T> = T extends `${infer S}${infer Rest}`
    ? `${S extends Uppercase<S> ? `_${Lowercase<S>}` : S}${SnakeCase<Rest>}`
    : ''

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<SnakeCase<'hello'>, 'hello'>>,
  Expect<Equal<SnakeCase<'userName'>, 'user_name'>>,
  Expect<Equal<SnakeCase<'getElementById'>, 'get_element_by_id'>>,
  Expect<Equal<SnakeCase<'getElementById' | 'getElementByClassNames'>, 'get_element_by_id' | 'get_element_by_class_names'>>,
]
