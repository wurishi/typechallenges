/*
  472 - Tuple to Enum Object
  -------
  by Ryo Hanafusa (@softoika) #困难 #tuple #template-literal

  ### 题目

  枚举是 TypeScript 的一种原生语法（在 JavaScript 中不存在）。因此在 JavaScript 中枚举会被转成如下形式的代码：

  ```js
  let OperatingSystem
  ;(function (OperatingSystem) {
    OperatingSystem[(OperatingSystem['MacOS'] = 0)] = 'MacOS'
    OperatingSystem[(OperatingSystem['Windows'] = 1)] = 'Windows'
    OperatingSystem[(OperatingSystem['Linux'] = 2)] = 'Linux'
  })(OperatingSystem || (OperatingSystem = {}))
  ```

  在这个问题中，你实现的类型应当将给定的字符串元组转成一个行为类似枚举的对象。此外，枚举的属性一般是 `pascal-case` 的。

  ```ts
  Enum<['macOS', 'Windows', 'Linux']>
  // -> { readonly MacOS: "macOS", readonly Windows: "Windows", readonly Linux: "Linux" }
  ```

  如果传递了第二个泛型参数，且值为 `true`，那么返回值应当是一个 `number` 字面量。

  ```ts
  Enum<['macOS', 'Windows', 'Linux'], true>
  // -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }
  ```

  > 在 Github 上查看：https://tsch.js.org/472/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type Enum<T extends readonly string[], N extends boolean = false> = any

// 方案一
// type EnsureArray<T, R = string> = T extends R[] ? T : never;
// type Enum<T extends readonly string[], B extends boolean = false, R extends Readonly<Record<string, any>> = Readonly<{}>, Index extends unknown[] = []> =
//   T extends readonly [infer F, ...infer Rest]
//     ? Enum<
//         Readonly<EnsureArray<Rest>>,
//         B,
//         Readonly<R & {
//             [K in F & string as Capitalize<K>]: B extends true
//                 ? Index['length']
//                 : K
//         }>,
//         [...Index, unknown]
//         >
//     : R

/* 方案二
type EnsureArray<T, Type = string> = T extends Type[] ? T : never;
type Enum<T extends readonly string[], B extends boolean = false> = {
    readonly [key in T[number] as Capitalize<key>]: B extends true
        ? FindIndex<T, key>
        : key
}

// FindIndex 1
// type FindIndex<T extends readonly string[], K extends string, Index extends unknown[] = []> = 
//     T extends readonly [infer F, ...infer Rest]
//         ? F extends K
//             ? Index['length']
//             : FindIndex<EnsureArray<Rest>, K, [...Index, unknown]>
//         : never

// FindIndex 2
// type FindIndex<T extends readonly string[], E extends string, Index extends unknown[] = []> = 
//     T extends readonly [infer L, ...infer Rest]
//         ? [E, L] extends [L, E]
//             ? Index['length']
//             : FindIndex<EnsureArray<Rest>, E, [...Index, unknown]>
//         : never

// FindIndex 3
type FindIndex<T extends readonly string[], K extends string, Index extends unknown[] = []> = 
    T[Index['length']] extends K
        ? Index['length']
        : FindIndex<T, K, [...Index, unknown]>

*/

// 方案三
// type Enum<T extends readonly string[], B extends boolean = false> = {
//     [key in keyof T as T[key] extends string
//         ? Capitalize<T[key]>
//         : never
//     ]: B extends false ? T[key & string] : StringToNumber<key & string>
// }

// type StringToNumber<S extends string, R extends unknown[] = []> = 
//     S extends `${R['length']}`
//         ? R['length']
//         : StringToNumber<S, [...R, unknown]>

// 方案四
// type TupleIndex<T extends readonly unknown[]> = T extends readonly [...infer Rest, infer R]
//     ? TupleIndex<Rest> & { [p in (R & string)]: Rest['length']}
//     : {}
// // type Enum<T extends readonly string[], N extends boolean = false> = {
// //     readonly [K in keyof TupleIndex<T> as Capitalize<K & string>]: N extends true
// //         ? TupleIndex<T>[K]
// //         : K
// // }
// // keyof TupleIndex<T> 看上去和 T[number] 相等，但TupleIndex<T>[K]需要增加约束 & keyof TupleIndex<T> 
// // 因为 TubpleIndex<T> 推导的是T中具体类型，即它会比T[K]得到的更具体
// type Enum<T extends readonly string[], N extends boolean = false> = {
//     readonly [K in T[number] as Capitalize<K & string>]: N extends true
//         ? TupleIndex<T>[K & keyof TupleIndex<T>]
//         : K
// }

// 方案五
// type Format<T extends readonly unknown[], P extends unknown[] = []> = T extends readonly [infer F, ...infer R]
//     ? [[F, P['length']], ...Format<R, [...P, unknown]>]
//     : []
// type Enum<T extends readonly string[], B extends boolean = false> = {
//     readonly [K in Format<T>[number] as Capitalize<K[0]>]: B extends true
//         ? K[1]
//         : K[0]
// }
// type t3 = Format<typeof OperatingSystem>

// 方案六
type TupleIndex<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
    ? TupleIndex<R> | R['length']
    : never;
type Enum<T extends readonly string[], B extends boolean = false> = {
    readonly [K in TupleIndex<T> as Capitalize<T[K]>]: B extends true
        ? K
        : T[K]
}
type t4 = TupleIndex<typeof OperatingSystem>

type EnsureType1<T, C> = T & C
type EnsureType2<T, C> = T extends C ? T : never

type a1 = EnsureType1<'1', string>
type a2 = EnsureType1<string, '1'>
type b1 = EnsureType2<'1', string>
type b2 = EnsureType2<string, '1'>
type a3 = EnsureType1<1, 'string'>
type b3 = EnsureType2<1, 'string'>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const OperatingSystem = ['macOS', 'Windows', 'Linux'] as const
const Command = ['echo', 'grep', 'sed', 'awk', 'cut', 'uniq', 'head', 'tail', 'xargs', 'shift'] as const

type t1 = Enum<typeof OperatingSystem, false>
type t2 = Enum<typeof OperatingSystem, true>

type cases = [
  Expect<Equal<Enum<[]>, {}>>,
  Expect<Equal<
  Enum<typeof OperatingSystem>,
  {
    readonly MacOS: 'macOS'
    readonly Windows: 'Windows'
    readonly Linux: 'Linux'
  }
  >>,
  Expect<Equal<
  Enum<typeof OperatingSystem, true>,
  {
    readonly MacOS: 0
    readonly Windows: 1
    readonly Linux: 2
  }
  >>,
  Expect<Equal<
  Enum<typeof Command>,
  {
    readonly Echo: 'echo'
    readonly Grep: 'grep'
    readonly Sed: 'sed'
    readonly Awk: 'awk'
    readonly Cut: 'cut'
    readonly Uniq: 'uniq'
    readonly Head: 'head'
    readonly Tail: 'tail'
    readonly Xargs: 'xargs'
    readonly Shift: 'shift'
  }
  >>,
  Expect<Equal<
  Enum<typeof Command, true>,
  {
    readonly Echo: 0
    readonly Grep: 1
    readonly Sed: 2
    readonly Awk: 3
    readonly Cut: 4
    readonly Uniq: 5
    readonly Head: 6
    readonly Tail: 7
    readonly Xargs: 8
    readonly Shift: 9
  }
  >>,
]
