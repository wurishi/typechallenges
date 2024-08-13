/*
  21220 - Permutations of Tuple
  -------
  by null (@gaac510) #medium #union #tuple #conditional type #recursion

  ### Question

  Given a generic tuple type `T extends unknown[]`, write a type which produces all permutations of `T` as a union.

  For example:

  ```ts
  PermutationsOfTuple<[1, number, unknown]>
  // Should return:
  // | [1, number, unknown]
  // | [1, unknown, number]
  // | [number, 1, unknown]
  // | [unknown, 1, number]
  // | [number, unknown, 1]
  // | [unknown, number ,1]
  ```

  > View on GitHub: https://tsch.js.org/21220
*/

/* _____________ Your Code Here _____________ */

// type PermutationsOfTuple<T extends unknown[]> = any

// type Insert<T extends unknown[], U> = T extends [infer F, ...infer L]
//     ? [F, U, L] | [F, ...Insert<L, U>]
//     : [U]
// type PermutationsOfTuple<
// T extends unknown[],
// R extends unknown[] = []
// > = T extends [infer F, ...infer L]
//     ? PermutationsOfTuple<L, Insert<R, F> | [F, ...R]>
//     : R

type WrapArray<T extends any[]> = T extends [infer S, ...infer O] 
    ? [[S], ...WrapArray<O>] 
    : [];
type A = WrapArray<[string, unknown]>

type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 
    ? true 
    : false;
type MyExclued<T extends any[], U> = T extends [infer S, ...infer O] 
    ? (MyEqual<S, U> extends true 
        ? MyExclued<O, U> 
        : [S, ...MyExclued<O, U>]) 
    : [];
type B = MyExclued<[['a'], [unknown], 2], [unknown]>

type MyPermutationsOfTuple<T extends any[], U = T[number]> = 
[U] extends [never] 
    ? [] 
    : (U extends U 
        ? [
            U extends any[] 
                ? U[0] 
                : never
            , ...MyPermutationsOfTuple<MyExclued<T, U>>] 
        : []);
type PermutationsOfTuple<T extends unknown[], U extends unknown[] = WrapArray<T>> = MyPermutationsOfTuple<U>;

type T1 = PermutationsOfTuple<[any, unknown]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect, ExpectFalse } from '@type-challenges/utils'

type cases = [
  Expect<Equal<PermutationsOfTuple<[]>, []>>,
  Expect<Equal<PermutationsOfTuple<[any]>, [any]>>,
  Expect<Equal<PermutationsOfTuple<[any, unknown]>, [any, unknown] | [unknown, any]>>,
  Expect<Equal<
    PermutationsOfTuple<[any, unknown, never]>,
    | [any, unknown, never]
    | [unknown, any, never]
    | [unknown, never, any]
    | [any, never, unknown]
    | [never, any, unknown]
    | [never, unknown, any]
  >>,
  Expect<Equal<
    PermutationsOfTuple<[1, number, unknown]>,
    | [1, number, unknown]
    | [1, unknown, number]
    | [number, 1, unknown]
    | [unknown, 1, number]
    | [number, unknown, 1]
    | [unknown, number, 1]
  >>,
  ExpectFalse<Equal<PermutationsOfTuple<[ 1, number, unknown ]>, [unknown]>>,
]
