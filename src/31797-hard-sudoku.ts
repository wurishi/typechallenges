/*
  31797 - Sudoku
  -------
  by Bruno Ladeia (@BrunoLad) #hard #union #array #tuple #game

  ### Question

  Write a type that verifies [Sudoku](https://en.wikipedia.org/wiki/Sudoku) game is solved. This is based off a [challenge](https://typehero.dev/challenge/day-22) from Advent of Typescript 2023 by TypeHero (Day 22). So kudos for them for thinking up such a neat challenge!

  > View on GitHub: https://tsch.js.org/31797
*/

/* _____________ Your Code Here _____________ */

// type Digits = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
// type SudokuSolved = any

type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Group = [Digit, Digit, Digit]
type Row = [Group, Group, Group]
type Grid = [Row, Row, Row, Row, Row, Row, Row, Row, Row]

type RowGroups = [0, 0, 0, 1, 1, 1, 2, 2, 2]
type GroupNrs = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

type Index3 = 0 | 1 | 2
type Index9 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

type Coord = `${Index9}${Index3}${Index3}`

type IdCoord<Crd = Coord> =
  Crd extends `${infer R extends Index9}${infer G extends Index3}${infer C extends Index3}`
  ? `R${R}:${Crd}` | `C${GroupNrs[G][C]}:${Crd}` | `G${GroupNrs[RowGroups[R]][G]}:${Crd}` 
  : never 

type Lookup<Grd extends Grid, IdCrd = IdCoord> = 
  IdCrd extends `${infer ID}:${infer R extends Index9}${infer G extends Index3}${infer C extends Index3}`
  ? `${ID}:${Grd[R][G][C]}`
  : never

type Solved = `${'R' | 'C' | 'G'}${Index9}:${Digit}`

type SudokuSolved<Grd extends Grid> = Solved extends Lookup<Grd> ? true : false

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type test_sudoku_1_actual = SudokuSolved<[
  [[1, 2, 3], [5, 6, 7], [4, 8, 9]],
  [[4, 8, 9], [1, 2, 3], [5, 6, 7]],
  [[5, 6, 7], [4, 8, 9], [1, 2, 3]],
  [[3, 1, 2], [8, 5, 6], [9, 7, 4]],
  [[7, 9, 4], [3, 1, 2], [8, 5, 6]],
  [[8, 5, 6], [7, 9, 4], [3, 1, 2]],
  [[2, 3, 1], [6, 4, 5], [7, 9, 8]],
  [[9, 7, 8], [2, 3, 1], [6, 4, 5]],
  [[6, 4, 5], [9, 7, 8], [2, 3, 1]],
]>

type test_sudoku_2_actual = SudokuSolved<[
  [[7, 1, 5], [4, 3, 8], [6, 9, 2]],
  [[4, 8, 6], [9, 2, 5], [7, 1, 3]],
  [[9, 3, 2], [1, 6, 7], [4, 8, 5]],
  [[6, 5, 7], [2, 8, 9], [1, 3, 4]],
  [[3, 2, 8], [7, 4, 1], [9, 5, 6]],
  [[1, 4, 9], [3, 5, 6], [8, 2, 7]],
  [[5, 9, 1], [6, 7, 3], [2, 4, 8]],
  [[2, 6, 3], [8, 9, 4], [5, 7, 1]],
  [[8, 7, 4], [5, 1, 2], [3, 6, 9]],
]>

type test_sudoku_3_actual = SudokuSolved<[
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[4, 8, 1], [6, 2, 9], [5, 7, 3]],
  [[5, 7, 6], [8, 4, 3], [2, 9, 1]],
  [[7, 2, 9], [3, 1, 8], [4, 5, 6]],
  [[6, 5, 8], [2, 7, 4], [3, 1, 9]],
  [[1, 4, 3], [5, 9, 6], [7, 2, 8]],
  [[2, 1, 4], [9, 3, 5], [6, 8, 7]],
  [[9, 6, 5], [4, 8, 7], [1, 3, 2]],
  [[8, 3, 7], [1, 6, 2], [9, 4, 5]],
]>

type test_sudoku_4_actual = SudokuSolved<[
  [[1, 2, 3], [5, 6, 7], [4, 8, 9]],
  [[4, 8, 9], [1, 2, 3], [5, 6, 7]],
  [[5, 6, 7], [4, 8, 9], [1, 2, 3]],
  [[3, 1, 2], [8, 5, 6], [9, 7, 4]],
  [[7, 9, 4], [3, 1, 2], [8, 5, 6]],
  [[8, 5, 6], [7, 9, 4], [3, 1, 2]],
  [[2, 3, 1], [6, 4, 5], [8, 9, 4]],
  [[9, 7, 8], [2, 3, 1], [6, 4, 5]],
  [[6, 4, 5], [9, 7, 8], [2, 3, 1]],
]>

type test_sudoku_5_actual = SudokuSolved<[
  [[7, 1, 5], [4, 3, 8], [6, 9, 2]],
  [[4, 8, 6], [9, 2, 5], [7, 1, 3]],
  [[9, 3, 2], [1, 6, 7], [4, 8, 5]],
  [[6, 5, 7], [2, 8, 9], [1, 3, 4]],
  [[3, 2, 8], [7, 4, 1], [9, 5, 6]],
  [[1, 4, 9], [3, 5, 6], [8, 2, 7]],
  [[5, 9, 1], [6, 2, 3], [2, 4, 8]],
  [[2, 6, 3], [8, 9, 4], [5, 7, 1]],
  [[8, 7, 4], [5, 1, 2], [3, 6, 9]],
]>

type test_sudoku_6_actual = SudokuSolved<[
  [[8, 9, 7], [3, 6, 1], [1, 4, 5]],
  [[6, 3, 4], [1, 4, 9], [2, 8, 7]],
  [[1, 2, 4], [5, 8, 7], [9, 6, 3]],
  [[3, 8, 9], [6, 2, 1], [5, 7, 4]],
  [[4, 7, 2], [8, 9, 5], [6, 3, 1]],
  [[5, 1, 6], [4, 7, 3], [8, 2, 9]],
  [[7, 5, 1], [2, 3, 8], [4, 9, 6]],
  [[9, 6, 8], [7, 5, 4], [3, 1, 2]],
  [[2, 4, 3], [9, 1, 6], [7, 5, 8]],
]>

type test_sudoku_7_actual = SudokuSolved<[
  [[1, 2, 3], [5, 6, 7], [4, 8, 9]],
  [[2, 3, 5], [6, 7, 4], [8, 9, 1]],
  [[3, 5, 6], [7, 4, 8], [9, 1, 2]],
  [[5, 6, 7], [4, 8, 9], [1, 2, 3]],
  [[6, 7, 4], [8, 9, 1], [2, 3, 5]],
  [[7, 4, 8], [9, 1, 2], [3, 5, 6]],
  [[4, 8, 9], [1, 2, 3], [5, 6, 7]],
  [[8, 9, 1], [2, 3, 5], [6, 7, 4]],
  [[9, 1, 2], [3, 5, 6], [7, 4, 8]],
]>

type test_sudoku_8_actual = SudokuSolved<[
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
  [[3, 9, 2], [7, 5, 1], [8, 6, 4]],
]>

type cases = [
  Expect<Equal<test_sudoku_1_actual, true>>,
  Expect<Equal<test_sudoku_2_actual, true>>,
  Expect<Equal<test_sudoku_3_actual, true>>,
  Expect<Equal<test_sudoku_4_actual, false>>,
  Expect<Equal<test_sudoku_5_actual, false>>,
  Expect<Equal<test_sudoku_6_actual, false>>,
  Expect<Equal<test_sudoku_7_actual, false>>,
  Expect<Equal<test_sudoku_8_actual, false>>,
]
