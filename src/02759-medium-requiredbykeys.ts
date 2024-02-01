/*
  2759 - RequiredByKeys
  -------
  by jiangshan (@jiangshanmeta) #中等 #object

  ### 题目

  实现一个通用的`RequiredByKeys<T, K>`，它接收两个类型参数`T`和`K`。

  `K`指定应设为必选的`T`的属性集。当没有提供`K`时，它就和普通的`Required<T>`一样使所有的属性成为必选的。

  例如:

  ```ts
  interface User {
    name?: string
    age?: number
    address?: string
  }

  type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }

  ```

  > 在 Github 上查看：https://tsch.js.org/2759/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type RequiredByKeys<T, K> = any
type Merge<O> = {
    [K in keyof O]: O[K]
}
// type RequiredByKeys<T, K extends keyof T = keyof T> = Merge<
// { [P in keyof T as P extends K ? P : never]-?:T[P] }
// &
// { [P in keyof T as P extends K ? never : P]:T[P] }
// >

type RequiredByKeys<T, K extends keyof T = keyof T> = Merge<
T &
Required<Pick<T, K extends keyof T ? K : never>>>

type t0 = RequiredByKeys<User, 'name'>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

interface User {
  name?: string
  age?: number
  address?: string
}

interface UserRequiredName {
  name: string
  age?: number
  address?: string
}

interface UserRequiredNameAndAge {
  name: string
  age: number
  address?: string
}

type cases = [
  Expect<Equal<RequiredByKeys<User, 'name'>, UserRequiredName>>,
  Expect<Equal<RequiredByKeys<User, 'name' | 'age'>, UserRequiredNameAndAge>>,
  Expect<Equal<RequiredByKeys<User>, Required<User>>>,
  // @ts-expect-error
  Expect<Equal<RequiredByKeys<User, 'name' | 'unknown'>, UserRequiredName>>,
]
