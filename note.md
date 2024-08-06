https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md

国内镜像：
https://hub.yzuu.cf/type-challenges/type-challenges/blob/main/questions/00005-extreme-readonly-keys/README.zh-CN.md

# 2. 获取函数返回类型

不使用 `ReturnType` 实现 TS 的 `ReturnType<T>` 泛型

```ts
const fn = (v: boolean) => v ? 1 : 2
type a = MyReturnType<typeof fn> // 1 | 2
```

```ts
type MyReturnType<T> = any
// 1. 通过 infer 推断函数返回类型并返回
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
// 2. any 可能不雅观，改成 unknown
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never
// 3. unknown 也不好，改成 never
type MyReturnType<T> = T extends (...args: never[]) => infer R ? R : never
```

# 3. 实现 Omit

不使用 `Omit` ，实现 TS 中的 `Omit<T, K>` 泛型

`Omit<T, K>` 会创建一个省略 `K` 中字段的 T 对象

```ts
interface Todo {
    title: string
    description: string
    completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'> // {completed: boolean}
```

```ts
type MyOmit<T, K> = any
// 1.
type MyOmit<T, K> = {
    [key in keyof T extends K ? never : key]: T[key]
}
// 2. 会报一个错误：'key' has a circular constraint
type MyOmit<T, K> = {
    [key in keyof T as key extends K ? never : key]: T[key]
}
```

# 4. 实现 Pick

不使用 `Pick<T, K>`，实现 TS 内置的 `Pick<T, K>` 功能

```ts
interface Todo {
    title: string
    description: string
    completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'> // {title: string, completed: boolean}
```

```ts
type MyPick<T, K> = any
// 1.
type MyPick<T, 期望K是一个元组，并且每一项都应该是T拥有的> = any
// 2. keyof T 即是 T 拥有的所有属性, 然后让 K extends 所有属性的元组
type MyPick<T, K extends keyof T> = any
// 3.
type MyPick<T, K extends keyof T> = {[遍历 K]: T对应的值}
// 4.
type MyPick<T, K extends keyof T> = {[key in K]: T[key]}
```

# 5. 获取只读字段

实现泛型 `GetReadonlyKeys<T>`, 它返回由对象 T 所有的只读属性的键组成的联合类型

```ts
interface Todo {
    readonly title: string
    readonly description: string
    completed: boolean
}
type Keys = GetReadonlyKeys<Todo> // title | description
```

```ts
type GetReadonlyKeys<T> = any
// 1. 需要返回联合类型
type GetReadonlyKeys<T> = keyof {
    [不是readonly的K]: T[K]
}
// 2. 
type GetReadonlyKeys<T> = keyof {
    [K in keyof T as K是不是readonly extends true ? K : never]: T[K]
}
// 3.
type GetReadonlyKeys<T> = keyof {
    [K in keyof T as Equal<Pick<T, K>, Readonly<Record<K, T[K]>>> extends true ? K : never]: T[K]
}
// 4. Pick<T, K>, Readonly<Record<K, T[K]>> 再加上 Equal 导致符号太多
// 定义一个 U extends T = Readonly<T>
// Pick<T, K>, Pick<U, K>
type GetReadonlyKeys<T, U extends T = Readonly<T>> = keyof {
    [K in keyof T as Equal<Pick<T, K>, Pick<U, K>> extends true ? K : never]: T[K]
}
```

# 6. 简单的 Vue 类型

实现类似 Vue 的类型支持的简化版本

假设 `SimpleVue` 只接受带有 `data, computed, methods` 字段的 Object 作为其唯一参数

- `data` 是一个简单的函数，它返回一个提供上下文 `this` 的对象，无法在 `data` 中获取其他的计算属性或方法。
- `computed` 将 `this` 作为上下文的函数对象，进行一些计算并返回结果。在上下文中应该暴露计算出的值而不是函数。
- `methods` 是函数的对象，其上下文也是 `this`。函数可以访问 `data, computed, 其他 methods` 中暴露的字段。与 `computed` 不同之处在于 `methods` 在上下文中按原样暴露为函数。

```ts
const instance = SimpleVue({
    data() {
        return {
            firstname: 'Type',
            lastname: 'Challenges',
            amount: 10,
        }
    },
    computed: {
        fullname() {
            return this.firstname + ' ' + this.lastname;
        }
    },
    methods: {
        hi() {
            alert(this.fullname.toLowerCase());
        }
    }
})
```

```ts
declare function SimpleVue(options: any): any
// 1. D, C, M 分别对应 data, computed, methods
declare function SimpleVue<D, C, M>(options: Option<D, C, M>): Option<D, C, M>
// 2. 定义 Option，先添加 data
type Option<D, C, M> = {
    data? : D,
}
// 3. 再添加 computed ，用 ThisType 约束 computed 中的 this
type Option<D, C, M> = {
    data? : D,
    computed?: C & ThisType<D>,
}
// 4. 此时 computed 访问到的 data 类型可能是传入的函数，需要转换成返回的类型
type Option<D, C, M> = {
    //...
    computed? : C & ThisType<D extends () => infer R ? R : D>,
    // 也可以用 ReturnType<D> 代替 R
}
// 5. 添加 methods
type Option<D, C, M> = {
    //...
    methods?: M & ThisType<
        (D extends () => infer R ? R : D) // 类似 computed 处理 data 的方式
        & {[K in keyof C]: C[K] extends (...args: never[]) => any ? ReturnType<C[K]> : C[K]} // computed 需要从 Record<string, function> 转换成 Record<string, ReturnType<fun>>
        & M // methods 还能访问其他的方法
    >
}
```

# 7. 对象属性只读

不使用内置的 `Readonly<T>`，自己实现一个

```ts
interface Todo {
    title: string
    description: string
}
const todo: MyReadonly<Todo> = {
    title: 'Hello',
    description: 'World',
}
todo.title = 'foo' // Error
todo.description = 'bar' // Error
```

```ts
type MyReadonly<T> = any
// 1. 
type MyReadonly<T> = {[遍历T] : T对应的值}
// 2.
type MyReadonly<T> = {[K in keyof T]: T[K]}
// 3. 
type MyReadonly<T> = {设置为只读[K in keyof T]: T[K]}
// 4.
type MyReadonly<T> = {readonly [K in keyof T]: T[K]}
```

# 8. 对象部分属性只读

实现一个泛型 `MyReadonly2<T, K>`，类型 K 指定 T 中要被设置为只读的属性，如果未提供 K ，则所有属性都变为只读，就像普通的 `Readonly<T>` 一样。

```ts
interface Todo {
    title: string
    discription: string
    completed: boolean
}
const todo: MyReadonly2<Todo, 'title' | 'discription'> = {}
todo.completed = true // success
todo.title = 'title' // error
```

```ts
type MyReadonly2<T, K> = any
// 1. 因为 K 可以不提供，所以需要使用 = 提供一个默认值
type MyReadonly2<T, K> = any
// 2. 
type MyReadonly2<T, K extends keyof T = keyof T> = 只读属性对象 & 其他属性对象
// 3. 可以使用内置的 Omit<> & Readonly<Pick<>> 组合
type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> & Readonly<Pick<T, K>>
// 4. 如果不使用内置的方法
type MyReadonly2<T, K extends keyof T = keyof T> = { readonly [R in K]: T[R] } & { [O in keyof T as O extends K ? never : O]: T[O] }
```

# 9. 对象属性只读（递归）

实现一个泛型 `DeepReadonly<T>`，它会将对象的每个属性及子对象的每个属性递归地设为只读。仅考虑处理对象，不用考虑处理数组，函数，类等。

```ts
type X = {
    x: {
        a: 1,
    },
    y: 'hey',
}
type Result = DeepReadonly<X>
/*
Result = {
    readonly x: {
        readonly a: 1,
    },
    readonly y: 'hey',
}
*/
```

```ts
type DeepReadonly<T> = any
// 1.
type DeepReadonly<T> = keyof T extends never ? T : { readonly [K in keyof T]: DeepReadonly<T[K]> }
// 2. 使用 never 部分测试不通过，换用更准确的联合类型？
type Primary = string | number | boolean | Function
// 3.
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends Primary
        ? T[K]
        : DeepReadonly<T[K]>
}
```

# 10. 元组转集合

实现泛型 `TupleToUnion<T>`，返回元组所有值的合集

```ts
type Arr = ['1', '2', '3']
type Test = TupleToUnion<Arr> // '1' | '2' | '3'
```

```ts
type TupleToUnion<T> = any
// 1. 使用 T[number] 表示元组的每一项
type TupleToUnion<T extends any[]> = T[number]
// 2. 或者使用 Array<infer U> 获取到元组的每一项
type TupleToUnion<T extends any[]> = T extends Array<infer ITEM> ? ITEM : never
```

# 11. 元组转换为对象

将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应

```ts
const tuple = ['tesla', 'model 3'] as const;
type result = TupleToObject<typeof tuple> // {tesla: 'tesla', 'model 3': 'model 3'}
```

```ts
type TupleToObject<T extends readonly any[]> = any
// 1.
type TupleToObject<T extends readonly any[]> = {
    [P in <T的值>]: P
}
// 2. 因为 T 是数组，所以使用 in T[number] 即可遍历数组的每个值
type TupleToObject<T extends readonly any[]> = {
    [P in T[number]]: P
} 
```

# 12. 可串联构造器

在 JS 中经常会使用可串联（Chainable / Pipeline）的函数构造一个对象，在 TS 中，能够合理的给它赋上类型吗？

你需要提供两个函数 `option(key, value)` 使用提供的 key 和 value 扩展当前的对象，然后通过 `get()` 获取最终结果

另外 `key` 应该只接受字符串，而 `value` 可以是任何类型。另外 `key` 只能被使用一次。

```ts
const result = config
    .option('foo', 123)
    .option('name', 'type')
    .option('bar', { value: 'Hello World' })
    .get()
// 期望 result 的类型是：
interface Result {
    foo: number
    name: string
    bar: {
        value: string
    }
}
```

```ts
type Chainable = {
    option(key: string, value: any): any
    get(): any
}
// 1. 给 get 提供一个泛型
type Chainable<R> = {
    option(key: string, value: any): any
    get(): R
}
// 2. option() 的返回类型应该是 Chainable, 另外可以提供给 R 一个默认值 {} 或者 object
type Chainable<R = {}> = {
    option(key: string, value: any): Chainable
    get(): R
}
// 3. option() 的返回类型应该是在原有 R 的基础上增加一个{新K: 新V}
type Chainable<R = {}> = {
    option(key: string, value: any): Chainable<R & Record<key的类型, value的类型>>
    get(): R
}
// 4. 另外 K 应该指定为 string 类型
type Chainable<R = {}> = {
    option<K extends string, V>(key: K, value: V): Chainable<R & Record<K, V>>
    get(): R
}
// 5. 因为限制了 key 只能使用一次，所以要判断 K 是否已经包含在 R 的 key 中了
type Chainable<R = {}> = {
    option<K extends string, V>(key: K extends keyof R ? never : K, value: V): Chainable<R & Record<K, V>>
    get(): R
}
// 6. testcase 中 key 可以重复传入只是值的类型不同，所以增加验证只有类型相同时才返回 never
type Chainable<R = {}> = {
    option<K extends string, V>(
        key: K extends keyof R
            ? (V extends R[K] ? K : never)
            : K,
        value: V
    ): Chainable<R & Record<K, V>>
    get(): R
}
// 7. 最后 R & Record<K, V> 会合并相同 K 的不同类型的情况成为一个类型集合，所以应该使用 Omit 保证合并时，是覆盖而非创建成多类型集合
type Chainable<R = {}> = {
    option<K extends string, V>(
        key: K extends keyof R
            ? (V extends R[K] ? K : never)
            : K,
        value: V
    ): Chainable<Omit<R, K> & Record<K, V>>,
    get(): R
}
```

# 13. Hello World

# 14. 第一个元素

实现一个 `First<T>` 泛型，它接受一个数组 `T` 并返回它的第一个元素的类型

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // 'a'
type head2 = First<arr2> // 3
```

```ts
type First<T extends any[]> = any
// 1. 取第一项
type First<T extends any[]> = T[0] 
// 2. 上面的定义在 Expect<Equal<First<[]>, never>> 时会报错, 所以需要一些手段判断传入元组是否为空
// 2.1 如果是空数组返回 never 否则返回 T[0]
type First<T extends any[]> = T extends [] ? never : T[0]
// 2.2 如果 'length' 为 0 返回 never 否则返回 T[0]
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]
// 2.3 如果是 [F, ...rest] 则返回 F 否则返回 never
type First<T extends any[]> = T extends [infer F, ...infer Rest] ? F : never
```

# 15. 最后一个元素

实现一个 `Last<T>` 泛型，它接受一个数组 `T` 并返回最后一个元素的类型

```ts
type arr = ['a', 1]
type tail = Last<arr> // 1
```

```ts
type Last<T extends any[]> = any
// 1. 
type Last<T extends any[]> = 访问 T 的最后一项
// 2. 因为只有 T['length'] 可用，但是它访问的是结尾后的一项，所以想办法让 T.length + 1，即整体往后移一格
type Last<T extends any[]> = [never, ...T][T['length']]
// 3. 或者用 infer 把数组前面的和最后一项分开
type Last<T extends any[]> = T extends [...infer R, infer L] ? L : never
```

# 16. 排除最后一项

实现一个泛型 `Pop<T>`，它接受一个数组 `T` ，并返回一个由数组 T 的前 N-1 项（N 为 T 的长度）以相同的顺序组成的数组。

```ts
type arr = [3, 2, 1]
type re = Pop<arr> // [3, 2]
```

```ts
type Pop<T extends any[]> = any
// 1. 
type Pop<T extends any[]> = T extends [...infer R, any] ? R : never
// 2. Equal<Pop<[]>, []> 会报错，所以需要针对空数组单独处理
type Pop<T extends any[]> = T['length'] extends 0
    ? T
    : T extends [...infer R, any] ? R : never
```

实现 `Shift, Push, Unshift`

```ts
type Shift<T extends any[]> = T extends [infer F, ...infer R] ? R : never

type Push<T extends any[], P> = [...T, P]

type Unshift<T extends any[], P> = [P, ...T]
```

# 17. 柯里化 1

柯里化是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术

```ts
const add = (a: number, b: number) => a + b
const three = add(1, 2)

const curriedAdd = Currying(add)
const five = curriedAdd(2)(3)
```

传递给 `Curring` 的函数可能有多个参数，需要正确反映它们的类型。这里只要求柯里化后的函数每次仅接受一个参数，接受完所有参数后，应该返回其结果

```ts
declare function Currying(fn: any): any
// 1.
declare function Currying<F>(fn: F): Curried<F>
// 2.
type Curried<F> = F extends (...args: infer A) => infer R
    ? A extends [infer AF, ...infer O]
        ? (arg: AF) => Curried<(...args: O) => R>
        : R
    : never
// 3. Equal<typeof curried3, () => true> 测试不通过
type Curried<F> = F extends (...args: infer A) => infer R
    ? A extends [infer AF, ...infer O]
        ? 如果 O 的参数总数为0 直接返回 (arg) => R 
        : R
    : never
// 4.
type Curried<F> = F extends (...args: infer A) => infer R
    ? A extends [infer AF, ...infer O]
        ? (arg: F) => O['length'] extends 0
            ? R
            : Curried<(...args: O) => R>
        : () => R
    : never
```

# 18. 获取元组长度

创建一个 `Length` 泛型，这个泛型只接受一个只读的元组，并返回这个元组的长度

```ts
type tesla = ['tesla', 'model 3']
type spaceX = [1, 2, 3]

type teslaLength = Length<tesla> // 2
type spaceXLength = Length<spaceX> // 3
```

```ts
type Length<T> = any
// 1. 
type Length<T只接受一个只读元组> = any
// 2. 
type Length<T extends readonly any[]> = any
// 3.
type Length<T extends readonly any[]> = 访问 T 的长度属性 
// 4. 
type Length<T extends readonly any[]> = T['length']
// 5. 如果要检测 T 是否有 length 属性，可以写成这样
type Length<T extends readonly any[]> = T extends { length: infer L } ? L : never
```

# 20. PromiseAll

给函数 `PromiseAll` 指定类型，它接受 Promise 或类似 Promise 的对象的数组，返回值应为 `Promise<T>`，其中 T 应该是这些 Promise 结果类型组成的数组

```ts
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo')
})

const p = PromiseAll([promise1, promise2, promise3] as const) // Promise<[number, 42, string]>
```

```ts
declare function PromiseAll(values: any): any
// 1.
declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<{[K in keyof T]: T[K] extends Promise<infer R> | infer R ? R : T[K]}>
```

关于为何 `Promise<{[K in keyof T]: xxx}> somehow equal Promise<[xxx, xxx, xxx]`

```ts
type Tuple = ['a', 'b']
type funcReturnTuple<T extends unknow[]> = ([...T]) => {
    [P in keyof T]: ''
}
type case = funcReturnTuple<Tuple> // ([...T]: Iterable<any> => ['', ''])
```

# 43. 实现 Exclude

实现内置的 `Exclude<T, U>` 类型

`Exclude<T, U>：从联合类型 T 中排除 U 中的类型，来构造一个新的类型`

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

```ts
type MyExclude<T, U> = any
// 1.
type MyExclude<T, U> = 只要 T 是继承于 U 就返回 never 否则返回 T
// 2.
type MyExclude<T, U> = T extends U ? never : T
```

# 55. 联合类型转化为交叉类型

实现高级工具类型 `UnionToIntersection<U>`

```ts
type I = UnionToIntersection<'foo' | 42 | true> // 'foo' & 42 & true
```

```ts
type UnionToIntersection<U> = any
// 1. 函数的参数在逆变位置上，而根据 ts 规范，逆变位置上同一个类型的多个候选会被推断成交叉类型
type ToUnionOfFunction<T> = T extends any ? (arg: T) => any : never
// 2.
type UnionToIntersection<U> = ToUnionOfFunction<U> extends (a: infer U) => any ? U : never;
```

# 57. 获得必需的属性

实现高级工具类型 `GetRequired<T>`，该类型保留所有必需的属性

```ts
type I = GetRequired<{ foo: number, bar?: string }> // { foo: number }
```

```ts
type GetRequired<T> = any
// 1.
type GetRequired<T> = {
    [K只要K是满足 T[K] 为 Required的]: T[K]
}
// 2.
type GetRequired<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}
// 3. 或者不使用 Required<T>, 使用 -? 代替
type GetRequired<T> = {
    [K in keyof T as {[P in K]: T[K]} extends {[P in K]-?: T[K]} ? K : never]: T[K]
}
```

# 59. 获得可选属性

实现高级工具类型 `GetOptional<T>`，该类型保留所有可选属性

```ts
type I = GetOptional<{ foo: number, bar?: string }> // { bar?: string } 
```

```ts
type GetOptional<T> = any
// 1. 和 GetRequired 一样，只是 ? 后的返回换一下
type GetOptional<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? never : K]:T[K]
}
// 2. 如果无法在 TS4.1 及以上使用 as，则可以换个思路
type GetOptional<T> = Pick<T, 所有Optional属性>
// 3.
type Opt<T> = {[K in keyof T]-? : {} extends Pick<T, K> ? K : never}[keyof T] // 得到 optional key 的联合类型
// 4. 
type GetOptional<T> = Pick<T, Opt<T>>
```

# 62. 查找类型

假设想通过指定公共属性 `type` 的具体值，从联合类型中查找到此 `type` 对应的类型

```ts
interface Cat {
    type: 'cat'
    breeds: 'A' | 'B'
}
interface Dog {
    type: 'dog',
    breeds: 'C' | 'D'
    color: 'brown' | 'white'
}
type MyDog = LookUp<Cat | Dog, 'dog'> // interface Dog
```

```ts
type LookUp<U, T> = any
// 1.
type LookUp<U, T> = U extends { type: T } ? U : never
// 2. 这样写法无法保证输入的可靠性，即 LookUp<Cat | Dog, 1> 也是可以输入的，如果想在 1 这里提示必须输入 type 有的值，可以这样：
type LookUp<U extends { type: any }, T extends U['type']> = U extends { type: T } ? U : never
```

# 89. 必需的键

实现高级工具类型 `RequiredKeys<T>`, 返回 T 中所有必需属性的键组成的联合类型

```ts
type Result = RequiredKeys<{ foo: number, bar?: string }> // "foo"
```

```ts
type RequiredKeys<T> = any
// 1.
type RequiredKeys<T, K = keyof T> = K extends keyof T
    ? T extends Required<Pick<T, K>>
        ? K
        : never
    : never
// 2. 如果不使用 Required
type RequiredKeys<T> = {
    [K in keyof T]-?: Pick<T, K> 是否等于 Required<Pick<T, K>> ? K : never
}[keyof T]
// 3. IsEqual<X, Y>
type RequiredKeys<T> = {
    [K in keyof T]-?: IsEqual<{[P in K]: T[P]}, { [P in K]-? : T[P] }> extends true ? K : never
}[keyof T]
```

# 90. 可选类型的键

实现高级工具类型 `OptionalKeys<T>`，返回 T 中所有可选属性的键组成的联合类型

```ts
type OptionalKeys<T> = any
// 1. 
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
// 2. 或者使用 Required
type OptionalKeys<T, K = keyof T> = K extends keyof T
    ? T extends Required<Pick<T, K>> ? never : K
    : never
```

# 106. 去除左侧空白

实现 `TrimLeft<T>`，它返回的是删除了输入的 T 字符串开头空白的字符串。

```ts
type trimed = TrimLeft<' Hello World '> // 'Hello World '
```

```ts
type TrimLeft<S extends string> = any
// 1. 定义 Space
type Space = ' ' | '\t' | '\n'
// 2. 
type TrimLeft<S extends string> = S extends `${Space}${infer R}` ? TrimLeft<R> : S;
```

# 108. 去除两端空白字符

实现 `Trim<T>`，它接受一个明确的字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。

```ts
type trimed = Trim<' Hello World '> // 'Hello World'
```

```ts
type Trim<S extends string> = any
// 1. 和 TrimLeft 类似，只是要拿到左|右则的字符串
type Space = ' ' | '\t' | '\n'
type Trim<S extends string> = S extends `${Space}${infer R}` | `${infer R}${Space}`
    ? Trim<R>
    : S
// 2. TrimLeft / TrimRight
type TrimLeft<S extends string> = S extends `${Space}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer R}${Space}` ? TrimRight<R> : S
// 3. TrimAlternate
type TrimAlt<S extends string> = TrimRight<TrimLeft<S>>;
```

# 110. Capitalize

实现 `Capitalize<T>` 它将字符串 T 的第一个字母转换为大写，其余字母保持不变。

```ts
type capitalized = Capitalize<'hello world'> // 'Hello world'
```

```ts
type MyCapitalize<S extends string> = any
// 1.
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}` : S
// 2. 关于字符串中的 infer 推导规则：
// 如果不包含其他规则，则前面的 infer 只会推导一个字符，最后一个 infer 会推导剩下所有的字符
type Type<S extends string> = S extends `${infer A}${infer B}${infer O}`
    ? A
    : S
type Result = Type<'hello'> // A: 'h', B: 'e', O: 'llo' 
// 3. 如果增加了推导条件，则会按推导条件对字符串进行分割
type Split<S> = S extends `${infer L}-${infer R}` ? `${infer L} ${infer R}` : never
type Result = Split<'021-123'> // L: '021', $: '123'
```

# 112. Capitalize Words

实现 `CapitalizeWords<T>`，它将字符串中的每个单词的第一个字母转换为大写，其他部分保持原样

```ts
type capitalized = CapitalizeWords<'hello world, my friends'> // 'Hello World, My Friends'
```

```ts
type CapitalizeWords<S extends string> = any
// 1.
type CapitalizeRest<S extends string> = S extends `${infer F}${infer R}`
    ? `${F}${CapitalizeRest<Uppercase<F> extends Lowercase<F> ? Capitalize<R> : R>}`
    : S;
type CapitalizeWords<S extends string> = Capitalize<CapitalizeRest<S>>
```

# 114. CamelCase

实现 `CamelCase<T>`，将 `snake_case` 类型的字符串转换为 `camelCase` 形式。

```ts
type camelCase1 = CamelCase<'hello_world_with_types'> // helloWorldWithTypes
type camelCase2 = CamelCase<'HELLO_WORLD'> // helloWorld
```

```ts
type CamelCase<S extends string> = any
// 1. 传入的字符串递归演变大概是这样的：
// hello${R} -> helloWorld${R} -> helloWorldWith_${R} -> helloWorldWithTypes
type CamelCase<S extends string> = S extends `${infer L}_${infer F}${infer R}`
    ? 如果是 左边 + _ + 首字母 + 其他部分的格式需要递归调用
    : Lowercase<S> // 只有一个单词，全小写即可
// 2. 
type CamelCase<S extends string> = S extends `${infer L}_${infer F}${infer R}`
    ? 如果 F 不包含大小写（即 $ _ 这种）
        ? L + CamelCase<F + R>
        : L + Uppercase<F> + CamelCase<R>
    : Lowercase<S>
// 3.
type CamelCase<S extends string> = S extends `${infer L}_${infer F}${infer R}`
    ? Uppercase<F> extends Lowercase<F>
        ? `${Lowercase<L>}_${CamelCase<`${F}${R}`>}`
        : `${Lowercase<L>}${Uppercase<F>}${CamelCase<R>}`
    : Lowercase<S>
```

# 116. Replace

实现 `Replace<S, From, To>` 将字符串 S 中的第一个子字符串 Form 替换为 To

```ts
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 'types are awesome!' 
```

```ts
type Replace<S extends string, From extends string, To extends string> = any
// 1.
type Replace<S extends string, From extends string, To extends string> = From extends ''
    ? S
    : S extends `${infer L}${From}${infer R}`
        ? `${L}${To}${R}`
        : S
// 2. 或者
type Replace<S extends string, From extends string, To extends string> = 
    S extends `${infer L}${From extends '' ? never : From}${infer R}`
        ? `${L}${To}${R}`
        : S
```

# 119. ReplaceAll

实现 `ReplaceAll<S, From, To>` 将字符串 S 中所有子串 From 替换为 To

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''> // 'types'
```

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = any
// 1. 将 Replace 递归调用
type ReplaceAll<S extends string, From extends string, To extends string> = 
    S extends `${infer L}${From}${infer R}`
        ? `${L}${To}${ReplaceAll<R, From, To>}`
        : S
// 2. From 有可能找不到所以别忘了处理
type ReplaceAll<S extends string, From extends string, To extends string> = 
    S extends `${infer L}${From extends '' ? never : From}${infer R}`
        ? `${L}${To}${ReplaceAll<R, From, To>}`
        : S
```

# 147. C printf

C 语言中 `printf` 可以指定打印的格式：

```c
printf("The result is %d", 42);
```

期望实现一个泛型，传入 `"The result is %d"` 可以返回元组 ['dec']，转换关系如下：

```ts
type ControlsMap = {
    c: 'char',
    s: 'string',
    d: 'dec',
    o: 'oct',
    h: 'hex',
    f: 'float',
    p: 'pointer',
}
```

```ts
type ParsePrintFormat = any
// 1. 
type ParsePrintFormat<T> = T extends `${string}%${infer C}${infer R}`
    ? C extends keyof ControlsMap
        ? [ControlsMap[C], ...ParsePrintFormat<R>]
        : ParsePrintFormat<R>
    : []
```

# 151. Query String Parser

- 如果只有键没有值，则值转换为 true，即 `/?key` 转换为 `{key: true}`
- 多个重复的键需要合并成一个键，它的值应该是个元组
- 如果键的值只有一个，则它的值不应是个元组
- 如果多个重复的键的值也是相同的，即 `key=value&key=value`，应该合并成 `key=value` 再转换

```ts
type ParseQueryString = any
// 1.
type ParseQueryString<S extends string> = S extends '' ? {} : MergeParams<SplitParams<S>>
// 2. SplitParams 负责将 'k1=v1&k2=v2&k3&k1' 拆分成 ['k1=v1', 'k2=v2', 'k3', 'k1']
type SplitParams<S extends string> = S extends `${infer KV}&${infer R}`
    ? [KV, SplitParams<R>]
    : [S]
// 3. 
type MergeParams<T extends string[], M = {}> = T extends [infer E, ...infer R extends string[]]
    ? E extends `${infer K}=${infer V}`
        ? MergeParams<R, SetProperty<M, K, V>>
        : E extends `${infer K}`
            ? MergeParams<R, SetProperty<M, K>>
            : never
    : M
// 4. 
type SetProperty<M, K extends PropertyKey, V = true> = {
    [P in keyof M | K]: P extends K
        ? P extends keyof M
            ? M[P] extends V
                ? M[P]
                : M[P] extends any[]
                    ? V extends M[P][number] ? T[P] : [...M[P], V]
                    : [M[P], V]
            : V
        : P extends M ? M[P] : never
}
```

# 189. Awaited

假如有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，使用 Promise<T> 中的 T 来描述这个返回的类型。

实现一个类型，可以获取这个 T 类型

```ts
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

```ts
type MyAwaited<T> = any
// 1. 使用 PromiseLike
type MyAwaited<T> = T extends PromiseLike<infer U> ? U : never
// 2. 这种写法无法解决 type Z = Promise<Promise<string | number>> 即 Promise<T> T 又是一个 Promise
type MyAwaited<T> = T extends PromiseLike<infer U>
    ? 如果 U 又是一个 Promise
    : never
// 3.
type MyAwaited<T> = T extends PromiseLike<infer U>
    ? U extends PromiseLike<unknow>
        ? MyAwaited<U>
        : U
    : never
// 4. 如果不能使用 PromiseLike 就自己定义一个
type Thenable<T> = { then: (onfulfilled: (...args: T[]) => unknown ) => unknown }
type ExtendedPromise<T> = Promise<T> | Thenable<T> // Promise<T> 或者任何有 .then 的类型
type MyAwaited<T> = T extends ExtendedPromise<infer U>
    ? U extends ExtendedPromise<unknow>
        ? MyAwaited<U>
        : U
    : never
```

# 191. 追加参数

实现一个泛型 `AppendArgument<Fn, A>`，对于给定的函数类型 Fn, 以及一个任意类型 A。返回一个新的函数 G，G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。

```ts
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> // (a: number, b: string, x: boolean) => number
```

```ts
type AppendArgument<Fn, A> = any
// 1.
type AppendArgument<Fn, A> = Fn extends (...args: infer REST) => infer RETURN
    ? (...args: [...REST, A]) => RETURN
    : never
// 2. 对 Fn 作一下限制
type AppendArgument<Fn extends Function, A> = ...
// 3. 或者使用内置工具类型 Parameters 和 ReturnType
type AppendArgument<Fn extends (...args: any) => any, A> = (...args:[Parameters<Fn>, A]) => ReturnType<Fn> 
```

# 213. Vue Basic Props

基于 #6 Simple Vue，添加 props 属性，它用来定义外部传入的 props 的类型，如：

```ts
{
    props: {
        foo: Boolean,
    }
}
// 或者
{
    props: {
        foo: { type: Boolean }
    }
}
// 当属性有多个类型时，需要转换为联合属性
{
    props: {
        foo: { type: [Boolean, Number, String] }
    }
} // type Props = { foo: boolean | number | string }
```

```ts
declare function VueBasicProps(options: any): any
// 1. 增加 P
declare function VueBasicProps<P, D, C, M>(options: Option<P, D, C, M>): Option<P, D, C, M>
type Option<P, D, C, M> = {
    props?: P,
    data?: (this: PropsType<P>) => D,
    computed?: C & ThisType<(D extends () => any ? ReturnType<D> : D) & PropsType<P>>,
    methods?: M & ThisType<(D extends () => any ? ReturnType<D> : D) & ComputedValueType<C> & M & PropsType<P>>
}
type ComputedValueType<C> = {
    [K in keyof C as C[K] extends () => any ? K : never]:
        C[K] extends () => any ? ReturnType<C[K]> : C[K]
}
// 2. PropsType
type PropsType<T> = {
    [P in keyof T]: {} extends T[P]
        ? any
        : T[P] extends { type: any }
            ? T[P]['type'] extends (infer R)[] // 这里使用 any[] 会导致传入 ConverArrayPropType<T[P]['type]> 是 StringConstructor 
                ? ConverArrayPropType<R>
                : ConvertInstanceType<T[P]['type']>
            : ConvertInstanceType<T[P]>
}
// 3. 用 ReturnType 和 InstanceType 区分值类型和对象类型？
type ConvertInstanceType<T> = T extends new (args: any) => any
    ? T extends typeof String | typeof Boolean | typeof Number
        ? ReturnType<T>
        : InstanceType<T>
    : T
type ConverArrayPropType<T, U = T> = T extends U
    ? ConvertInstanceType<T>
    : never
```

另外将 `StringConstructor` 转换为 `string` 可以这样：

```ts
type PropConstructor<T> = | { new (...args: any[]): T & object } | { (): T }
type InferPropType<P> = P extends PropConstructor<infer T>
    ? unknown extends T
        ? any
        : T
    : any;
```

# 216. Slice

实现一个泛型 `Slice<Arr, Start, End>`，它和 JS 中的 `Array.slice` 功能类似，会返回由 Start 和 End 指定的 Arr 中的部分数组。

```ts
type Arr = [1, 2, 3, 4, 5]
type Result = Slice<Arr, 2, 4> // [3, 4]
```

```ts
type Slice<Arr, Start, End> = any
// 1. 过于复杂，直接查看 00216-extreme-slice.ts 的 Source Code
```

# 223. IsAny

实现一个泛型 `IsAny<T>`，当输入的 T 类型是 any 时，返回 true，其他都返回 false。

```ts
type IsAny<T> = any
// 1. 方案一
type IsAny<T> = 0 extends (1 & T) ? true : false
// 2. 方案二
type IsAny<T> = [{}, T] extends [T, null] ? true : false
// 3. 方案三
type IsAny<T> = ((a: [any]) => [any]) extends (a: T) => [T] ? true : false
// 4. 方案四
type IfEquals<X, Y, A=X, B=never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B
type IsAny<T> = IfEquals<T, any, true, false>
```

# 268. If

实现一个 `If` 类型，`If<C, T, F>` 接收一个条件类型 `C`，判断为真时返回 `T`，判断为假时返回 `F`。`C` 只能是 `true / false`

```ts
type A = If<true, 'a', 'b'> // a
type B = If<false, 'a', 'b'> // b
```

```ts
type If<C, T, F> = any
// 1. 使用三元
type If<C extends boolean, T, F> = C extends true ? T : F
```

要特别注意 boolean 他作为类型时，是个联合类型

```ts
type Q = boolean extends true ? 1 : 2 // return 2
// 因为 boolean = true | false
// (true extends true === true) &&( false extends true === false)
// true && false === false
```

# 270. Typed Get

实现一个类似 `lodash.get` 的泛型工具。

```ts
type Data = {
    foo: {
        bar: {
            value: 'foobar',
            count: 6,
        },
        included: true,
    },
    hello: 'world',
}
type A = Get<Data, 'hello'> // 'world'
type B = Get<Data, 'foo.bar.count'> // 6
type C = Get<Data, 'foo.bar'> // { value: 'foobar', count: 6 }
```

```ts
type Get<T, K> = string
// 1.
type Get<T, K> = K extends `${infer F}.${infer R}`
    ? F extends keyof T
        ? Get<T[F], R>
        : never
    : K extends keyof T
        ? T[K]
        : false
```

# 274. Integers Comparator

实现一个泛型工具 `Comparator<A, B>` 用来比较 A B 的大小

```ts
type Comparator<A extends number, B extends number> = any
// 1. 直接查看 00274-extreme-integers-comparator.ts SourceCode
```

# 296. Permutation

实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型

```ts
type perm = Permutation<'A' | 'B' | 'C'>
// ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

```ts
type Permutation<T> = any
// 1.
type Permutation<T, K = T> = [T] extends [never]
    ? []
    : K extends K
        ? [K, ...Permutation<Exclude<T, K>>]
        : never
```

# 298. Length of String

计算字符串的长度，类似 `String.length`

```ts
type LengthOfString<S extends string> = any
// 1. 将字符串递归转换成数组，再获取数组的长度
type LengthOfString<S extends string, A extends string[] = []> = 
    S extends `${infer F}${infer R}`
        ? LengthOfString<R, [F, ...A]>
        : A['length']
```

# 300. String to Number

将字符串转换成数字，类似 `Number.parseInt`

```ts
type ToNumber<S extends string> = any
// 1. 貌似只有数组的length可以返回数字，一种想法是往一个数组中间追加任意东西，直到数组的length和S相同
type ToNumber<S extends string, T extends any[] = []> = S extends `${T['length']}`
    ? T['length']
    : ToNumber<S, [...T, any]>
// 2. 上面的方法只支持string是正确的数字字符串，否则理论上是会无限循环下去的，所以直接通过`infer N extends number` 强制转换，如果成功就是数字，如果失败直接返回 never
type ToNumber<S extends string> = S extends `${infer N extends number}`
    ? N
    : never
```

# 399. Tuple Filter

实现一个泛型 `FilterOut<T, F>`，它会将 F 从元组 T 中过滤掉。

```ts
type Filtered = FilterOut<[1, 2, null, 3], null> // [1, 2, 3]
```

```ts
type FilterOut<T extends any[], F> = any
// 1.
type FilterOut<T extends any[], F> = T extends [infer R, ...infer Rest]
    ? R extends F
        ? FilterOut<Rest, F>
        : [R, ...FilterOut<Rest, F>]
    : []
// 2. 对于 never 无法正确处理，如 FilterOut<[never], never>，将 `R extends F` 改成 `[R] extends [F]`
type FIlterOut<T extends any[], F> = T extends [infer R, ...infer Rest]
    ? [R] extends [F]
        ? FilterOut<Rest, F>
        : [R, ...FilterOut<Rest, F>]
    : []
```

# 459. Flatten

实现一个 `Flatten`，它可以将传入的数组扁平化后返回。

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

```ts
type Flatten = any
// 1. 新增一个数组用来存放已经扁平化后的结果
type Flatten<T extends unknown[], R extends unknown[] = []> = 
    T extends [infer F, ...infer Rest]
        ? F extends unknown[]
            ? Flatten<[...F, ...Rest], R>
            : Flatten<Rest, [...R, F]>
        : R
// 2. 不用临时数组的方案：
type Flatten<T> = T extends [infer F, ...infer R]
    ? F extends unknown[]
        ? [...Flatten<F>, ...Flatten<R>] // F R 都需要继续 flat
        : [F, ...Flatten<R>] // R 继续 flat
    : T
```

# 462. 柯里化2

Currying 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

但在前端，柯里化函数参数个数动态化更常见，例如 `Function.bind(this, [...params])`

```ts
const func = (a: number, b: number, c: number) => {
    return a + b + c
}
const bindFunc = func.bind(null, 1, 2)
const result = bindFunc(3) // 6
```

实现一个动态参数化的柯里化函数

```ts
const add = (a: number, b: number, c: number) => a + b + c
const three = add(1, 1, 1)

const curriedAdd = DynamicParamsCurring(add)

const six = curriedAdd(1, 2, 3)
const seven = curriedAdd(1, 2)(4)
const eight = curriedAdd(2)(3)(4)
```

```ts
declare function DynamicParamsCurrying(fn: any): any
// 1.
declare function DynamicParamsCurring<A extends unknown[], R>(fn: (...args: A) => R): Curry<A, R>
// 2.
type Curry<A, R, D extends unknown[] = []> = A extends [infer H, ...infer T]
    ? T extends []
        ? (...args: [...D, H]) => R
        : ((...args: [...D, H]) => Curry<T, R>) & Curry<T, R, [...D, H]>
    : () => R
```

# 472. Tuple to Enum Object

枚举是 TS 的一种原生语法（JS 中不存在）。因此在 JS 中，枚举会被转换成如下形式的代码：

```js
let OperatingSystem
;(function (OperatingSystem) {
    OperatingSystem[(OperatingSystem['MacOS'] = 0)] = 'MacOS'
    OperatingSystem[(OperatingSystem['Windows'] = 1)] 'Windows'
    OperatingSystem[(OperatingSystem['Linux'] = 2)] = 'Linux'
})(OperatingSystem || (OperatingSystem = {}))
```

实现的类型应该将给定的字符串元组转成一个行为类似枚举的对象。另外枚举属性一般是 `pascal-case` 的。

```ts
Enum<['macOS', 'Windows', 'Linux']>
// { readonly MacOS: 'macOS', readonly Windows: 'Windows', readonly Linux: 'Linux' }
```

如果传递了第二个泛型参数，且值为 `true`。那么返回值应该是一个 `number` 字面量。

```ts
Enum<['macOS', 'Windows', 'Linux'], true>
// { readonly MacOS: 1, readonly Windows: 2, readonly Linux: 3 }
```

```ts
type Enum<T extends readonly string[], N extends boolean = false> = any
// 1. 方案一 - 方案四直接看 00472-hard-tuple-to-enum-object.ts 的 SourceCode
// 2. 方案五 先将['a', 'b', 'c'] 转换成 [['a', 0], ['b', 1], ['c', 2]]
type Format<T extends readonly unknown[], P extends unknown[] = []> = T extends readonly [infer F, ...infer R]
    ? [[F, P['length']], ...Format<R, [...P, unknown]>]
    : []
// Format<T>[number] = ['a', 0]
type Enum<T extends readonly string[], B extends boolean = false> = {
    readonly [K in Format<T>[number] as Capitalize<K[0]>]: B extends true
        ? K[1]
        : K[0]
}
// 3. 方案六 或者只转换下标
type TupleIndex<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
    ? TupleIndex<R> | R['length']
    : never
// TupleIndex = 0 | 1 | 2
type Enum<T extends readonly string[], B extends boolean = false> = {
    readonly [K in TupleIndex<T> as Capitalize<T[K]>]: B extends true
        ? K
        : T[K]
}
```

关于 `&` 交叉类型

```ts
// 交叉类型可以用来作类型约束
type EnsureType<T, C> = T & C

type a = EnsureType<'1', string> // '1'
type b = EnsureType<1, string> // never

// 交叉类型也可以用来合并类型
type r = Readonly<{a: string} & {b : string}>
// { readonly a: string; readonly b: string }
```

# 476. Sum

实现一个泛型 `Sum<A, B>`，如果两个参数都是非否整数，则相加并返回结果对应的字符串。参数类型可以是 `string/number/bigint`

```ts
type T0 = Sum<2, 3> // '5'
type T1 = Sum<'13', '21'> // '34'
type T2 = Sum<'328', 7> // '335'
type T3 = Sum<1_000_000_000_000n, '123'> // '1000000000123'
```

```ts
type Sum<A extends string | number | bigint, B extends string | number | bigint> = string
// 1. 见 00476-extreme-sum.ts source code
```

# 517. Multiply

实现一个泛型 `Multiply<A, B>`，如果两个参数都是非否整数，则相乘并返回结果对应的字符串。参数类型可以是 `string/number/bigint`

```ts
type T0 = Multiply<2, 3> // '6'
type T1 = Multiply<3, '5'> // '15'
type T2 = Multiply<'4', 10> // '40'
type T3 = Multiply<0, 16> // '0'
type T4 = Multiply<'13', '21'> // '273'
type T5 = Multiply<'43423', 321543n> // '13962361689'
```

```ts
type Multiply<A extends string | number | bigint, B extends string | number | bigint> = string
// 1. 见 00517-extreme-multiply.ts source code
// 2. source code 中有一个简易实现，它只能解决小数字相乘，比如 123 X 45，但它的思路值得借鉴
// 123 X 45 = (3 * 5) + (3 * 4 * 10) + (2 * 5) + (2 * 5 * 10) + (2 * 4 * 100) + (1 * 5 * 100) + (1 * 4 * 1000)
```

# 527. Append to object

实现一个为接口添加一个新字段的类型。

```ts
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // { id: '1', value: 4 }
```

```ts
type AppendToObject<T, U, V> = any
// 1. 遍历T和U，如果P(key)是T下的就用{P: T[P]}否则就是{P: V}
type AppendToObject<T, U, V> = {
    [P in keyof T | U]: P extends keyof T ? T[P] : V
}
// 2. [] 这里也报错，需要限制一个 U 的类型，可以是 string 或者 PropertyKey
type AppendToObject<T, U extends string, V> = {
    [P in keyof T | U]: P extends keyof T ? T[P] : V
}
// 3. 另一种方法，直接遍历 U 然后把结果和 T 作合并(&)
type AppendToObject<T, U extends string, V> = {
    [P in U]: V
} & T
// 4. 但会报错，因为
type test = {
    key: 'cat'
}
type Result = AppendToObject<test, 'home', boolean> // { home: boolean } & test 并没有把 test 展开
// 5. 所以可以用 Omit 强制展开一下
type AppendToObject<T, U extends string, V> = Omit<{
    [P in U]: V
} & T, never>
type Result = AppendToObject<test, 'home', boolean> // 结果就是正确的 { home: boolean, key: 'cat' }
```

# 529. Absolute

实现一个接收 `string/number/bigint` 类型的参数的 `Absolute` 类型，返回一个正数字符串

```ts
type Test = -100;
type Result = Absolute<Test>; // '100'
```

```ts
type Absolute<T extends number | string | bigint> = any
// 1. 通过 `` 截取 - 符号
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer R}` ? R : `${T}`
// 2. 或者通过新增加一个 U ，把 `${T}` 写到统一的地方
type Absolute<T extends number | string | bigint, U = `${T}`> = U extends `-${infer R}` ? R : U
```

# 531. String to Union

实现一个将接收到的 `String` 参数转换为一个字母 `Union` 类型

```ts
type Result = StringToUnion<'123'> // '1' | '2' | '3'
```

```ts
type StringToUnion<T extends string> = any
// 1.
type StringToUnion<T extends string> = T extends `${infer F}${infer R}`
    ? F | StringToUnion<R>
    : never
// 2. 或者先把字符串abc拆成[a, b, c]，然后通过遍历数组[number]获取联合类型
type Split<S extends string> = S extends ''
    ? []
    : S extends `${infer F}${infer R}`
        ? [F, ...Split<R>]
        : [S]
type StringToUnion<T extends string> = Split<T>[number]
```

# 533. Concat

在类型系统中实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该是按照输入参数从左到右的顺序合并为一个新的数组

```ts
type Result = Concat<[1], [2]> // [1, 2]
```

```ts
type Concat<T, U> = any
// 1. 利用 ... 解构运算符
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
// 2. Concat<typeof tuple, typeof tuple>, [1, 1]> 会报错, 根据错误提示加上 readonly
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [...T, ...U]
```

# 545. printf

```ts
type FormatCase1 = Format<'%sabc'> // string => string
type FormatCase2 = Format<'%s%dabc'> // string => number => string
type FormatCase3 = Format<'sdabc'> // string
type FormatCase4 = Format<'sd%abc'> // string
```

```ts
type Format<T extends string> = any
// 1. 先定义一个字典，碰到%s就是string, %d 就是 number
type MapDict = {
    s: string;
    d: number;
}
// 2.
type Format<T extends string> = T extends `${string}%${infer M}${infer R}`
    ? M extends keyof MapDict
        ? (x: MapDict[M]) => Format<R>
        : Format<R>
    : string
```

# 553. Deep object to unique

```ts
type Foo = { foo: 2; bar: { 0: 1 }; baz: { 0: 1 } }
type UniqFoo = DeepObjectToUniq<Foo>

let foo:Foo, uniqFoo: UniqFoo
uniqFoo = foo // ok
foo = uniqFoo // ok

Equal<UniqFoo, Foo> // false
UniqFoo['foo'] // 2
UniqFoo['bar'][0] // 1
Equal<keyof Foo & string, keyof UniqFoo & string> // true
```

```ts
type DeepObjectToUniq<O extends object> = any
// 1. 查看 00553-hard-deep-object-to-unique.ts source code
```

# 599. Merge

将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键

```ts
type foo = {
    name: string;
    age: string;
}
type coo = {
    age: number;
    sex: string;
}
type Result = Merge<foo, coo> // { name: string, age: number, sex: string }
```

```ts
type Merge<F, S> = any
// 1.
type Merge<F, S> = {
    [K in keyof F | keyof S]: K extends keyof S
        ? S[K]
        : K extends keyof F
            ? F[K]
            : never
}
// 2. 或者使用 Omit
type Merge<F, S> = Omit<F, keyof S> & S
// 3. 但是会在test中出错，因为返回的类型需要使用[K in keyof]把类型的每个属性遍历开
type Merge<F, S, P = Omit<F, keyof S> & S> = {
    [K in keyof P]: P[K]
}
```

# 612. KebabCase

将 `camelCase` 或 `PascalCase` 字符串转换成 `kebab-case`

```ts
type FooBarBaz = KebabCase<'FooBarBaz'> // foo-bar-baz
type DoNothing = KebabCase<'do-nothing'> // do-nothing
```

```ts
type KebabCase<S> = any
// 1. Uncapitalize<S> 会将首字母转换成小写
type KebabCase<S> = S extends `${infer F}${infer R}`
    ? R extends Uncapitalize<R>
        ? `${Uncapitalize<F>}${KebabCase<R>}`
        : `${Uncapitalize<F>}-${KebabCase<R>}`
    : S
```

# 645. Diff

获取两个接口类型中的差值属性

```ts
type Foo = {
    a: string;
    b: number;
}
type Bar = {
    a: string;
    c: boolean;
}
type Result1 = Diff<Foo, Bar> // { b: number, c: boolean }
type Result2 = Diff<Bar, Foo> // { b: number, c: boolean }
```

```ts
type Diff<O, O1> = any
// 1. 使用 Omit
type Diff<O, O1> = Omit<(O & O1), keyof (O | O1)>
// 2. 不使用 Omit
type Diff<O, O1> = {
    [K in keyof(O & O1) as K extends keyof (O | O1) ? never : K]: (O & O1)[K]
}
```

集合对象中使用交，并集

```ts
type Result1 = keyof (Foo | Bar) // 只有同时存在于 Foo 和 Bar 的 keys
type Result2 = keyof (Foo & Bar) // 只要存在于 Foo 或 Bar 的 keys
```

# 651. Length of String 2

与 298 相同？

# 697. Tag

```ts
type GetTags<B> = any

type Tag<B, T extends string> = any

type UnTag<B> = any

type HasTag<B, T extends string> = any
type HasTags<B, T extends readonly string[]> = any
type HasExactTags<B, T extends readonly string[]> = any
// 1. view 00697-extreme-tag.ts source code
```

# 730. Union to Tuple

```ts
type UnionToTuple<T> = any
// 1. ts 没有提供从联合类型取值的操作
type Union = 1 | 2
type A = Union[1] // error
// 2. 也不能直接将联合类型转为元组
type UnionToTuple<T> = T extends infer F | infer R ? [F, R] : never
type A = UnionToTuple<Union> // [1, 1] | [2, 2]
// 3. 可以将联合类型转换成函数的交叉类型，再通过 infer 推断类型
// 函数重载
type FunctionOverload = {
    (): number;
    (): string;
}
// 函数交叉类型
type Intersection = (() => number) & (() => string)
// 通过ReturnType上面二种方法都可以拿到最后一个定义的类型
type A = ReturnType<FunctionOverload> // string
type B = ReturnType<Intersection> // string
// 函数重载和函数交叉类型是相等的
type C = FunctionOverload extends Intersection ? true : false // true
```

# 734. Inclusive Range

```ts
type InclusiveRange<Lower extends number, Higher extends number> = any
// 1.
type InclusiveRange<Lower extends number, Higher extends number, C extends any[] = [], I = false, R extends number[] = []> = I extends true
    ? C['length'] extends Higher
        ? [...R, Higher]
        : InclusiveRange<Lower, Higher, [...C, 1], true, [...R, C['length']]>
    : C['length'] extends Lower
        ? InclusiveRange<Lower, Higher, C, true>
        : C['length'] extends Higher
            ? []
            : InclusiveRange<Lower, Higher, [...C, 1], false>
```

# 741. Sort

```ts
type Sort = any
// 1. view 00741-extreme-sort.ts source code
```

# 847. String Join

```ts
const hyphenJoiner = join('-');
const result = hyphenJoiner('a', 'b', 'c') // 'a-b-c'

join('#')('a', 'b', 'c') // 'a#b#c'
join('')('a', 'b', 'c') // 'abc'
join('-')('a') // 'a'
```

```ts
declare function join(delimiter: any): (...parts: any[]) => any
// 1.
type StringJoin<D extends string, T extends string[]> = T extends [`${infer F}`, ...infer R extends string[]]
    ? R extends []
        ? F
        : `${F}${D}${StringJoin<D, R>}`
    : ''
// 2.
declare function join<D extends string>(delimiter: D): <T extends string[]>(...parts: T) => StringJoin<D, T>
```

# 869. DistributeUnions

```ts
type T1 = DistributeUnions<[1 | 2, 'a' | 'b']> // [1, 'a'] | [2, 'a'] | [1 | 'b'] | [2, 'b']

type T2 = DistributeUnions<{ type: 'a', value: number | string } | { type: 'b', value: boolean }>
// | { type: 'a', value: number }
// | { type: 'a', value: string }
// | { type: 'b', value: boolean }
```

```ts
type DistributeUnions<T> = any
// 1. view 00869-extreme-distributeunions.ts source code
```

# 898. Includes

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true`，要么是 `false`

```ts
type isPillarMen = Includes<['Kars', 'Esidisi'], 'Dio'> // false
```

```ts
type Includes<T extends readonly any[], U> = any
// 1. 一开始是想以三元作为判断
type Includes<T extends readonly any[], U> = U extends T[number] ? true : false
// 2. 但对于引用类型，联合类型等测试用例都不过
type Includes<T extends readonly any[], U> = 在 JS 中可以用一个对象记录 T 里面的所有值，然后遍历 U 看看在不在这个对象中
// 3.
type Includes<T extends readonly any[], U> = {
    [P in T[number]]: true
}[U] extends true ? true : false
// 4. 但对于 Includes<[false, 2, 3, 5, 6, 7], false> 和 联合类型仍然有部分测试用例不过
// 5. 最后只能写一个 IsEqual 帮助类型
type IsEqual<X, Y> = 
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2)
        ? true
        : false
// 6. 然后一个一个拿出来比较
type Includes<T extends readonly any[], U> = T extends [infer First, ...infer Rest]
    ? IsEqual<First, U> extends true
        ? true
        : Includes<Rest, U>
    : false
```

# 925. Assert Array Index

```ts
// 1. view 00925-extreme-assert-array-index.ts source code
```

# 949. AnyOf

实现一个 `AnyOf<T extends readonly any[]>` 泛型，在 T 中只有一个值为 true 就返回 true。否则返回 false。 `[] / {}` 都认为是 false

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // true
type Sample2 = AnyOf<[0, '', false, [], {}]> // false
```

```ts
type AnyOf<T extends readonly any[]> = any
// 1. 0 | '' | false | [] | undefined | null 这些值指定为 Falsy 都比较简单，主要麻烦的是 {}，有两种方法表示空对象
type Obj1 = {[key: string]: never}
type Obj2 = Record<string, never>
type FALSE = [] | Record<string, never> | '' | 0 | false | undefined | null
// 2. 使用 T[number] 遍历
type FalsyVal<V> = V extends FALSE ? false : true
type AnyOf<T extends readonly any[]> = true extends FalsyVal<T[number]> ? true : false
// 3. 使用 infer 递归检查
type AnyOf<T extends readonly any[]> = T extends [infer Head, ...infer Tail]
    ? Head extends FALSE
        ? AnyOf<Tail>
        : true
    : false
```

# 956. DeepPick

```ts
type obj = {
    name: 'hoge',
    age: 20,
    friend: {
        name: 'fuga',
        age: 30,
        family: {
            name: 'baz',
            age: 1,
        }
    }
}
type T1 = DeepPick<obj, 'name'> // { name: 'hoge' }
type T2 = DeepPick<obj, 'name' | 'friend.name'> // { name: 'hoge' } & { friend: { name: 'fuga' } }
```

```ts
type DeepPick = any
// 1. view 00956-hard-deeppick.ts source code
```

# 1042. IsNever

实现一个类型 `IsNever<T>`， 当 T 接受的类型是 `never` 时，返回 true，否则返回 false

```ts
type A = IsNever<never> // true
type B = IsNever<undefined> // false
type C = IsNever<null> // false
type D = IsNever<[]> // false
type E = IsNever<number> // false
```

```ts
type IsNever<T> = any
// 1. 使用 Equal
type IsNever<T> = Equal<T, never>
// 2. 如果直接使用 extends 
type IsNever<T> = T extends never ? true : false
// 3. 会发现无法通过 Equal<IsNever<never>, true> 的测试，需要加个[]
type IsNever<T> = [T] extends [never] ? true : false
```

# 1097. IsUnion

实现一个类型 `IsUnion<T>`，如果输入的类型 T 是联合类型，返回 true，否则返回 false

```ts
type case1 = IsUnion<string> // false
type case2 = IsUnion<string | number> // true
type case3 = IsUnion<[string | number]> // false
```

```ts
type IsUnion<T> = any
// 1. 如果 T 中只有一个，返回的结果要么是true要么是false,如果超过一个，则会返回true&false 即 boolean
type IsUnion<T, T1 = T> = Equal<(T extends any
    ? T1 extends T
        ? true
        : false
    : false
), boolean>
```

# 1130. ReplaceKeys

```ts
type ReplaceKeys<U, T, Y> = any
// 1. 
type ReplaceKeys<U, T, Y> = {
    [K in keyof U]: 如果 K 在 T 里面
        ? 从 Y 中找
            ? 如果找到就输出Y[K]
            : 否则啥都不做
        : 原样输出U[K]
}
// 2.
type ReplaceKeys<U, T, Y> = {
    [K in keyof U]: K extends T
        ? K extends keyof Y
            ? Y[K]
            : never
        : U[K]
}
```

# 1290. Pinia

```ts
declare function defineStore(store: unknown): unknown
// 1. 首先要有一个将Getters从方法转换成值
type MapGetter<G> = {
    readonly [K in keyof G]: G[K] extends (...args: any[]) => any
        ? ReturnType<G[K]>
        : never
}
// 2.
declare function defineStore<S, G, A>(store: {
    id: string;
    state: () => S;
    getters: G & ThisType<Readonly<S> & MapGetters<G>>;
    actions: A & ThisType<S & MapGetters<G> & A>;
}): S & MapGetters<G> & A & { init: () => void }
```

# 1367. Remove Index Signature

```ts
type Foo = {
    [key: string]: any
    foo(): void
}
type A = RemoveIndexSignature<Foo> // { foo(): void }
```

```ts
type RemoveIndexSignature<T> = any
// 1.
type RemoveIndexSignature<T, P = PropertyKey> = {
    [K in keyof T as P extends K
        ? never
        : K extends P
            ? K
            : never
    ]: T[K]
}
```

# 1383. Camelize

实现 Camelize 类型，将对象属性名从蛇形命名（下划线命名）转换为小驼峰命名

```ts
Camlize<{
    some_prop: string,
    prop: { another_prop: string },
    array: [{ snake_case: string }]
}>
// result
type Result = {
    someProp: string,
    prop: { anotherProp: string },
    array: [{ snakeCase: string }]
}
```

```ts
type Camelize<T> = any
// 1. view 01383-hard-camelize.ts source code
```

# 1978. Percentage Parser

```ts
PercentageParser<''> // ['', '', '']
PercentageParser<'+85%'> // ['+', '85', '%']
PercentageParser<'-85%'> // ['-', '85', '%']
PercentageParser<'85%'> // ['', '85', '%']
PercentageParser<'85'> // ['', '85', '']
```

```ts
type PercentageParser<A extends string> = any
// 1. 用infer先判断有+/-和%的情况, 再判断有+/-的情况，再判断有%的情况。。。
type PercentageParser<A extends string> = A extends `${infer R extends '+' | '-'}${infer U}%`
    ? [R, U, '%']
    : A extends `${infer R extends '+' | '-'}${infer U}`
        ? [R, U, '']
        : A extends `${infer U}%`
            ? ['', U, '%']
            : A extends `${infer U}`
                ? ['', U, '']
                : never
```

# 2059. Drop String

```ts
type Butterfly = DropString<'foobar!', 'fb'> // 'ooar!'
```

```ts
type DropString<S, R> = any
// 1.
type DropString<S, R> = S extends `${infer X}${infer Y}`
    ? R extends `${string}${X}${string}`
        ? DropString<Y, R> // 如果 R 里面有 X, 就去掉 X 继续 Drop 剩余的 Y
        : `${X}${DropString<Y, R>}` // 如果没有，就保留X, 拿剩下的 Y 继续检查
    : ''
```

# 2070. Drop Char

从字符串中剔除指定字符。

```ts
type DropChar<S, C> = any
// 1. 
type DropChar<S, C> = S extends `${infer F}${infer R}`
    ? F extends C
        ? DropChar<R, C>
        : `${F}${DropChar<R, C>}`
    : ''
// 2. 或者定义 C extends string，然后直接让C参数模板字符串的匹配
type DropChar<S, C extends string> = S extends `${infer L}${C}${infer R}`
    ? DropChar<`${L}${R}`, C>
    : S
```

# 2257. MinusOne

给定一个正整数作为类型的参数，要求返回的类型是该数字减1

```ts
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

```ts
type MinusOne<T extends number> = any
// 1. 
type MinusOne<T, Arr extends unknown[] = []> = T extends Arr['length']
    ? Tmp<Arr>['length'] // Tmp用来获取 Arr.length - 1
    : MinusOne<T, [...Arr, any]>
type Tmp<A extends unknown[]> = A extends [unknown, ...infer R]
    ? R['length']
    : never
// 2. 上面的方法面对负数或者数字很大时会失败
// 3. view 02257-medium-minusone.ts source code
```

# 2595. PickByType

```ts
type OnlyBoolean = PickByType<{
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
}, boolean>
// { isReadonly: boolean; isEnable: boolean; }
```

```ts
type PickByType<T, U> = any
// 1. 使用 as 约束 K
type PickByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K]
}
// 2. 或者使用Pick
type PickByType<T, U> = Pick<T, {
    [P in keyof T]: T[P] extends U ? P : never
}[keyof T]>

```

# 2688. StartsWith

实现 `StartsWith<T, U>` 接收两个 string 类型参数，然后判断 T 是否以 U 开头。根据结果返回 true 或 false。

```ts
type a = StartsWith<'abc', 'ac'> // false
type b = StartsWith<'abc', 'ab'> // true
type c = StartsWith<'abc', 'abcd'> // false
```

```ts
type StartsWith<T extends string, U extends string> = any
// 1. 
type StartsWith<T extends string, U extends string> = T extends `${U}${string}` ? true : false
```

# 2693. EndsWith

实现 `EndsWith<T, U>` 接收两个 string 类型参数，判断 T 是否以 U 结尾。根据结果返回 true/false

```ts
type a = EndsWith<'abc', 'bc'> // true
type b = EndsWith<'abc', 'abc'> // true
type c = EndsWith<'abc', 'd'> // false
```

```ts
type EndsWith<T extends string, U extends string> = any
// 1.
type EndsWith<T extends string, U extends string> = T extends U
    ? true
    : T extends `${string}${U}`
        : true
        : false
// 2. `${string}${U}` 已经包含了 string==='' 的情况，所以可以简写
type EndsWith<T extends string, U extends string> = T extends `${string}${U}` ? true : false
```

# 2757. PartialByKeys

实现一个通用的 `PartialByKeys<T, K>`，它接收两个类型参数 T 和 K。
K 应该设置为可选的 T 的属性集。当没有提供 K 时，它就和普通的 `Partial<T>` 一样使所有属性都是可选的

```ts
interface User {
    name: string
    age: number
    address: string
}
type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string; }
```

```ts
type PartialByKeys<T, K> = any
// 1.
type MergeType<O> = {
    [P in keyof O]: O[P]
}
type PartialByKeys<T, K extends keyof T = keyof T> = MergeType<{
    [Key in keyof T as Key extends K ? Key : never]?: T[Key]
} & {
    [Key in keyof T as Key extends K ? never : Key]: T[Key]
}>
// 2. 会出现 name?: string | undefined 的情况
// 可以打开 exactOptionalPropertyTypes flag in tsconfig.ts 来解决
```

# 2759. RequiredByKeys

实现一个通用的 `RequiredByKeys<T, K>`, K 应该是 T 的属性集。当没有提供 K 时，它就和普通的 `Required<T>` 一样使所有属性成为必选。

```ts
interface User {
    name?: string
    age?: number
    address?: string
}
type UserRequiredName = RequiredByKeys<User, 'name'> // { name:string; age?:number; address?:string; }
```

```ts
type RequiredByKeys<T, K> = any
// 1.
type Merge<O> = {
    [K in keyof O]: O[K]
}
// 2. 
type RequiredByKeys<T, K extends keyof T = keyof T> = Merge<T & 
Required<Pick<T, K extends keyof T ? K : never>>>
```

# 2793. Mutable

实现一个通用的类型 `Mutable<T>`，使类型 T 的全部属性可变（非只读）。

```ts
interface Todo {
    readonly title: string
    readonly description: string
    readonly completed: boolean
}
type MutableTodo = Metable<Todo> // { title:string; description:string; completed:boolean; }
```

```ts
type Mutable<T> = any
// 1. 使用 -readonly 关键字就可以将属性指定为非只读
type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
}
// 2. 这样只能转换第一层，如果要 deep -readonly ，可以使用递归
type Mutable<T> = {
    -readonly [K in keyof T]: T[K] extends object
        ? Mutable<T[K]>
        : T[K]
}
```

# 2822. Split

```ts
type result = Split<'Hi! How are you?', ' '>  // should be ['Hi!', 'How', 'are', 'you?']
```

```ts
type Split<S extends string, SEP extends string> = any
// 1.
type Split<S extends string, SEP extends string = ''> = string extends S
? string[]
: S extends `${infer A}${SEP}${infer B}`
    ? [A, ...(B extends '' ? [] : Split<B, SEP>)]
    : SEP extends ''
        ? []
        : [S]
```

# 2828. ClassPublicKeys 

```ts
class A {
  public str: string
  protected num: number
  private bool: boolean
  getNum() {
    return Math.random()
  }
}

type publicKeys = ClassPublicKeys<A> // 'str' | 'getNum'
```

```ts
type ClassPublicKeys = any
// 1.
type ClassPublicKeys<T> = keyof T // :D
```

# 2852. OmitByType

```ts
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }
```

```ts
type OmitByType<T, U> = any
// 1.
type OmitByType<T, U> = {
    [P in keyof T as T[P] extends U ? never : P]: T[P]
}
```

# 2857. IsRequiredKey

```ts
type A = IsRequiredKey<{ a: number, b?: string },'a'> // true
type B = IsRequiredKey<{ a: number, b?: string },'b'> // false
type C = IsRequiredKey<{ a: number, b?: string },'b' | 'a'> // false
```

```ts
type IsRequiredKey<T, K extends keyof T> = any
// 1.
type IsRequiredKey<T, K extends keyof T> = 
    Pick<T, K> extends Required<Pick<T, K>>
        ? true
        : false
// 2. 或者把 Pick<T, K> 合并一下
type IsRequiredKey<T, K extends keyof T, U = Pick<T, K>> = 
    U extends Required<U>
        ? true
        : false
```

# 2946. ObjectEntries

```ts
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
```

```ts
type ObjectEntries<T> = any
// 1. 数据转联合类型
type ObjectEntries<T> = T[keyof T]
// 2. 
type ObjectEntries<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T]
// 3. 使用 -? 强制让 key 变成不可选，否则[keyof T]会取到 key 为 undefined 的情况
type ObjectEntries<T> = {
    [K in keyof T]-?: [K, T[K]]
}[keyof T]
// 4. 还需要删除 undefined
type RemoveUndefined<T> = [T] extends [undefined] ? T : Exclude<T, undefined>
type ObjectEntries<T> = {
    [K in keyof T]-?: [K, RemoveUndefined<T[K]>]
}[keyof T]
// 5. 无法通过 Equal<ObjectEntries<{ key: string | undefined }>, ['key', string | undefined]>
// 6. 使用另一种方案
type ObjectEntries<T> = {
    [K in keyof Required<T>]: [K, [T[K]] extends [undefined] ? undefined : Required<T>[K]]
}[keyof T]
```

# 2949. ObjectFromEntries

```ts
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null];

type result = ObjectFromEntries<ModelEntries> // expected to be Model
```

```ts
type ObjectFromEntries<T> = any
// 1.
type ObjectFromEntries<T extends [string, any]> = {}
// 2. 遍历 T，发现 T[1] 是所有字段类型的联合
type ObjectFromEntries<T extends [string, any]> = {
    [K in T as T[0]]: T[1]
}
// 3. 改为遍历 T[0]，并且对 value T 进行判断
type ObjectFromEntries<T extends [string, any]> = {
    [K in T[0]]: T extends [K, any] ? T[1] : never
}
```

# 3057. Push

在类型系统中实现 `Array.push`

```ts
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

```ts
type Push<T, U> = any
// 1. 
type Push<T extends any[], U> = U extends any[] ? [...T, ...U] : [...T, U]
// 2. 在 boolean 判断时再次发生问题 Push<[1], boolean> => [1, true] || [1, false] 
type Push<T extends unknown[], U> = [U] extends [T[number]] ? T : [...T, U]
// 3. 但在碰到 Push<['1', 2, '3', boolean], boolean> 这种情况时，上述方法仍不正确，所以直接使用 ... 操作符
type Push<T extends unknown[], U> = [...T, U]
```

# 3060. Unshift

在类型系统中实现 `Array.unshift`

```ts
type Result = Unshift<[1, 2], 0> // [0, 1, 2]
```

```ts
type Unshift<T, U> = any
// 1. 
type Unshift<T extends unknown[], U> = U extends any[] ? [...U, ...T] : [U, ...T]
// 2. 同样的 Unshift<[1], boolean> = [1, true] | [1, false]
type Unshift<T extends unknown[], U> = [U] extends [T[number]] ? T : [U, ...T]
// 3. 同样的如果 T 中有 U 时，结果不正确，所以也是直接使用 ...
type Unshift<T extends unknown[], U> = [U, ...T]
```

# 3062. Shift

```ts
type Result = Shift<[3, 2, 1]> // [2, 1]
```

```ts
type Shift<T> = any
// 1.
type Shift<T extends unknown[]> = T extends [infer H, ...infer R]
    ? R : never
// 2. 为了 pass Equal<Shift<[]>, []> 将 never 改为 [] 或 T
type Shift<T extends unknown[]> = T extends [infer H, ...infer R]
    ? R : T
```

# 3188. Tuple to Nested Object

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

```ts
type TupleToNestedObject<T, U> = any
// 1.
type TupleToNestedObject<T extends unknown[], U> = T extends [infer H, ...infer R]
    ? {
        [K in H as H extends PropertyKey ? H : never]: TupleToNestedObject<R, U>
    }
    : U
// 2. 对于 as H extends PropertyKey ? H : never，可以使用&PropertyKey 来简化
type TupleToNestedObject<T, U> = T extends [infer H, ...infer R]
    ? {
        [K in H&PropertyKey]: TupleToNestedObject<R, U>
    }
    : U
```

# 3192. Reverse

实现类型版本的数组反转 `Array.reverse`

```ts
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

```ts
type Reverse<T> = any
// 1.
type Reverse<T extends unknown[]> = T extends [infer F, ...infer R]
    ? [...Reverse<R>, F]
    : T
```

# 3196. Flip Arguments

```ts
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void> 
// (arg0: boolean, arg1: number, arg2: string) => void
```

```ts
type FlipArguments<T> = any
// 1. 通过 infer 获得所有 args
type FlipArguments<T extends Function> = T extends (...args: [...infer A]) => infer R
    ? (...args: 反转A) => R
    : never
// 2. 参考 3192 写一个反转工具类型
type Reverse<T> = T extends [infer F, ...infer R]
? [...Reverse<R>, F]
: T
type FlipArguments<T extends Function> = T extends (...args: [...infer A]) => infer R
    ? (...args: Reverse<A>) => R
    : never
```

# 3243. FlattenDepth

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

```ts
type FlattenDepth = any
// 1. 添加辅助泛型 S, U
type FlattenDepth<
    T extends unknown[],
    S extends number = 1, // flat 深度
    U extends any[] = [] // 使用 U 记录当前深度， U['length'] 可以用来和 S 进行比较
> = U['length'] extends S
    ? T // 已经到最大深度不需要再 flat 了
    : T extends [infer F, ...infer R] // 拆分数组
        ? F extends unknown[] // 如果第一个元素是数组，那么flat它，此时深度+1，其他的 R 以当前深度继续递归调用 FlattenDepth
            ? [...FlattenDepth<F, S, [...U, 1]>, ...FlattenDepth<R, S, U>]
            : [F, ...FlattenDepth<R, S, U>] // F 不需要 flat，对其他元素 R 作递归调用
        : T
```

# 3312. Parameters

实现内置的 `Parameters` 类型

```ts
const foo = (arg1: string, arg2: number): void => {}
type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

```ts
type MyParameters<T extends (...args: any[]) => any> = any
// 1. 通过 infer 把 ...args: any[] 变成一个内部泛型
type MyParameters<T extends (...args: any[]) => any> = T extends (...any: infer S) => any ? S : any
```
# 3326. BEM style string

```ts
BEM<'btn', ['price'], ['warning', 'success']>
// 'btn__price--warning' | 'btn__price--success'
```

```ts
type BEM<B extends string, E extends string[], M extends string[]> = any
// 1. 通过``加 [number] 已经能自动生成联合类型
type BEM<B extends string, E extends string[], M extends string[]> = `${B}__${E[number]}--${M[number]}`
// 2. 但要考虑空数组的情况
type IsNever<T> = T extends [never] ? true : false
type IsUnion<U> = IsNever<U> extends true ? '' : U
type BEM<B extends string, E extends string[], M extends string[]> = 
`${B}${IsUnion<`__${E[number]}`>}${IsUnion<`--${M[number]}`>}`
```

# 3376. InorderTraversal

```ts
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const

type A = InorderTraversal<typeof tree1> // [1, 3, 2]
```

```ts
type InorderTraversal<T extends TreeNode | null> = any
// 1.
type InorderTraversal<T extends TreeNode | null> = [T] extends [TreeNode]
    ? [
        ...InorderTraversal<T['left']>,
        T['val'],
        ...InorderTraversal<T['right']>
    ]
    : []
// 2. 据说不能直接使用 T extends TreeNode
type InorderTraversal<T extends TreeNode | null> = T extends TreeNode
    ? [
        ...InorderTraversal<T['left']>,
        T['val'],
        ...InorderTraversal<T['right']>
    ]
    : []
```

# 4037. IsPalindrome

```ts
IsPalindrome<'abc'> // false
IsPalindrome<121> // true
```

```ts
type IsPalindrome<T> = any
// 1. 写一个反转字符串的工具类型
type Reverse<S, T extends string = ''> = S extends `${infer F}${infer R}`
    ? Reverse<R, `${F}${T}`>
    : T
// 2. number 可以通过 `${T}` 转换为字符串
type IsPalindrome<T extends string | number> = `${T}` extends Reverse<`${T}`>
    ? true
    : false

```

# 4179. Flip

```ts
Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
```

```ts
type Flip<T> = any
// 1. 使用 `${T[P]}` 将bool,null等不规范的值转换成 string key
type Flip<T> = {
    [P in keyof T as `${T[P]}`]: P
}
// 2. `${T[P]}` 仍然会报错，所以将 T 的类型限制一下
type Flip<T extends Record<PropertyKey, any>> = {
    [P in keyof T as `${T[P]}`]: P
}
```

# 4182. 斐波那契序列

```ts
type Result1 = Fibonacci<3> // 2
type Result2 = Fibonacci<8> // 21
```

```ts
type Fibonacci<T extends number> = any
// 1. 1 和 2 直接返回 1
type Fibonacci<T extends number> = T extends 1 | 2
    ? 1
    : // 从3开始都是 f(N) = F(N-1) + F(N-2)
// 2. 所以定义3个泛型，N 用来记数，N_1，N_2 用来表示 N-1, N-2
type Fibonacci<T extends number,
N extends any[] = [any, any, any],
N_2 extends any[] = [any], // N=3时，F(N-2) = 1
N_1 extends any[] = [any], // N=3时，F(N-1) = 1
> = T extends 1 | 2
    ? 1
    : T extends N['length']
        ? [...N_2, ...N_1]['length'] // F(N-1) + F(N-2)
        : Fibonacci<T, [...N, any], N_1, [...N_2, ...N_1]>
```

# 4260. AllCombinations

```ts
type AllCombinations_ABC = AllCombinations<'ABC'>;
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

```ts
type AllCombinations<S> = any
// 1. 先创建一个字符串转联合类型的工具类型
type String2Union<S extends string> = 
S extends `${infer C}${infer REST}`
    ? C | String2Union<REST>
    : never
// 2.
type AllCombinations<
STR extends string,
S extends string = String2Union<STR>
> = [S] extends [never]
    ? '' // 空字符串
    : '' | {[K in S]: `${K}${AllCombinations<never, Exclude<S, K>>}`}[S]
```

# 4425. Greater Than

```ts
GreaterThan<2, 1> //should be true
GreaterThan<1, 1> //should be false
GreaterThan<10, 100> //should be false
GreaterThan<111, 11> //should be true
```

```ts
type GreaterThan<T extends number, U extends number> = any
// 1. 递归法 （数字较大时会溢出）
type GreaterThan<
T extends number,
U extends number,
A extends unknown[] = []
> = T extends A['length']
    ? false
    : U extends A['length']
        ? true
        : GreaterThan<T, U, [...A, unknown]>
// 2. 通过构造数组使用类似 [1, 1, 1] extends [1, 1] ? true : false 来判断
// 2. 构造数组
type NewArr<T extends number, A extends any[] = []> = 
A['length'] extends T
    ? A
    : NewArr<T, [...A, '']>
// 3. 比较数组
type GreaterArr<T extends any[], U extends any[]> = 
U extends [...T, ...any]
    ? false
    : true
// 4.
type GreaterThan<T extends number, U extends number> = 
GreaterArr<NewArr<T>, NewArr<U>>
```

# 4471. Zip

```ts
type exp = Zip<[1, 2], [true, false]> // expected to be [[1, true], [2, false]]
```

```ts
type Zip<T, U> = any
// 1.
type Zip<T extends any[], U extends any[]> = 
T extends [infer T_1, ...infer T_R]
    ? U extends [infer U_1, ...infer U_R]
        ? [[T_1, U_1], ...Zip<T_R, U_R>]
        : []
    : []
```

# 4484. IsTuple

```ts
type case1 = IsTuple<[number]> // true
type case2 = IsTuple<readonly [number]> // true
type case3 = IsTuple<number[]> // false
```

```ts
type IsTuple<T> = any
// 1. 元组长度有限，length 返回的是具体的数字。
// 1. 数组长度无限，length 返回的是 number
type IsTuple<T> = [T] extends [never]
    ? false
    : T extends readonly any[]
        ? number extends T['length']
            ? false
            : true
        : false
```

# 4499. Chunk

```ts
type exp1 = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
```

```ts
type Chunk = any
// 1.
type Chunk<
T extends any[], 
U extends number = 1, 
S extends any[] = []
> = T extends [infer F, ...infer R]
    ? S['length'] extends U // 能拆
        ? [S, ...Chunk<T, U>] // S 放到数组，剩下的继续拆分，这里的 T 是已经去掉 S 的。
        : Chunk<R, U, [...S, F]> // 把 F 放到缓存数组，并且对 R 继续拆分
    : S['length'] extends 0 // 不能再拆了，如果缓存数组为空则返回空数组(S本身也可以，因为 S.length = 0)
        ? []
        : [S] // 把缓存数组作为单独一个数组放到大数组中
```

# 4518. Fill

```ts
type exp = Fill<[1, 2, 3], 0> // expected to be [0, 0, 0]
```

```ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
> = any
// 1.
type Fill<
T extends unknown[],
N,
Start extends number = 0,
End extends number = T['length'],
Count extends any[] = [], // 遍历计数
StartFlag extends boolean = Count['length'] extends Start ? true : false // 是否开始
> = Count['length'] extends End
    ? T // 已经遍历完了
    : T extends [infer F, ...infer REST]
        ? StartFlag extends false
            ? [F, ...Fill<REST, N, Start, End, [...Count, 0]>] // 没有到达 Start
            : [N, ...Fill<REST, N, Start, End, [...Count, 0], true>] // 进行替换，因为 StartFlag 只能在到达 Start 时变为 true，超过时不能再计算所以要把 true 带下去。
        : T // 数组已经不能再拆分了
```

# 4803. Trim Right

实现 `TrimRight<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串结尾的空白字符串。

例如

```ts
type Trimed = TrimRight<'  Hello World  '> // 应推导出 '  Hello World'
```

```ts
type TrimRight<S extends string> = any
// 1.
type TrimRight<S extends string> = S extends `${infer R}${' '}`
    ? TrimRight<R>
    : S
// 2. 单元测试中认为 \n \t 也需要删除
type TrimRight<S extends string> = S extends `${infer R}${' ' | '\n' | '\t'}`
    ? TrimRight<R>
    : S
```

# 5117. 去除数组指定元素

实现一个像 `Lodash.without` 函数一样的泛型 `Without<T, U>`，它接收数组类型的 T 和数字或数组类型的 U 为参数，会返回一个去除 U 中元素的数组 T。

```ts
type Res = Without<[1, 2], 1>; // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>; // expected to be []
```

```ts
type Without<T, U> = any
// 1.
type Without<T, U> = T extends [infer F, ...infer R]
    ? F extends U
        ? Without<R, U>
        : [F, ...Without<R, U>]
    : T
// 2. 测试用例中 U 可以是数组也可能是单项，光用 F extends U 不能解决数组的问题。需要一个工具类型将数组转换成联合类型
type ToUnion<T> = T extends any[] ? T[number] : T
type Without<T, U> = T extends [infer F, ...infer R]
    ? F extends ToUnion<U>
        ? Without<R, U>
        : [F, ...Without<R, U>]
    : T
```

# 5140. Trunc

```ts
type A = Trunc<12.34> // 12
```

```ts
type Trunc = any
// 1.
type Trunc<S> = S extends `${infer I}.${string}`
    ? I
    : S
// 2. 测试用例中 S 可以是数字，所以需要一开始就将 S 转换为字符串
type Trunc<S extends string | number> = `${S}` extends `${infer I}.${string}`
    ? I
    : `${S}`
// 3. 处理 0 和 -0 的情况
type Trunc<S extends string | number> = `${S}` extends `${infer I}.${string}`
    ? I extends ''
        ? '0'
        : I extends '-'
            ? '-0'
            : I
    : `${S}`
```

# 5153. IndexOf

```ts
type Res = IndexOf<[1, 2, 3], 2>; // expected to be 1
type Res1 = IndexOf<[2,6, 3,8,4,1,7, 3,9], 3>; // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2>; // expected to be -1
```

```ts
type IndexOf<T, U> = any
// 1. 
type IndexOf<T, U, Count extends any[] = []> = 
T extends [infer F, ...infer R]
    ? F extends U
        ? Count['length']
        : IndexOf<R, U, [...Count, any]>
    : -1
// 2. 因为 1 extends number，所以要使用 Equal 来判断是否相等
type IndexOf<T, U, Count extends any[] = []> =
T extends [infer F, ...infer R]
    ? Equal<F, U> extends true
        ? Count['length']
        : IndexOf<R, U, [...Count, any]>
    : -1
```

# 5181. Mutable Keys

```ts
type Keys = MutableKeys<{ readonly foo: string; bar: number }>;
// expected to be “bar”
```

```ts
type MutableKeys<T> = any
// 1. 
type MutableKeys<T> = keyof {
    [P in keyof T as Equal<Pick<T, P>, Readonly<Pick<T, P>>> extends false ? P : never]: any
}
// 2. OR
type MutableKeys<T> = keyof {
    [P in keyof T as Equal<{ [K in P]: T[K] }, { -readonly [K in P]: T[K]}> extends true ? P : never]: any
}
```

# 5310. Join

```ts
type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
type Res3 = Join<["o"], "u">; // expected to be 'o'
```

```ts
type Join<T, U> = any
// 1.
type Join<T, U extends string | number = ','> =
T extends [infer F extends string, ...infer R]
    ? R['length'] extends 0 // 当递归到最后一个时
        ? F
        : `${F}${U}${Join<R, U>}`
    : ''
```

# 5317. LastIndexOf

实现类型版本的 `Array.lastIndexOf`, `LastIndexOf<T, U>` 接受数组 T, any 类型 U, 如果 U 存在于 T 中, 返回 U 在数组 T 中最后一个位置的索引, 不存在则返回 -1

```ts
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

```ts
type LastIndexOf<T, U> = any
// 1.
type LastIndexOf<T, U> = T extends [...infer R, infer L]
    ? Equal<U, L> extends true
        ? R['length']
        : LastIndexOf<R, U>
    : -1
```

# 5360. Unique

实现类型版本的 `Lodash.uniq` 方法, Unique 接收数组类型 T, 返回去重后的数组类型.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
```

```ts
type Unique<T> = any
// 1. 循环遍历元素是否在数组中的工具类型
type Includes<T, U> = U extends [infer F, ...infer R]
    ? Equal<T, F> extends true
        ? true
        : Includes<T, R>
    : false
// 2.
type Unique<T, U extends any[] = []> = T extends [infer F, ...infer R]
    ? Includes<F, U> extends true
        ? Unique<R, U>
        : Unique<R, [...U, F]>
    : U
```

# 5423. Intersection

```ts
type Res = Intersection<[[1, 2], [2, 3], [2, 2]]>; // expected to be 2
type Res1 = Intersection<[[1, 2, 3], [2, 3, 4], [2, 2, 3]]>; // expected to be 2 | 3
type Res2 = Intersection<[[1, 2], [3, 4], [5, 6]]>; // expected to be never
type Res3 = Intersection<[[1, 2, 3], [2, 3, 4], 3]>; // expected to be 3
type Res4 = Intersection<[[1, 2, 3], 2 | 3 | 4, 2 | 3]>; // expected to be 2 | 3
type Res5 = Intersection<[[1, 2, 3], 2, 3]>; // expected to be never
```

```ts
type Intersection<T> = any
// 1. 利用 (2 | 3) & (1 | 3) = 3 的原理
type Intersection<T extends unknown[]> = 
T extends [infer F, ...infer R]
    ? (F extends unknown[]
        ? F[number]
        : F
        ) & Intersection<R>
    : unknown
// 2. 或者写一个数组转联合的工具类型，提高代码可读性
type ToUnion<T> = T extends any[] ? T[number] : T
type Intersection<T> = T extends [infer F, ...infer R]
    ? ToUnion<F> & Intersection<R>
    : unknown
```

# 5821. MapTypes

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string}, StringToNumber> // gives { iWillBeANumberOneDay: number; }

type StringToNumber = { mapFrom: string; mapTo: number;}
type StringToDate = { mapFrom: string; mapTo: Date;}
MapTypes<{iWillBeNumberOrDate: string}, StringToDate | StringToNumber> // gives { iWillBeNumberOrDate: number | Date; }

type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string, iWillStayTheSame: Function}, StringToNumber> // // gives { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

```ts
type MapTypes<T, R> = any
// 1.
type MapType<T, R extends { mapFrom: any, mapTo: any }> = {
    [K in keyof T]: T[K] extends R['mapFrom']
        ? R extends { mapFrom: T[K] } // 因为 R 可能是联合类型，所以要再用 extends 判断一次，收敛结果
            ? R['mapTo']
            : never
        : T[K]
}
```

# 6141. Binary to Decimal

```ts
type Res1 = BinaryToDecimal<'10'>; // expected to be 2
type Res2 = BinaryToDecimal<'0011'>; // expected to be 3
```

```ts
type BinaryToDecimal<S extends string> = any
// 1. 从左到右
type BinaryToDecimal<
S extends string,
R extends any[] = []
> = S extends `${infer F}${infer L}`
    ? F extends '0'
        ? BinaryToDecimal<L, [...R, ...R]> // '10' 一开始是 1，虽然第二位是0，但整体 X2 之后就能得到正确的值
        : BinaryToDecimal<L, [...R, ...R, 1]>
    : R['length']
// 2. 从右到左
// 2. 将字符串转换成元组，这样通过[..., L]就能得到L最后一个
type StringToTuple<S extends string> = S extends `${infer F}${infer R}`
    ? [F, ...StringToTuple<R>]
    : []
// 3. 通过元组计算
type Convert<
T extends string [],
Arr extends number[] = [1],
Res extends number[] = []
> = T extends [...infer F extends string[], infer L]
    ? L extends '1'
        ? Convert<F, [...Arr, ...Arr], [...Res, ...Arr]>
        : Convert<F, [...Arr, ...Arr], Res>
    : Res['length']
// 4. 
type BinaryToDecimal<S extends string> = Convert<StringToTuple<S>>
```

# 6228. JSON Parser

06228-extreme-json-parser.ts

# 7258. Object Key Paths

```ts
type T1 = ObjectKeyPaths<{ name: string; age: number }>; // expected to be 'name' | 'age'
type T2 = ObjectKeyPaths<{
  refCount: number;
  person: { name: string; age: number };
}>; // expected to be 'refCount' | 'person' | 'person.name' | 'person.age'
type T3 = ObjectKeyPaths<{ books: [{ name: string; price: number }] }>; // expected to be the superset of 'books' | 'books.0' | 'books[0]' | 'books.[0]' | 'books.0.name' | 'books.0.price' | 'books.length' | 'books.find'
```

07258-hard-object-key-paths.ts

# 7544. Construct Tuple

构造一个给定长度的元组。

```ts
type result = ConstructTuple<2> // 期望得到 [unknown, unkonwn]
```

```ts
type ConstructTuple<L extends number> = any
// 1. 递归只能支持到1000
type ConstructTuple<L extends number, U extends unknown[] = []> =
L extends U['length']
    ? U
    : ConstructTuple<L, [...U, unknown]>
// 2. 按位数
// 07544-medium-construct-tuple 类似 6141 的从左到右，只不过这次每移一位是 X10
```

# 7561. Subtract

```ts
Subtract<2, 1> // expect to be 1
Subtract<1, 2> // expect to be never
```

```ts
type Subtract<M extends number, S extends number> = any
// 1. 数字计算需要用到['length']，所以先提供一个根据数字生成元组的工具类型
type Tuple<T, Res extends any[] = []> = Res['length'] extends T
    ? Res
    : Tuple<T, [...Res, any]>
// 2.
type Subtract<M extends number, S extends number> =
Tuple<M> extends [...Tuple<S>, ...infer Rest]
    ? Rest['length']
    : never
```

# 8640. Number Range

```ts
type result = NumberRange<2 , 9> //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

```ts
type NumberRange<L, H> = any
// 1.
type NumberRange<
L extends number,
H extends number,
Count extends 0[] = [],
R extends number[] = [],
Flag extends boolean = Count['length'] extends L ? true : false
> = Flag extends true
    ? Count['length'] extends H
        ? [...R, Count['length']][number]
        : NumberRange<L, H, [...Count, 0], [...R, Count['length']], true> // Flag 只有一次变 true 的机会，所以后续都不能依赖 Count['length'] extends L 的计算，只能传 Flag 或 true
    : NumberRange<L, H, [...Count, 0]> // count++
```

# 8767. Combination

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>
```

```ts
type Combination<T extends string[]> = any
// 1.
type Combination<
T extends string[],
All = T[number],
Item = All
> = Item extends string
    ? Item | `${Item} ${Combination<[], Exclude<All, Item>>}`
    : never
```

# 8804. 两数之和

给定一个整数数组 nums 和一个目标整数 target, 如果 nums 数组中存在两个元素的和等于 target 返回 true, 否则返回 false

```ts
type TwoSum<T extends number[], U extends number> = any
// 1. 类似通过数字生成元组，但这里要注意的是元组最后一个的情况类似 Add<1, []>，所以生成元组的工具类型要过滤掉这种情况 MakeCounter<never> === never
type MakeCounter<
T extends number,
_Result extends 1[] = [],
U = T
> = U extends T
    ? _Result['length'] extends U
        ? _Result | MakeCounter<Exclude<T, U>>
        : MakeCounter<U, [..._Result, 1]>
    : never
type SimpleAdd<T extends number, U extends number> = [...MakeCounter<T>, ...MakeCounter<U>]['length']
// 2.
type TwoSum<T extends number[], U extends number> =
T extends [infer F extends number, ...infer R extends number[]]
    ? U extends SimpleAdd<F, R[number]>
        ? true
        : TwoSum<R, U>
    : false
```

# 8987. Subsequence

```ts
type A = Subsequence<[1, 2]> // [] | [1] | [2] | [1, 2]
```

```ts
type Subsequence<T extends any[]> = any
// 1.
type Subsequence<T extends any[]> =
T extends [infer F, ...infer R]
    ? SubSequence<R> | [F, ...Subsequence<R>]
    : T
```

# 9142. CheckRepeatedChars

判断一个string类型中是否有相同的字符

```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

```ts
type CheckRepeatedChars<T extends string> = any
// 1.
type CheckRepeatedChars<T extends string> = T extends `${infer F}${infer R}`
    ? R extends `${string}${F}${string}`
        ? true
        : CheckRepeatedChars<R>
    : false
```

# 9155. ValidDate

```ts
ValidDate<'0102'> // true
ValidDate<'0131'> // true
ValidDate<'1231'> // true
ValidDate<'0229'> // false
ValidDate<'0100'> // false
ValidDate<'0132'> // false
ValidDate<'1301'> // false
```

```ts
type ValidDate<T extends string> = any
// 1.
type Num = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type MM = `0${Num}` | `1${0 | 1 | 2}`
type AllDate =
  | `${MM}${`${0}${Num}` | `${1}${0 | Num}` | `2${0 | Exclude<Num, 9>}`}`
  | `${Exclude<MM, '02'>}${29 | 30}`
  | `${Exclude<MM, '02' | '04' | '06' | '09' | '11'>}${31}`

type ValidDate<T extends string> = T extends AllDate ? true : false
```

# 9160. Assign

```ts
type Target = {
  a: 'a'
}

type Origin1 = {
  b: 'b'
}

// type Result = Assign<Target, [Origin1]>
type Result = {
  a: 'a'
  b: 'b'
}
```

```ts
type Assign<T extends Record<string, unknown>, U> = any
// 1.
type Merge<T> = {
    [K in keyof T]: T[K]
}
// 2. 规则是覆盖，所以不能使用 & 合并，改为 Omit<T, keyof F> & F，即去掉 T 中 所有 F 有的 key，再合并 F
type Assign<
T extends Record<string, unknown>,
U extends any[]
> = U extends [infer F, ...infer R]
    ? F extends Record<string, unknown>
        ? Assign<Omit<T, keyof F> & F, R>
        : Assign<T, R>
    : Merge<T>
```