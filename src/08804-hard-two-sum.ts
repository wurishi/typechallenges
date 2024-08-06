/*
  8804 - 两数之和
  -------
  by PsiloLau (@Psilocine) #困难 #array #math

  ### 题目

  给定一个整数数组 nums 和一个目标整数 target, 如果 nums 数组中存在两个元素的和等于 target 返回 true, 否则返回 false

  > 在 Github 上查看：https://tsch.js.org/8804/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type TwoSum<T extends number[], U extends number> = any

type MakeCounter<
T extends number,
_Result extends 1[] = [],
U = T
> = U extends T
    ? _Result['length'] extends U
        ? _Result | MakeCounter<Exclude<T, U>>
        : MakeCounter<U, [..._Result, 1]>
    : never
type M1 = MakeCounter<10>
type M_1 = MakeCounter<never>


type Tuple<T, Res extends 1[] = []> = Res['length'] extends T
  ? Res
  : Tuple<T, [...Res, 1]>
type T1 = Tuple<10>
// type T_1 = Tuple<never>

type SimpleAdd<T extends number, U extends number> = [...MakeCounter<T>, ...MakeCounter<U>]['length']
type S1 = SimpleAdd<2, 15>

type Test<T extends number, U extends number[]> = SimpleAdd<T, U[number]>
type T2 = Test<5, []>

type Test2<T extends number[]> = T[number]
type T3 = Test2<[]>
type Test3<T, U = T> = U extends T
  ? 1
  : 0
type T4 = Test3<never>

type TwoSum<T extends number[], U extends number> =
T extends [infer F extends number, ...infer R extends number[]]
  ? U extends SimpleAdd<F, R[number]>
    ? true
    : TwoSum<R, U>
  : false

type A = TwoSum<[2, 7, 11, 15], 15>


/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TwoSum<[3, 3], 6>, true>>,
  Expect<Equal<TwoSum<[3, 2, 4], 6>, true>>,
  Expect<Equal<TwoSum<[2, 7, 11, 15], 15>, false>>,
  Expect<Equal<TwoSum<[2, 7, 11, 15], 9>, true>>,
  Expect<Equal<TwoSum<[1, 2, 3], 0>, false>>,
  Expect<Equal<TwoSum<[1, 2, 3], 1>, false>>,
  Expect<Equal<TwoSum<[1, 2, 3], 2>, false>>,
  Expect<Equal<TwoSum<[1, 2, 3], 3>, true>>,
  Expect<Equal<TwoSum<[1, 2, 3], 4>, true>>,
  Expect<Equal<TwoSum<[1, 2, 3], 5>, true>>,
  Expect<Equal<TwoSum<[1, 2, 3], 6>, false>>,
  Expect<Equal<TwoSum<[3, 2, 0], 2>, true>>,
]
