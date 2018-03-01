var express = require('express')
var compression = require('compression')
var morgan = require('morgan')
var app = express()
const {
  listAllGames,
  findGame
} = require('./server')
app.use(morgan('tiny'))
//middleware
app.use((req, res, next) => {
  next()
})

const myCompression = compression()
app.use(myCompression)

app.get('/', function(req, res){
  listAllGames().then(games =>{
      const html = renderGames(games)
      res.send(html)
  }).catch(err => {
    console.error("Failed to serve /", err)
    res.status(500).send('Oops !')
  })
});

app.get('/games/:id', (req, res) =>{
  findGame(req.params.id).then( result => {
    if (result === null) {
      res.status(404).send("Partie inexistante")
    }else {
      res.send(`
        <html>
          <head>
            <title>Puissance 4</title>
          </head>
          <body>
            <h1>Jeu ${result._id}</h1>
            <section>
              <h2>Tour : ${result.turn}</h2>
            </section>
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
    return `<li><a href="/games/${game._id}">${game._id}</a></li>`
  }).join(' ')
  return `
      <html>
        <head>
          <title>Puissance 4</title>
        </head>
        <body>
          <h1>Puissance 4</h1>
          <section>
            <h2>Toutes les Parties</h2>
            <ul>
              ${list}
            </ul>
          </section>
        </body>
      </html>
    `;
}

app.listen(80, (err) => {
  if (err) {
    console.error(err ? err.stack : err)
    process.exit(255)
  }else {
    console.log("listening on *:80");
  }
})
