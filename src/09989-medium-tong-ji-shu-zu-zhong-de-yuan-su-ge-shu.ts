/*
  9989 - 统计数组中的元素个数
  -------
  by 凤之兮原 (@kongmingLatern) #中等

  ### 题目

  通过实现一个``CountElementNumberToObject``方法，统计数组中相同元素的个数
  ~~~ts
  type Simple1 = CountElementNumberToObject<[]> // return {}
  type Simple2 = CountElementNumberToObject<[1,2,3,4,5]>
  
   return {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1
  }
  
  type Simple3 = CountElementNumberToObject<[1,2,3,4,5,[1,2,3]]>
  
   return {
    1: 2,
    2: 2,
    3: 2,
    4: 1,
    5: 1
  }
  
  ~~~

  > 在 Github 上查看：https://tsch.js.org/9989/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type CountElementNumberToObject<T> = any
type Flat<T> = T extends [infer F, ...infer R]
    ? F extends any[]
        ? [...Flat<F>, ...Flat<R>]
        : [F, ...Flat<R>]
    : T
type A1 = Flat<[1, 2, 3, 4, 5, [1, 2, 3]]>
type Count<T extends any[], V, C extends any[] = []> = 
T extends [infer F, ...infer R]
    ? F extends V // Equal<F, V> extends true
        ? Count<R, V, [...C, any]>
        : Count<R, V, C>
    : C['length']
type A2 = Count<A1, 3>
type A3 = Equal<[3][number], 3> extends true ? 1 : 0
type CountElementNumberToObject<T extends any[], U extends any[] = Flat<T>> = {
    [K in U[number]]: Count<U, K>
}
type A4 = CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>

type Test<T, V> = T extends [infer F, ...infer R]
    ? Equal<F, V>
    : null
type B1 = Test<[1, 2], 2>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5]>, {
    1: 1
    2: 1
    3: 1
    4: 1
    5: 1
  } >>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>, {
    1: 2
    2: 2
    3: 2
    4: 1
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3, [4, 4, 1, 2]]]>, {
    1: 3
    2: 3
    3: 2
    4: 3
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[never]>, {}>>,
  Expect<Equal<CountElementNumberToObject<['1', '2', '0']>, {
    0: 1
    1: 1
    2: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<['a', 'b', ['c', ['d']]]>, {
    'a': 1
    'b': 1
    'c': 1
    'd': 1
  }>>,
]
