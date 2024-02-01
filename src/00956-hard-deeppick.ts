/*
  956 - DeepPick
  -------
  by hiroya iizuka (@hiroyaiizuka) #hard #deep

  ### Question

  Implement a type DeepPick, that extends Utility types `Pick`.
  A type takes two arguments.


  For example:

  ```ts
  type obj = {
    name: 'hoge',
    age: 20,
    friend: {
      name: 'fuga',
      age: 30,
      family: {
        name: 'baz',
        age: 1
      }
    }
  }

  type T1 = DeepPick<obj, 'name'>   // { name : 'hoge' }
  type T2 = DeepPick<obj, 'name' | 'friend.name'>  // { name : 'hoge' } & { friend: { name: 'fuga' }}
  type T3 = DeepPick<obj, 'name' | 'friend.name' |  'friend.family.name'>  // { name : 'hoge' } &  { friend: { name: 'fuga' }} & { friend: { family: { name: 'baz' }}}

  ```

  > View on GitHub: https://tsch.js.org/956
*/

/* _____________ Your Code Here _____________ */

// type DeepPick = any

// type DeepPick<O extends object, Keys extends string> = 
//   UnionToIntersection<Keys extends string ? PickByPath<O, Split<Keys>> : never>;

// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
//   ? I : never;

// type Path = readonly string[];

// /**
//  * Tail<[]> = []
//  * Tail<['foo', 'bar']> = ['bar']
//  */
// type Tail<P extends Path> = P extends [unknown, ...infer T] ? T : [];

// type Split<S extends string> = S extends `${infer Key}.${infer Rest}`
//   ? [Key, ...Split<Rest>]
//   : [S]

// type PickByPath<O, P extends Path> = P extends []
//   ? O
//   : P[0] extends keyof O
//     ? { [K in P[0]]: PickByPath<O[P[0]], Tail<P>> }
//     : unknown;

// type DeepPick<T, PathUnion extends string> = 
//   UnionToInterection<PathUnion extends infer Keys ? TypeGet<T, Keys> : never>;

// type UnionToInterection<U> = (U extends any ? (arg: U) => any : never) extends ((arg: infer I) => any) ? I : never;

// type TypeGet<T, Paths> = Paths extends `${infer A}.${infer B}`
//   ? A extends keyof T 
//     ? { [K in A]: TypeGet<T[A], B> } 
//     : never
//   : Paths extends keyof T
//     ? { [K in Paths]: T[Paths] }
//     : never

// type a0 = TypeGet<Obj, 'b' | 'obj' | ''>

type DeepPick<T extends Record<string, any>, U extends string> = (U extends string
    ? U extends `${infer F}.${infer R}`
      ? (arg: {[K in F]: DeepPick<T[F], R>}) => void
      : U extends keyof T
        ? (arg:Pick<T, U>) => void
        : (arg: unknown) => void
    : never
  ) extends (arg:infer Z) => void ? Z : never
  
type t1 = DeepPick<Obj, 'a' | 'obj.e' | 'obj.obj2.i'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Obj = {
  a: number
  b: string
  c: boolean
  obj: {
    d: number
    e: string
    f: boolean
    obj2: {
      g: number
      h: string
      i: boolean
    }
  }
  obj3: {
    j: number
    k: string
    l: boolean
  }
}

type cases = [
  Expect<Equal<DeepPick<Obj, ''>, unknown>>,
  Expect<Equal<DeepPick<Obj, 'a'>, { a: number }>>,
  Expect<Equal<DeepPick<Obj, 'a' | ''>, { a: number } & unknown>>,
  Expect<Equal<DeepPick<Obj, 'a' | 'obj.e'>, { a: number } & { obj: { e: string } }>>,
  Expect<Equal<DeepPick<Obj, 'a' | 'obj.e' | 'obj.obj2.i'>, { a: number } & { obj: { e: string } } & { obj: { obj2: { i: boolean } } }>>,
]
