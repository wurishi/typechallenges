/*
  151 - Query String Parser
  -------
  by Pig Fang (@g-plane) #extreme #template-literal

  ### Question

  You're required to implement a type-level parser to parse URL query string into a object literal type.

  Some detailed requirements:

  - Value of a key in query string can be ignored but still be parsed to `true`. For example, `'key'` is without value, so the parser result is `{ key: true }`.
  - Duplicated keys must be merged into one. If there are different values with the same key, values must be merged into a tuple type.
  - When a key has only one value, that value can't be wrapped into a tuple type.
  - If values with the same key appear more than once, it must be treated as once. For example, `key=value&key=value` must be treated as `key=value` only.

  > View on GitHub: https://tsch.js.org/151
*/

/* _____________ Your Code Here _____________ */

// type ParseQueryString = any
// type ParseQueryString<QS extends string, Record extends object = {}> = QS extends `${infer KV}&${infer R}`
//     ? ParseQueryString<R, ParseKey<Record, KV>>
//     : ParseKey<Record, QS>

// type ParseKey<O extends object, KV extends string> = KV extends `${infer K}=${infer V}`
//     ? AddProperty<O, K, V>
//     : KV extends ''
//         ? {}
//         : AddProperty<O, KV, true>

// type AddProperty<O extends object, K extends PropertyKey, V extends string | boolean> = K extends keyof O
//     ? { 
//         [Key in keyof O]: K extends Key
//           ? O[Key] extends any[]
//             ? Includes<O[Key], V> extends false
//               ? [...O[Key], V]
//               : O[Key]
//             : V extends O[Key] ? O[Key] : [O[Key], V]
//           : O[Key]
//       }
//     : { [Key in keyof O | K]: Key extends keyof O ? O[Key]: V }

// type Includes<R extends any[], V> = V extends R[number] ? true : false

type ParseQueryString<S extends string> = S extends '' ? {} : MergeParams<SplitParams<S>>

// 'k1=v1&k2=v2&k3&k1' => ['k1=v1', 'k2=v2', 'k3', 'k1']
type SplitParams<S extends string> = S extends `${infer KV}&${infer R}`
  ? [KV, ...SplitParams<R>]
  : [S]

type p1 = SplitParams<'k1=v1&k2=v2&k3&k1&&'>

type MergeParams<T extends string[], M = {}> = T extends [infer E, ...infer R extends string[]]
  ? E extends `${infer K}=${infer V}`
    ? MergeParams<R, SetProperty<M, K, V>>
    : E extends `${infer K}`
      ? MergeParams<R, SetProperty<M, K>>
      : never
  : M

type p2 = MergeParams<p1>

type SetProperty<T, K extends PropertyKey, V = true> = {
  [P in keyof T | K]: P extends K
    ? P extends keyof T
      ? T[P] extends V
        ? T[P]
        : T[P] extends any[]
          ? V extends T[P][number] ? T[P] : [...T[P], V]
          : [T[P], V]
      : V
    : P extends keyof T ? T[P]: never
}

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ParseQueryString<''>, {}>>,
  Expect<Equal<ParseQueryString<'k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k2'>, { k1: true; k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1'>, { k1: 'v1' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v2'>, { k1: ['v1', 'v2'] }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2'>, { k1: 'v1'; k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2&k1=v2'>, { k1: ['v1', 'v2']; k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2'>, { k1: 'v1'; k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v1'>, { k1: 'v1' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v2&k1=v1'>, { k1: ['v1', 'v2'] }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v1&k1=v2&k1=v1'>, { k1: ['v1', 'v2']; k2: 'v1' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2&k1=v2&k1=v3'>, { k1: ['v1', 'v2', 'v3']; k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1'>, { k1: ['v1', true] }>>,
  Expect<Equal<ParseQueryString<'k1&k1=v1'>, { k1: [true, 'v1'] }>>,
]
