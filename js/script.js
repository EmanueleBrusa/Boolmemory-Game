const films = [
  {
    name: 'Il grande Lebowsky',
    img: 'il-grande-lebowsky.jpg',
  },
  {
    name: 'Il signore degli anelli: il ritorno del re',
    img: 'il-ritorno-del-re.jpg',
  },
  {
    name: "Star wars: l'impero colpisce ancora",
    img: 'impero-colpisce-ancora.jpg',
  },
  {
    name: 'Inception',
    img: 'inception.jpg',
  },
  {
    name: "Il signore degli anelli: la compagnia dell'anello",
    img: 'la-compagnia-dellanello.jpg',
  },
  {
    name: 'Il signore degli anelli: le due torri',
    img: 'le-due-torri.jpg',
  },
  {
    name: 'Shutter Island',
    img: 'shutter-island.jpg',
  },
  {
    name: 'The departed',
    img: 'the-departed.jpg',
  },
  {
    name: 'V per Vendetta',
    img: 'v-per-vendetta.jpg',
  },
  {
    name: 'Star wars: la vendetta dei sith',
    img: 'la-vendetta-dei-sith.jpg',
  },
  {
    name: 'Il mistero di Sleepy Hollow',
    img: 'il-mistero-di-sleepy-hollow.jpg',
  },
  {
    name: 'Non è un paese per vecchi',
    img: 'non-e-un-paese-per-vecchi.jpg',
  },
  {
    name: 'The hateful eight',
    img: 'the-hateful-eight.jpg',
  },
  {
    name: 'Pulp fiction',
    img: 'pulp-fiction.jpg',
  },
  {
    name: 'Matrix',
    img: 'matrix.jpg',
  },
  {
    name: 'Il caso spotlight',
    img: 'il-caso-spotlight.jpg',
  },
  {
    name: 'The founder',
    img: 'the-founder.jpg',
  },
  {
    name: 'Django: unchained',
    img: 'django-unchained.jpg',
  },
  {
    name: 'The wolf of wall street',
    img: 'the-wolf-of-wall-street.jpg',
  },
  {
    name: 'Constantine',
    img: 'constantine.jpg',
  },
  {
    name: 'Interstellar',
    img: 'interstellar.jpg',
  },
  {
    name: 'Full metal jacket',
    img: 'full-metal-jacket.jpg',
  },
  {
    name: 'Arancia meccanica',
    img: 'arancia-meccanica.jpg',
  },
  {
    name: 'Eyes wide shut',
    img: 'eyes-wide-shut.jpg',
  },
  {
    name: 'John Wick',
    img: 'john-wick.jpg',
  },
  {
    name: 'Matrix: Reloaded',
    img: 'matrix-reloaded.jpg',
  },
  {
    name: 'Matrix: Revolutions',
    img: 'matrix-revolutions.jpg',
  },
  {
    name: 'Il grande gatsby',
    img: 'il-grande-gatsby.jpg',
  },
  {
    name: 'La maledizione della prima luna',
    img: 'la-maledizione-della-prima-luna.jpg',
  },
  {
    name: 'Scarface',
    img: 'scarface.jpg',
  },
  {
    name: 'Mad Max: Fury road',
    img: 'mad-max.jpg',
  },
  {
    name: 'Ready Player One',
    img: 'ready-player-one.jpg',
  },
  {
    name: 'Jurassic Park',
    img: 'jurassic-park.jpg',
  },
  {
    name: 'Alien',
    img: 'alien.jpg',
  },
]

// Per registrare la partita abbaimo bisogno di:
/*
- giocatore - nome giocatore / prompt
- time - tempo di gioco / totalSeconds
- click / incrementare ad ogni click
- data / new Date()
- difficulty / difficoltà 
*/

function addToLocalStorage(game) {
  const games = JSON.parse(localStorage.getItem('games')) || []
  games.push(game)
  console.log(JSON.stringify(games))
  localStorage.setItem('games', JSON.stringify(games))
}

generateWinnerTable()

//FUNZIONE CHE PERMETTE DI INIZIARE UNA NUOVA PARTITA
function createNewGame(timer) {
  //RECUPERO GLI ELEMENTI DEL DOM CHE MI SERVONO
  const grid = document.getElementById('grid')
  const select_value = parseInt(document.getElementById('difficulty').value)

  const player_name = prompt('Inserisci il tuo nome') || 'Anonimo'
  //RESETTO PREVENTIVAMENTE LA GRIGLIA
  grid.innerHTML = ''

  //DICHIARAZIONE DELLA VARIABILE CHE CONTERRA' IL NUMERO DI CARTE
  let difficulty

  switch (select_value) {
    case 0:
      difficulty = 16;
      break
    case 1:
      difficulty = 36;
      break
    default:
      alert('Seleziona un livello di difficoltà per giocare')
  }

  //GENERO L'ARRAY DELLE CARTE RANDOMICHE
  let arrayCards = createArrayCards(films, difficulty)

  //CREO L'ARRAY DELLE CARTE DI GIOCO A PARTIRE DA QUELLO PRECEDENTE E RANDOMICIZZANDONE L'ORDINE
  let totalCards = [...arrayCards, ...arrayCards].sort(
    () => 0.5 - Math.random()
  )

  const newGame = {
    giocatore: player_name,
    data: new Date(),
    click: 0,
    difficulty,
  }

  createCards(totalCards, difficulty, timer, newGame)
}

//DEFINIZIONE DELLA FUNZIONE CHE CREA LA GRAFICA DELLA CARTA
function createGraphicCard(num, film) {
  const card = document.createElement('div')
  card.classList.add('game-card')
  card.style.width = `calc(100% / ${num} - 20px)`

  if (num === 4) {
    card.style.height = '400px'
  } else {
    card.style.height = '300px'
  }

  card.style.margin = '10px'
  card.dataset.name = film.name
  card.innerHTML += `<img src="./img/card-back-black.png" class="card-face-back">`
  card.innerHTML += `<img src="./img/${film.img}" class="card-face-front">`

  return card
}

//FUNZIONE CHE CREA LE CARTE DI GIOCO
function createCards(arrayCards, total_cards, timer, game) {
  let cardPerRow = Math.sqrt(total_cards)
  let flipped = [] //array che contiene le carte girate per controllare se sono uguali
  let guessed = [] //array che contiene le copiie di carte indovinate

  arrayCards.forEach((elem) => {
    const card = createGraphicCard(cardPerRow, elem)

    card.addEventListener('click', function () {
      game.click += 1
      this.classList.add('flipped')
      //recupero tutte le carte con la classe flipped
      const flippedCards = document.querySelectorAll('.flipped')

      flipped.push(this.dataset.name)

      //se l'array flipped contiene due elementi, li confronto
      if (flipped.length === 2) {
        if (flipped[0] == flipped[1]) {
          //SE HO INDOVINATO, INSERISCO LA COPPIA TROVATA NELL'ARRAY GUESSED, INSERENDO SOLO UNA VOLTA IL NOME DEL FILM
          guessed.push(flipped[0])

          //SVUOTO L'ARRAY DELLA COPPIA DI CARTE GIRATA ATTUALMENTE
          flipped = []

          if (guessed.length === arrayCards.length / 2) {
            // stoppo il timer
            clearInterval(timer)

            // setto il tempo di totale di gioco
            game.time = totalSeconds
            console.log(game)
            addToLocalStorage(game)

            setTimeout(() => {
              alert('Hai vinto')
            }, 1000)
            generateWinnerTable()
          }
        } else {
          //RIMUOVO LA CLASSE FLIPPED DA TUTTE LE CARTE
          flippedCards.forEach((elem) => {
            setTimeout(() => elem.classList.remove('flipped'), 1000)
          })

          flipped = []
          guessed = []
        }
      }
    })

    grid.append(card)
  })
}

//DEFINIZIONE DELLA FUNZIONE CHE GENERA UN ARRAY DI CARTE CASUALI
function createArrayCards(array_films, difficulty) {
  //PRENDO RANDOMICAMENTE DEGLI ELEMENTI DELL'ARRAY PER EVITARE DI PRENDERE SEMPRE I PRIMI 8 O i PRIMI 18
  return (shuffled = array_films
    .sort(() => 0.5 - Math.random())
    .slice(0, difficulty / 2))
}

const button = document.getElementById('start')

let totalSeconds = 0

function startTimer() {
  // puntiamo agli elementi del dom
  const minutes = document.getElementById('minutes')
  const seconds = document.getElementById('seconds')
  totalSeconds = 0

  seconds.innerHTML = '00'
  minutes.innerHTML = '00'

  return setInterval(() => {
    totalSeconds++
    seconds.innerHTML = formatting_timer(totalSeconds % 60)
    minutes.innerHTML = formatting_timer(parseInt(totalSeconds / 60))
  }, 1000)
}

function formatting_timer(value) {
  if (value > 9) {
    return value
  } else {
    return '0' + value
  }
  //   return value > 9 ? value : '0' + value
}

button.addEventListener('click', function () {
  let timer
  // se ne caso til timer fosse in attivo lo resetto
  clearInterval(timer)

  //  faccio iniziare il timer
  timer = startTimer()

  //CHIMATA DELLA FUNZIONE CHE GENERA UNA NUOVA PARTITA

  createNewGame(timer)
})

function generateWinnerTable() {
  let storageData = JSON.parse(localStorage.getItem('games'))

  if (!storageData) {
    return
  }

  let toAppend = ''
  toAppend += `<tr>
  <th>giocatore</th>
  <th>difficoltà</th>
  <th>data</th>
  <th>click</th>
  <th>secondi</th>
</tr>`
  storageData.forEach((game) => {
    toAppend += `<tr>
              <td>${game.giocatore}</td>
              <td>${game.difficulty}</td>
              <td>${game.data}</td>
              <td>${game.click}</td>
              <td>${game.time}</td>
          </tr>`
  })
  document.getElementById('tablewrapper').innerHTML = `
          <table class="table">${toAppend}</table>
      `
}
