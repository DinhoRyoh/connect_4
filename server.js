const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const game = require('./index')
const url = 'mongodb://mongo:27017'
const dbName = 'connect4'
const colName = 'games'
const collectionPromise = MongoClient.connect(url)

module.exports = {
  createGame,
  findGame,
  saveGameTurn,
  listAllGames,
  displayBoard,
  nextMove,
  check
}

function getCollection(){
  return collectionPromise.then(client => {
    const db = client.db(dbName)
    const col = db.collection(colName)
    return col
  })
}

function createGame(p1, p2){
  const doc = {
    p1 : p1,
    p2: p2,
    turn : 0,
    history:[
      {
        board: game.getBoard()
      }
    ]
  }
  return getCollection().then( col => {
    return col.insertOne(doc)
  }).then(opResult => {
    if (opResult.result.ok === 1) {
      return opResult.ops[0]
    }else {
      throw new Error('Failed to insert document')
    }
  })
  // console.log(doc)
}

function toObjectID(id){
  if (typeof id === 'string') {
    if (ObjectID.isValid(id)) {
      id = new ObjectID(id)
    }else {
      return null
    }
  }
  return id
}
function findGame(id){
  return getCollection().then(col => {
    return col.findOne({
      _id: toObjectID(id),
    })
  })
}
function saveGameTurn(id, turn, board){
  const update = {
    $set: {turn: turn},
    $push: {history: {board}},
  }
  return findGame(id).then((result) => {
    if (turn == result.turn +1) {
      return getCollection().then(col => {
        return col.updateOne({_id: toObjectID(id)}, update).then(() => {
          return findGame(id)
          //return listAllGames()

        })
      })
    }else {
      throw new Error('Failed to insert due from a wrong turn value')
    }
  })
}

function listAllGames(){
    return getCollection().then(col => col.find())
    .then(cursor => {
      return cursor.sort({_id:-1}).project({turn :0}).toArray()
    })
}


function displayBoard(board){
  var str = "<table id='board'>"
  var i = 1;
  var j = 1;
  board.forEach(row => {
    str += "<tr id='row"+i+"'>"
    i++
    j = 1
    row.forEach(cell => {
      // write('' + cell)
      if (cell == 1) {
        str += "<td id='r"+i+"_col"+j+"' style='background:#feca57 !important;'></td>"
        //write(chalk.blueB  console.log(board);
      }else if (cell == 2) {
        str += "<td id='r"+i+"_col"+j+"' style='background:#ff6b6b !important;'></td>"
        //write(chalk.blueBright("|")+chalk.redBright("O"))
      }else {
        str += "<td id='r"+i+"_col"+j+"' > </td>"
        //write(chalk.blueBright("|")+" ")
      }
      j++
    })
    //write(chalk.blueBright("|")+String("\n"))
    str += "</tr>"
  })
  str += "</table>"
  return str
}

function nextMove(board, col, turn){
  var token
  if (turn % 2 === 0) {
    token = 1
  }else {
    token = 2
  }
  let i = 6
  var flag = false
  while (!flag) {
    i--
    if (i < 0) {
      flag =true
    }else if (board[i][col-1] == 0) {
      flag =true
    }
  }
  board[i][col-1] = token
  return board;
}

function check(state, row, col){
  return game.checkForVictory(state, row, col)
}
// createGame().then(doc => {
//   const id = doc._id
//   return saveGameTurn(id,1,[1,2,3]).then(result => {
//     console.log(result)
//   })
// }).then( result => {
//   //console.log(result)
// }).catch( err => {
//   console.error(err.stack)
//   process.exit(1)
// })

// promise.then(client => {
//   console.log(client);
//   return new Promise((resolve,reject)=>{
//     setTimeout(function () {
//       resolve(12)
//     }, 2000);
//   })
// }).then(res => {
//   console.log(res);
// }).catch(error => {
//   console.error(error.stack)
//   process.exit(1)
// })
// // promise.then(function(client){
// //   console.log(client);
// // })
//
// Promise.all([promise]).then()
