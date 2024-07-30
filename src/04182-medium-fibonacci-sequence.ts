/*
  4182 - 斐波那契序列
  -------
  by windliang (@wind-liang) #中等

  ### 题目

  Implement a generic Fibonacci\<T\> takes an number T and returns it's corresponding [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number).

  The sequence starts:
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

  For example
  ```js
  type Result1 = Fibonacci<3> // 2
  type Result2 = Fibonacci<8> // 21
  ```

  > 在 Github 上查看：https://tsch.js.org/4182/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type Fibonacci<T extends number> = any
type Fibonacci<
T extends number,
N extends any[] = [any, any, any],
N_2 extends any[] = [any],
N_1 extends any[] = [any],
> = 
    T extends 1 | 2
        ? 1
        : T extends N['length']
            ? [...N_2, ...N_1]['length']
            : Fibonacci<T, [...N, any], N_1, [...N_2, ...N_1]>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]
