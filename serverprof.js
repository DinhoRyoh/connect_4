const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const game = require('../game')

const url = `mongodb://mongo:27017`
const dbName = 'connect4'
const colName = 'games'

const connectionPromise = MongoClient.connect(url)

function getCollection() {
  return connectionPromise
    .then(client => {
      const db = client.db(dbName)
      const col = db.collection(colName)
      return col
    })
}

function createGame() {
  // TODO adapter donner
  const doc = {
    turn: 0,
    history: [{
      board: game.createEmptyBoard(),
    }]
  }
  return getCollection()
    .then(col => {
      return col.insertOne(doc)
    })
    .then(opResult => {
      if (opResult.result.ok === 1) {
        return opResult.ops[0]
      } else {
        throw new Error('Failed to insert document')
      }
    })
}

function toObjectId(id) {
  if (typeof id === 'string') {
    return ObjectID(id)
  } else {
    return id
  }
}

function findGame(id) {
  return getCollection()
    .then(col => {
      return col.findOne({
        _id: toObjectId(id),
      })
    })
}

function saveGameTurn(id, turn, board) {
  return getCollection()
    .then(col => {
      const filter = {_id: toObjectId(id)}
      // TODO adapter données
      const update = {
        $set: {turn: turn},
        $push: {history: {board}},
      }
      return col.updateOne(filter, update)
    })
}

createGame()
  .then(doc => {
    const id = doc._id
    return saveGameTurn(id, 3, [1, 2, 3])
      .then(result => {
        console.log(result)
        // return findGame(String(id))
      })
  })
  .then(result => {
    console.log(result)
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })

function testCreateGame() {
  createGame()
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
}
