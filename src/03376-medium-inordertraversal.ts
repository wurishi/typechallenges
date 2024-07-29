/*
  3376 - InorderTraversal
  -------
  by jiangshan (@jiangshanmeta) #medium #object

  ### Question

  Implement the type version of binary tree inorder traversal.

  For example:

  ```typescript
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

  > View on GitHub: https://tsch.js.org/3376
*/

/* _____________ Your Code Here _____________ */

interface TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
  }
//   type InorderTraversal<T extends TreeNode | null> = any

type InorderTraversal<T extends TreeNode | null> = 
[T] extends [TreeNode]
  ? [
    ...InorderTraversal<T['left']>,
    T['val'],
    ...InorderTraversal<T['right']>
  ]
  : []


  type IT<T extends TreeNode | null> = T extends TreeNode
    ? [
        ...IT<T['left']>,
        T['val'],
        ...IT<T['right']>
    ]
    : []
//     type T = IT<null>
//   type T1 = IT<typeof tree1>
//   type T2 = IT<typeof tree2>
//   type T3 = IT<typeof tree3>
//   type T4 = IT<typeof tree4>
  
  /* _____________ Test Cases _____________ */
  import type { Equal, Expect } from '@type-challenges/utils'
  
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
  
  const tree2 = {
    val: 1,
    left: null,
    right: null,
  } as const
  
  const tree3 = {
    val: 1,
    left: {
      val: 2,
      left: null,
      right: null,
    },
    right: null,
  } as const
  
  const tree4 = {
    val: 1,
    left: null,
    right: {
      val: 2,
      left: null,
      right: null,
    },
  } as const
  
  type cases = [
    Expect<Equal<InorderTraversal<null>, []>>,
    Expect<Equal<InorderTraversal<typeof tree1>, [1, 3, 2]>>,
    Expect<Equal<InorderTraversal<typeof tree2>, [1]>>,
    Expect<Equal<InorderTraversal<typeof tree3>, [2, 1]>>,
    Expect<Equal<InorderTraversal<typeof tree4>, [1, 2]>>,
  ]
  