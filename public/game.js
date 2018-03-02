var boardJson
fetch(window.location.href + '/json',{
  headers: {
    'Accept': 'application/json',
    },
  })
  .then(result => result.json())
  .then(text => {
    boardJson = text
    console.log(text)
  })

fetch('/ping', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    value: 42,
    })
  })
  .then(result => result.json())
  .then(json => console.log(json))

document.getElementById("victoire").style.display = "none";


document.getElementById("board").addEventListener("click", function( event ) {
  var col = event.target.id.split("col")[1];
  var row = event.target.id.split("col")[0].split('r')[1];
  if (event.target.id != "board") {
      fetch(window.location.href+"/"+row.split('_')[0]+"/"+col+"/"+boardJson.turn, {
        method : 'POST',
        headers: {
          'Accept': 'application/json',
          },
        })
        .then(result => result.json())
        .then(text => {
        if (text.fini) {
          document.getElementById("victoire").style.display = "flex";
          var vainqueur
          if (text.turn % 2 === 0) {
            vainqueur = boardJson.p1
          }else {
            vainqueur = boardJson.p2
          }
          document.getElementById("textVictoire").innerHTML = vainqueur+" gagne !";
        }else {
          location.reload()
        }
        })
  }
}, false);
