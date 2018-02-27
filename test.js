const chalk = require('chalk')
const game = require('./index')
const getFinish = game.getFinish
const CE = game.CELL_EMPTY
const PA = game.PLAYER_A
const PB = game.PLAYER_B
const {
  FINISH_ONGOING,
  FINISH_WIN_A,
  FINISH_WIN_B,
  FINISH_DRAW,
} = game

runTests([
  {
    name: 'not finished',
    board: [
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
    ],
    expected: FINISH_ONGOING,
  },
  {
    name: 'draw',
    board: [
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PA, PB, PA, PB, PA],
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PA, PB, PA, PB, PA],
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PA, PB, PA, PB, PA],
    ],
    expected: FINISH_DRAW,
  },
  {
    name: 'full with win',
    board: [
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PA, PB, PA, PB, PA],
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PB, PB, PB, PB, PA],
      [PB, PA, PB, PA, PB, PA, PB],
      [PA, PB, PA, PB, PA, PB, PA],
    ],
    expected: FINISH_WIN_B,
  },
  {
    name: 'win vertical bottom right',
    board: [
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, PA],
      [CE, CE, CE, CE, CE, CE, PA],
      [CE, CE, CE, CE, CE, CE, PA],
      [CE, CE, CE, CE, CE, CE, PA],
    ],
    expected: FINISH_WIN_A,
  },
  {
    name: 'win vertical top left',
    board: [
      [PB, CE, CE, CE, CE, CE, CE],
      [PB, CE, CE, CE, CE, CE, CE],
      [PB, CE, CE, CE, CE, CE, CE],
      [PB, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
    ],
    expected: FINISH_WIN_B,
  },
  {
    board: [
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, PA, CE, CE, CE],
      [CE, CE, CE, CE, PA, CE, CE],
      [CE, CE, CE, CE, CE, PA, CE],
      [CE, CE, CE, CE, CE, CE, PA],
    ],
    expected: FINISH_WIN_A,
  },
  {
    board: [
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, CE, CE, CE, CE],
      [CE, CE, CE, PB, PB, PB, PB],
    ],
    expected: FINISH_WIN_B,
  },
])

function runTests(tests) {
  const countTests = tests.length
  let countOk = 0
  tests.forEach((test, i) => {
    const name = test.name || `Test ${i}`
    const board = test.board
    const expected = test.expected
    const state = {board: board}
    const result = 1//getFinish(state)
    if (result === expected) {
      countOk++
      console.log(chalk.green('OK') + ' ' + name)
    } else {
      console.log(chalk.red('KO') + ' ' + name)
      console.log(`  expected: ${expected}`)
      console.log(`  found: ${result}`)
    }
  })
  const allOk = countOk === countTests
  console.log('------')
  if (allOk) {
    console.log(`${chalk.green('PASSED')} ${countTests}/${countTests}`)
  } else {
    console.log(`${chalk.red('FAILED')} ${countOk}/${countTests} passed`)
  }
}
