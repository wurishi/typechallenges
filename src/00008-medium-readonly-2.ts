/*
  8 - 对象部分属性只读
  -------
  by Anthony Fu (@antfu) #中等 #readonly #object-keys

  ### 题目

  实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。

  类型 `K` 指定 `T` 中要被设置为只读 (readonly) 的属性。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。

  例如

  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }

  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK
  ```

  > 在 Github 上查看：https://tsch.js.org/8/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type MyReadonly2<T, K> = any
// type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> & Readonly<Pick<T, K>>
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> & Omit<T, K>
// type MyReadonly2<T, K extends keyof T = keyof T> = {
//     readonly [rK in K]: T[rK]
// } & {
//     [other in keyof T as other extends K ? never : other]: T[other]
// }
// type MyExclude<T, K> = T extends K ? never : T
// type MyReadonly2<T, K extends keyof T = keyof T> = 
// {
//     readonly [rK in K] : T[rK]
// } & 
// {
//     [otherK in keyof T as MyExclude<otherK, K>]: T[otherK]
// }


type T = MyReadonly2<Todo2, 'description' >

/* _____________ 测试用例 _____________ */
import type { Alike, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'description' >, Expected>>,
]

// @ts-expect-error
type error = MyReadonly2<Todo1, 'title' | 'invalid'>

interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

interface Expected {
  readonly title: string
  readonly description?: string
  completed: boolean
}
