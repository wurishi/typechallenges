/*
  6 - 简单的 Vue 类型
  -------
  by Anthony Fu (@antfu) #困难 #this #application #vue

  ### 题目

  实现类似Vue的类型支持的简化版本。

  通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

  在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的Object作为其唯一的参数，

  - `data`是一个简单的函数，它返回一个提供上下文`this`的对象，但是你无法在`data`中获取其他的计算属性或方法。

  - `computed`是将`this`作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

  - `methods`是函数的对象，其上下文也为`this`。函数中可以访问`data`，`computed`以及其他`methods`中的暴露的字段。 `computed`与`methods`的不同之处在于`methods`在上下文中按原样暴露为函数。

  `SimpleVue`的返回值类型可以是任意的。

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
        return this.firstname + ' ' + this.lastname
      }
    },
    methods: {
      hi() {
        alert(this.fullname.toLowerCase())
      }
    }
  })
  ```

  > 在 Github 上查看：https://tsch.js.org/6/zh-CN
*/

/* _____________ 你的代码 _____________ */

// declare function SimpleVue(options: any): any
declare function SimpleVue<D, C, M>(options: Option<D, C, M>): Option<D, C, M>
type Option<D, C, M> = {
    data?: D,
    computed?: C & ThisType<D extends () => infer R ? R : D>,
    methods?: M & ThisType<
        (D extends () => infer R ? R : D)
        & { [K in keyof C]: C[K] extends (...argv: never[]) => infer R ? R : C[K] }
        & M
    >
}

// type GetComputed<T> = T extends Record<string, (...args: never[]) => never>
//   ? {[key in keyof T]: ReturnType<T[key]>}
//   : never

// type GetComputed<T> = {
//     [K in keyof T]: T[K] extends (...args: never[]) => infer R
//         ? R
//         : T[K]
// }
// declare function SimpleVue<D, C, M>(options: {
//     data: () => D,
//     computed: C,
//     methods: M,
// } & ThisType<D & M & GetComputed<C>>):any

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'
const v = SimpleVue({
    data() {
        // @ts-expect-error
        this.firstname
        // @ts-expect-error
        this.getRandom()
        // @ts-expect-error
        this.data()

        return {
            firstname: 'Type',
            lastname: 'Challenges',
            amount: 10,
        }
    },
    computed: {
        fullname() {
            return `${this.firstname} ${this.lastname}`
        },
    },
    methods: {
        getRandom() {
            return Math.random()
        },
        hi() {
            alert(this.amount)
            alert(this.fullname.toLowerCase())
            alert(this.getRandom())
        },
        test() {
            const fullname = this.fullname
            const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
        },
    },
})
