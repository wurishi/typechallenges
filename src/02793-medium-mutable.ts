/*
  2793 - Mutable
  -------
  by jiangshan (@jiangshanmeta) #中等 #readonly #object-keys

  ### 题目

  实现一个通用的类型 ```Mutable<T>```，使类型 `T` 的全部属性可变（非只读）。

  例如：

  ```typescript
  interface Todo {
    readonly title: string
    readonly description: string
    readonly completed: boolean
  }

  type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }

  ```

  > 在 Github 上查看：https://tsch.js.org/2793/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type Mutable<T> = any
// type Mutable<T> = {
//     -readonly [K in keyof T]: T[K]
// }

type Mutable<T> = {
    -readonly [K in keyof T]: T[K] extends object
        ? Mutable<T[K]>
        : T[K]
}
interface Foo {
    bar: {
        readonly name: string;
    }
}
type t0 = Mutable<Foo>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}

type List = [1, 2, 3]

type cases = [
  Expect<Equal<Mutable<Readonly<Todo1>>, Todo1>>,
  Expect<Equal<Mutable<Readonly<List>>, List>>,
]

type errors = [
  // @ts-expect-error
  Mutable<'string'>,
  // @ts-expect-error
  Mutable<0>,
]
