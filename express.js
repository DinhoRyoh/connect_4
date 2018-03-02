var express = require('express')
var compression = require('compression')
var morgan = require('morgan')
var app = express()
const {
  listAllGames,
  findGame,
  createGame,
  displayBoard,
  nextMove,
  saveGameTurn,
  check
} = require('./server')

const router = express.Router()

module.exports = router
app.use(morgan('tiny'))


app.use(express.json())
app.use(express.urlencoded())

//middleware
app.use((req, res, next) => {
  next()
})

app.use('/static',express.static('public'));
app.use(router)

router.post('/game', (req, res) => {
    createGame(req.body["p1"],req.body["p2"]).then( result => {
      res.redirect('/game/'+result._id)
    })
})
router.post('/game/:id/:row/:col/:turn', (req, res) => {
  var lastMove = []
  if (req.params.col !== null) {
    findGame(req.params.id).then( result => {
      if (result === null) {
        res.status(404).send("Partie inexistante")
      }else {
        for (var index in result.history) {
          lastMove = result.history[index]
        }
        const board = nextMove(lastMove.board,req.params.col,req.params.turn)
        return saveGameTurn(req.params.id,+req.params.turn+1,board)
      }
    }).then((result) => {
      var i = 6
      var flag = true
      while(flag){
        i--
        if (lastMove.board[i][+req.params.col-1] == 0) {
          flag = false
        }
      }
      if (check(lastMove,i+1,+req.params.col-1)) {
        console.log('victoire');
        res.send({fini : true, turn : +req.params.turn+1})
      }else {
        console.log('continue');
        res.send(result)
      }
    }).catch(err => {
      console.error("Failed to serve /game/"+req.params.id, err)
      res.status(500).send('Oops !')
    })
  }
})
router.get('/', function(req, res){
  listAllGames().then(games =>{
      const html = renderGames(games)
      res.send(html)
  }).catch(err => {
    console.error("Failed to serve /", err)
    res.status(500).send('Oops !')
  })
});
router.post('/ping', (req, res) => {
  const value = req.body ? req.body.value : null
  console.log({
    response: value
  })
  res.send({
    response: value
  })
})
router.get('/game/:id/json', (req, res) => {
  const id = req.params.id
  findGame(id)
    .then(game => {
      if (game === null) {
        res.status(404).send({error: 'not found'})
      } else {
        res.send(game)
      }
    })
    .catch(err => {
      console.error('Failed to serve /game/....json', err.stack)
      res.status(500).send({error: 'server error'})
    })
})
router.get('/game/:id', (req, res) =>{
  findGame(req.params.id).then( result => {
    if (result === null) {
      res.status(404).send("Partie inexistante")
    }else {
      var lastMove = []
      for (var index in result.history) {
        lastMove = result.history[index]
      }
      const board = displayBoard(lastMove.board)
      var who
      if (result.turn % 2 === 0) {
        who = result.p2
      }else {
        who = result.p1
      }
      res.send(`
        <html>
          <head>
            <title>Puissance 4</title>
            <link rel="stylesheet" href="/static/game.css">
          </head>
          <body>
            <div id="victoire">
              <div><span id="textVictoire"></span></div>
              <div><a id="retourVictoire" href="/">retour</a></div>
            </div>
            <a href="/">retour</a>
            <h1>Jeu ${result._id}</h1>
            <section>
              <p>DUEL !</p>
              <h2>${result.p1} VS ${result.p2}</h2>
              <h3>Tour : ${result.turn}</h3>
              <h3>${who} joue</h3>
            </section>
            <section>
              ${board}
            </section>
            <script type="text/javascript" src="/static/game.js"></script>
          </body>
        </html>
      `)
    }
  }).catch(err => {
    console.error("Failed to serve /games/"+req.params.id, err)
    res.status(500).send('Oops !')
  })
})

function renderGames(games){
  const list = games.map(game =>{
    return `<tr><td><a href="/game/${game._id}">${game.p1} VS ${game.p2}</a></td></tr>`
  }).join(' ')
  return `
      <html>
        <head>
          <title>Puissance 4</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900">
          <link rel="stylesheet" href="/static/game.css">
        </head>
        <body>
          <h1>Puissance 4</h1>
          <section>
            <form action="/game" method="POST">
              <label>Joueur 1</label><br>
              <input type="text" name='p1'>
              <br>
              <br>
              <label>Joueur 2</label><br>
              <input type="text" name='p2'>
              <br>
              <br>
              <input type="submit"  value="Créer partie">
            </form>
          </section>
          <section>
            <table id="listPartie">
              <tr>
                <th>
                  Liste des parties
                </th>
              </tr>
              ${list}
            </table>
          </section>
        </body>
      </html>
    `;
}
const myCompression = compression()
app.use(myCompression)

app.listen(80, (err) => {
  if (err) {
    console.error(err ? err.stack : err)
    process.exit(255)
  }else {
    console.log("listening on *:80");
  }
})
