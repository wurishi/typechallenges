/*
  9616 - Parse URL Params
  -------
  by Anderson. J (@andersonjoseph) #medium #infer #string #template-literal

  ### Question

  You're required to implement a type-level parser to parse URL params string into an Union.

  ```ts
  ParseUrlParams<':id'> // id
  ParseUrlParams<'posts/:id'> // id
  ParseUrlParams<'posts/:id/:user'> // id | user
  ```

  > View on GitHub: https://tsch.js.org/9616
*/

/* _____________ Your Code Here _____________ */

// type ParseUrlParams<T> = any

// type FormatterString<T> = T extends `${infer F}/${string}` ? F : T
// type GetFirstParam<T> = T extends `${infer F}:${string}` ? FormatterString<F> : FormatterString<T>
// type ParseUrlParams<T, List = never> = T extends `${string}:${infer Other}`
//     ? ParseUrlParams<Other, List | GetFirstParam<Other>>
//     : List

type ParseUrlParams<T> = T extends `${string}:${infer R}`
    ? R extends `${infer P}/${infer L}`
        ? P | ParseUrlParams<L>
        : R
    : never

type A = ParseUrlParams<'posts/:id/:user/like'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ParseUrlParams<''>, never>>,
  Expect<Equal<ParseUrlParams<':id'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/:user'>, 'id' | 'user'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/:user/like'>, 'id' | 'user'>>,
]
