/*
  462 - 柯里化 2
  -------
  by Kim (@hubvue) #地狱

  ### 题目

  [Currying](https://en.wikipedia.org/wiki/Currying) 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

  但是在前端的日常开发中，柯里化函数参数个数动态化却是非常常见的，例如 `Function.bind(this, [...params])`

  ```ts
  const func = (a: number, b: number, c: number) => {
    return a + b + c
  }

  const bindFunc = func(null, 1, 2)

  const result = bindFunc(3) // result: 6
  ```

  因此，在 `柯里化` 的基础上，我们更需要的是 `动态参数化的柯里化函数`

  ```ts
  const add = (a: number, b: number, c: number) => a + b + c
  const three = add(1, 1, 1)

  const curriedAdd = DynamicParamsCurrying(add)
  const six = curriedAdd(1, 2, 3)
  const seven = curriedAdd(1, 2)(4)
  const eight = curriedAdd(2)(3)(4)
  ```

  传递给 `DynamicParamsCurrying` 的函数可能有多个参数，您需要实现它的类型。

  在此挑战中，curriedAdd函数每次可接受最少一个参数，但是所有参数个数总和及类型与原函数相同。分配完所有参数后，它应返回其结果。

  > 在 Github 上查看：https://tsch.js.org/462/zh-CN
*/

/* _____________ 你的代码 _____________ */

// declare function DynamicParamsCurrying(fn: any): any

type Curry<A, R, D extends unknown[] = []> = A extends [infer H, ...infer T]
  ? T extends []
    ? (...args: [...D, H]) => R
    : ((...args: [...D, H]) => Curry<T, R>) & Curry<T, R, [...D, H]>
  : () => R
declare function DynamicParamsCurrying<A extends unknown[], R>(fn: (...args: A) => R): Curry<A, R>

// declare function DynamicParamsCurrying<Fn extends (...arg: any) => any>(fn: Fn): Fn extends (...arg: infer P) => ReturnType<Fn> ? Curring<P, ReturnType<Fn>> : never
// type Curring<P, Ret> = P extends [infer X, ...infer R]
//   ? <T extends any[]>(...arg: T) => Curring<P extends [...T, ...infer Rest]
//     ? Rest
//     : never, Ret>
//   : Ret

// declare function DynamicParamsCurrying<T extends any[], U>(fn: (...args: T) => U): Curring<T, U>
// type Curring<T extends any[], U> = T extends []
//   ? U
//   : <_Args extends any[]>(...args: _Args) => T extends [..._Args, ...infer R]
//     ? Curring<R, U>
//     : never

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const curried1 = DynamicParamsCurrying((a: string, b: number, c: boolean) => true)
const curried2 = DynamicParamsCurrying((a: string, b: number, c: boolean, d: boolean, e: boolean, f: string, g: boolean) => true)

const curried1Return1 = curried1('123')(123)(true)
const curried1Return2 = curried1('123', 123)(false)
const curried1Return3 = curried1('123', 123, true)

const curried2Return1 = curried2('123')(123)(true)(false)(true)('123')(false)
const curried2Return2 = curried2('123', 123)(true, false)(true, '123')(false)
const curried2Return3 = curried2('123', 123)(true)(false)(true, '123', false)
const curried2Return4 = curried2('123', 123, true)(false, true, '123')(false)
const curried2Return5 = curried2('123', 123, true)(false)(true)('123')(false)
const curried2Return6 = curried2('123', 123, true, false)(true, '123', false)
const curried2Return7 = curried2('123', 123, true, false, true)('123', false)
const curried2Return8 = curried2('123', 123, true, false, true)('123')(false)
const curried2Return9 = curried2('123', 123, true, false, true, '123')(false)
const curried2Return10 = curried2('123', 123, true, false, true, '123', false)

type cases = [
  Expect<Equal< typeof curried1Return1, boolean>>,
  Expect<Equal< typeof curried1Return2, boolean>>,
  Expect<Equal< typeof curried1Return3, boolean>>,

  Expect<Equal< typeof curried2Return1, boolean>>,
  Expect<Equal< typeof curried2Return2, boolean>>,
  Expect<Equal< typeof curried2Return3, boolean>>,
  Expect<Equal< typeof curried2Return4, boolean>>,
  Expect<Equal< typeof curried2Return5, boolean>>,
  Expect<Equal< typeof curried2Return6, boolean>>,
  Expect<Equal< typeof curried2Return7, boolean>>,
  Expect<Equal< typeof curried2Return8, boolean>>,
  Expect<Equal< typeof curried2Return9, boolean>>,
  Expect<Equal< typeof curried2Return10, boolean>>,
]
