/*
  612 - KebabCase
  -------
  by Johnson Chu (@johnsoncodehk) #medium #template-literal

  ### Question

  Replace the `camelCase` or `PascalCase` string with `kebab-case`.

  `FooBarBaz` -> `foo-bar-baz`

  For example

  ```ts
  type FooBarBaz = KebabCase<"FooBarBaz">
  const foobarbaz: FooBarBaz = "foo-bar-baz"

  type DoNothing = KebabCase<"do-nothing">
  const doNothing: DoNothing = "do-nothing"
  ```

  > View on GitHub: https://tsch.js.org/612
*/

/* _____________ Your Code Here _____________ */

// type KebabCase<S> = any
type KebabCase<S> = S extends `${infer F}${infer R}`
    ? R extends Uncapitalize<R>
        ? `${Uncapitalize<F>}${KebabCase<R>}`
        : `${Uncapitalize<F>}-${KebabCase<R>}`
    : S

// type KebabCase<S, U = S> = S extends `${infer R}${infer P}`
//     ? R extends Uppercase<R>
//         ? U extends `${string}${infer US}`
//             ? P extends US
//                 ? `${Lowercase<R>}${KebabCase<P, S>}`
//                 : `-${Lowercase<R>}${KebabCase<P, S>}`
//             : S
//         : `${R}${KebabCase<P, S>}`
//     : S

type a0 = Uncapitalize<'AB'>
type t0 = KebabCase<'ABC'>
type t1 = KebabCase<'😎'>
type t2 = KebabCase<'foo-bar'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>,
]
