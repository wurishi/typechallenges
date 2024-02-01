/*
  213 - Vue Basic Props
  -------
  by Anthony Fu (@antfu) #hard #vue #application

  ### Question

  **This challenge continues from [6 - Simple Vue](//tsch.js.org/6), you should finish that one first, and modify your code based on it to start this challenge**.

  In addition to the Simple Vue, we are now having a new `props` field in the options. This is a simplified version of Vue's `props` option. Here are some of the rules.

  `props` is an object containing each field as the key of the real props injected into `this`. The injected props will be accessible in all the context including `data`, `computed`, and `methods`.

  A prop will be defined either by a constructor or an object with a `type` field containing constructor(s).

  For example

  ```js
  props: {
    foo: Boolean
  }
  // or
  props: {
    foo: { type: Boolean }
  }
  ```

  should be inferred to `type Props = { foo: boolean }`.

  When passing multiple constructors, the type should be inferred to a union.

  ```ts
  props: {
    foo: { type: [Boolean, Number, String] }
  }
  // -->
  type Props = { foo: boolean | number | string }
  ```

  When an empty object is passed, the key should be inferred to `any`.

  For more specified cases, check out the Test Cases section.

  > `required`, `default`, and array props in Vue are not considered in this challenge.

  > View on GitHub: https://tsch.js.org/213
*/

/* _____________ Your Code Here _____________ */

// declare function VueBasicProps(options: any): any

type ComputedValueType<C> = {
    [K in keyof C as C[K] extends () => any
        ? K
        : never
    ]: C[K] extends () => any ? ReturnType<C[K]> : C[K]
}

declare function VueBasicProps<P, D, C, M>(options: Option<P, D, C, M>): Option<P, D, C, M>

type PropsType<T> = {
    [P in keyof T]: {} extends T[P]
        ? any
        : T[P] extends { type: any }
            ? T[P]['type'] extends (infer R)[]
                ? ConverArrayPropType<R>
                : ConvertInstanceType<T[P]['type']>
            : ConvertInstanceType<T[P]>
}

type ConvertInstanceType<T> = T extends new (args: any) => any
    ? T extends typeof String | typeof Boolean | typeof Number
        ? ReturnType<T>
        : InstanceType<T>
    : T

type ConverArrayPropType<T, U = T> = T extends U
    ? ConvertInstanceType<T>
    : never

type Option<P, D, C, M> = {
    props?: P,
    data?: (this: PropsType<P>) => D,
    computed?: C & ThisType<(D extends () => any ? ReturnType<D> : D) & PropsType<P>>,
    methods?: M & ThisType<
        (D extends () => any ? ReturnType<D> : D)
        // & { [K in keyof C]: C[K] extends () => any ? ReturnType<C[K]> : C[K]}
        & ComputedValueType<C>
        & M & PropsType<P>
    >
}

type PropConstructor<T> = | { new (...args: any[]): T } | { (): T }
type PropConstructor2<T> = | { new (...args: any[]): T & object } | { (): T }

type InferPropType1<P> = P extends PropConstructor<infer T>
    ? unknown extends T
        ? any
        : T
    : any;
type InferPropType2<P> = P extends PropConstructor2<infer T>
    ? unknown extends T
        ? any
        : T
    : any;

type t1 = InferPropType1<StringConstructor> // string | String
type t2 = InferPropType2<StringConstructor> // string

/* _____________ Test Cases _____________ */
import type { Debug, Equal, Expect, IsAny } from '@type-challenges/utils'

class ClassA {}

VueBasicProps({
  props: {
    propA: {},
    propB: { type: String },
    propC: { type: Boolean },
    propD: { type: ClassA },
    propE: { type: [String, Number] },
    propF: RegExp,
  },
  data(this) {
    type PropsType = Debug<typeof this>
    type cases = [
      Expect<IsAny<PropsType['propA']>>,
      Expect<Equal<PropsType['propB'], string>>,
      Expect<Equal<PropsType['propC'], boolean>>,
      Expect<Equal<PropsType['propD'], ClassA>>,
      Expect<Equal<PropsType['propE'], string | number>>,
      Expect<Equal<PropsType['propF'], RegExp>>,
    ]

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
      alert(this.fullname.toLowerCase())
      alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const propE = this.propE
      type cases = [
        Expect<Equal<typeof fullname, string>>,
        Expect<Equal<typeof propE, string | number>>,
      ]
    },
  },
})
