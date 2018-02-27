const {
  write,
  clear,
  prompt,
} = require('./tty')
const {
  createGame,
  applyMove,
  isFinished,
  getFinishText,
} = require('./game')

module.exports = game

async function game({
  state = createGame(),
  onStateChange,
} = {}) {
  while (!isFinished(state)) {
    paint(state)
    state = await nextTurn(state)
    if (onStateChange) {
      await onStateChange(state)
    }
  }
  const finishText = getFinishText(state)
  paint(state)
  write(`${finishText}\n\n`)
}

async function nextTurn(state) {
  const move = await promptCommand(state)
  const newState = applyMove(state, move)
  return newState
}

function promptCommand(state) {
  return prompt('Prochain coup ? ').then(cmd => {
    const move = parseCommandMove(cmd)
    const {valid, message} = validateMove(state, move)
    if (valid) {
      return move
    } else {
      write(message + '\n')
      return promptCommand(state)
    }
  })
}

function paint(state) {
  // TODO
}

// === Même code sans destructuring ============================

const tty = require('./tty')
const write = tty.write
const clear = tty.clear
const prompt = tty.prompt
const game = require('./game')
const createGame = game.createGame
const applyMove = game.applyMove
const isFinished = game.isFinished
const getFinishText = game.getFinishText

module.exports = cliGame

async function cliGame(options = {}) {
  const state = options.state || createGame()
  const onStateChange = options.onStateChange
  while (!isFinished(state)) {
    display(state)
    state = await nextTurn(state)
    // onStateChange: callback optionelle (permet
    // d'enregistrer le state à chaque étape)
    if (onStateChange) {
      await onStateChange(state)
    }
  }
  const finishText = getFinishText(state)
  display(state)
  write(`${finishText}\n\n`)
}

async function nextTurn(state) {
  const move = await promptCommand(state)
  const newState = applyMove(state, move)
  return newState
}

function promptCommand(state) {
  return prompt('Prochain coup ? ').then(cmd => {
    const move = parseCommandMove(cmd)
    const {valid, message} = validateMove(state, move)
    if (valid) {
      return move
    } else {
      write(message + '\n')
      return promptCommand(state)
    }
  })
}

function display(state) {
  // TODO
}
