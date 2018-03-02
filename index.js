const readline = require('readline')
const chalk = require('chalk');

const CELL_EMPTY = 0
const PLAYER_A = 1
const PLAYER_B = 2

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const board = [
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
]
module.exports = {
  getBoard,
  PLAYER_A,
  PLAYER_B,
  playGame,
  checkForVictory,
  getAdjacent,
  cellVal
}
function getBoard(){
  return [
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  ]
}

//playGame()

function playGame() {
  const state = {
    board: board,
    turn: 1,
    p1:null,
    p2:null
  }
  console.log('\033[2J')
  console.log("Bonjour, on joue a "+
  chalk.redBright("P")+
  chalk.yellowBright("u")+
  chalk.greenBright("i")+
  chalk.cyanBright("s")+
  chalk.blueBright("s")+
  chalk.magentaBright("a")+
  chalk.blueBright("n")+
  chalk.cyanBright("c")+
  chalk.greenBright("e")+
  chalk.yellowBright(" 4"))
  console.log("")
  presentation(1)
  function presentation(count){
    if (count <= 2) {
      var question = "Joueur "+count+" , Tapez votre nom :"
      prompt(question, answer => {
        if (count == 1) {
          state.p1 = answer
        }else {
          state.p2 = answer
        }
        count++
        presentation(count)
      })
    }else {
      promptNextMove(state,"ok")
    }
  }
  function promptNextMove(state,error) {
    const player = getPlayerForState(state)
    const displayPlayer = getDisplayPlayer(state,player)
    console.log('\033[2J');
    console.log(chalk.redBright("P")+
    chalk.yellowBright("u")+
    chalk.greenBright("i")+
    chalk.cyanBright("s")+
    chalk.blueBright("s")+
    chalk.magentaBright("a")+
    chalk.blueBright("n")+
    chalk.cyanBright("c")+
    chalk.greenBright("e")+
    chalk.yellowBright(" 4"))
    console.log(chalk.red('Tour :') + chalk.yellow(state.turn))
    console.log('Colonne :')
    console.log(" 1 2 3 4 5 6 7")
    display(state.board)
    var filled = true
    state.board.forEach(row => {
      row.forEach(cell => {
        // write('' + cell)
        if (cell == 0) {
          filled = false
        }
      })
    })
    if (filled) {
      playAgain(state,player,false)
    }else {
      var question
      if (error == "wrong") {
        question = `${displayPlayer}, tu as tapé une mauvaise valeur, réessai :`
      }else if (error == "filled") {
        question = `${displayPlayer}, la colonne est déjà remplie, réessai :`
      }else {
        question = `${displayPlayer}, prochain coup ? `
      }
      prompt(question, answer => {
        if (answer < 1 || answer > 7) {
          promptNextMove(state,"wrong")
        }else {
          let i = 6
          var flag = false
          while (!flag) {
            i--
            if (i < 0) {
              flag =true
            }else if (state.board[i][answer-1] == 0) {
              flag =true
            }
          }
          if (i == -1) {
            promptNextMove(state,"filled")
          }else {
            state.board[i][answer-1] = player
            console.log(displayPlayer+' a joué : ' + answer)
            endGame(state,displayPlayer,i,answer-1)
            state.turn++
            console.log('\033[2J')
          }
          promptNextMove(state,"ok")
        }
      })
    }
  }

  function getPlayerForState(state) {
    const turn = state.turn
    if (turn % 2 === 0) {
      return PLAYER_A
    } else {
      return PLAYER_B
    }
  }

  function getDisplayPlayer(state,player) {
    switch (player) {
      case PLAYER_A: return state.p1
      case PLAYER_B: return state.p2
      default: throw new Error('Invalid player: ' + player)
    }
  }
}

function prompt(question, callback) {
  rl.question(question, callback)
}

// display(board)

function display(board) {
  board.forEach(row => {
    row.forEach(cell => {
      // write('' + cell)
      if (cell == 1) {
        write(chalk.blueBright("|")+chalk.yellowBright("O"))
      }else if (cell == 2) {
        write(chalk.blueBright("|")+chalk.redBright("O"))
      }else {
        write(chalk.blueBright("|")+" ")
      }
    })
    write(chalk.blueBright("|")+String("\n"))
  })
}

function write(msg) {
  process.stdout.write(msg)
}

function endGame(state,player,i,j){
  if(checkForVictory(state,i,j)){
    console.log("")
    playAgain(state,player,true)
  }
}


function checkForVictory(state,row,col){
  console.log("indexes ",row,col);
  if(getAdjacent(state,row,col,0,1)+getAdjacent(state,row,col,0,-1) > 2){
    return true;
  } else {
    if(getAdjacent(state,row,col,1,0) > 2){
      return true;
    } else {
      if(getAdjacent(state,row,col,-1,1)+getAdjacent(state,row,col,1,-1) > 2){
        return true;
      } else {
        if(getAdjacent(state,row,col,1,1)+getAdjacent(state,row,col,-1,-1) > 2){
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
function getAdjacent(state,row,col,row_inc,col_inc){
  if(cellVal(state,row,col) == cellVal(state,row+row_inc,col+col_inc)){
    return 1+getAdjacent(state,row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}
function cellVal(state,row,col){
  if(state.board[row] == undefined || state.board[row][col] == undefined){
    return -1;
  } else {
    return state.board[row][col];
  }
}

function playAgain(state,player,flag){
  if (flag) {
    const question = chalk.greenBright(player)+" à gagné en "+(state.turn+1)+" tours !\nVoulez-vous rejouer ? (y/n)"
    prompt(question, answer => {
      if (answer =='y') {
        for (var index in state.board) {
          state.turn = 0
          state.board[index] = [0,0,0,0,0,0,0]
        }
        console.log("");
        playGame()
      }else {
        rl.input.pause()
      }
    })
  }else {
    const question = "Egalité !\nVoulez-vous rejouer ? (y/n)"
    prompt(question, answer => {
      if (answer =='y') {
        for (var index in state.board) {
          state.turn = 0
          state.board[index] = [0,0,0,0,0,0,0]
        }
        console.log("");
        playGame()
      }else {
        rl.input.pause()
      }
    })
  }
}
