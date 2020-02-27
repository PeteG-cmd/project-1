
function main() {

  launchGame()
  function launchGame() {
    // resetDom()

    // function resetDom() {
    //   const scoresDiv = document.querySelector('.scoresDiv')
    //   const scoresDiv2 = document.querySelector('.scoresDiv2')
    //   const infoDiv = document.querySelector('.infoDiv')
    //   const grid = document.querySelector('.grid')

    //   while (scoresDiv.hasChildNodes() && scoresDiv.childElementCount !== 1) {
    //     scoresDiv.removeChild(scoresDiv.lastChild)
    //   }
    //   while (scoresDiv2.hasChildNodes()) {
    //     scoresDiv2.removeChild(scoresDiv2.lastChild)
    //   }
    //   while (infoDiv.hasChildNodes()) {
    //     infoDiv.removeChild(infoDiv.lastChild)
    //   }
    //   while (grid.hasChildNodes()) {
    //     grid.removeChild(grid.lastChild)
    //   }
    // }



    //SET UP VARIABLES NEEDED

    const width = 20
    const gridCellCount = width * width
    const grid = document.querySelector('.grid')
    const cells = []
    let score = 0
    let level = 1
    let dude = 250
    let playerDirection
    const ghosts = []
    const ghostPenCells = [208, 209, 210, 211]
    const ghostPenOccupied = []
    let ghostReleaseCountdownActive = false
    let intervalId
    let intervalId2
    let intervalId3
    let returningGhostInterval
    let ghostFreezeDisplayInterval
    let playerSpeedDisplayInterval
    let ghostEatableDisplayInterval
    let playerIsHunter = false
    let ghostsAreFrozen = false
    let playerIsSpeedy = false
    const eatenGhosts = []
    let ghostEatableTimer
    let ghostFreezeTimer
    let playerSpeedTimer
    let ghostReleaseTimer
    const ghostSpeed = 0.4
    const playerSpeed = 0.4
    let lives = 3
    const numOfGhostsInGame = 4
    const secondsBetweenNewGhostGeneration = 8
    let secondsBetweenGhostRelease = 2.5
    let searchWidth = 7
    let chanceOfGhostMovingSmartly = 75 // this is as a percentage
    const timeGhostsRemainEatable = 8
    const timeGhostsRemainFrozen = 6
    const timePlayerIsSpeedy = 4
    const lifeCells = [177, 178, 179]


    const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

    const noFoodCells = [160, 161, 162, 166, 167, 168, 169, 170, 171, 172, 173, 200, 208, 209, 210, 211, 219, 246, 247, 248, 249, 250, 251, 252, 253]

    const penGateCells = [188, 189, 190, 191]

    const superFoodEatableCells = [24, 133, 215, 323]
    const superFoodFreezeCells = [126, 336]
    const superFoodSpeedCells = [35, 204]

    let scores = []
    getLocalScores()
    //Set up how the game should start

    const mainGameScreen = document.querySelector('.mainDiv')
    const playerNameInputScreen = document.querySelector('.playerInputDiv')
    const startGameButton = document.querySelector('.playButton')
    let playerName = document.querySelector('#playerName').value
    mainGameScreen.style.display = 'none'

    initialiseScoreBoard()

    startGameButton.addEventListener('click', () => {

      playerName = document.querySelector('#playerName').value
      // checkNameIsUnique(playerName)


      scores.map((element) => {
        if (element.currentPlayer === true) {
          element.currentPlayer = false
        }
      })
      const player = { name: playerName, score: score, currentPlayer: true }
      while (scores.length > 7) {
        scores.pop()
      }
      scores.push(player)

      playerNameInputScreen.style.display = 'none'
      mainGameScreen.style.display = 'flex'
      initialiseScoreBoard()
      // setTimeout(() => {
      //   startGame(numOfGhostsInGame)
      // }, 3000)

      handleGameInterval('newLevel')

    })

    // function checkNameIsUnique(name) {
    //   let nameIsNotUnique = true
    //   let i = 1
    //   while (nameIsNotUnique) {
    //     scores.map((element) => {
    //       if (element.name === name) {
    //         playerName = playerName + i
    //         i++
    //       } else {
    //         nameIsNotUnique = false
    //       }
    //     })
    //   }
    // }



    //INITIALISE SCORE BOARD

    function initialiseScoreBoard() {

      const scoreBoard = document.querySelector('.scoresDiv')
      const scoreBoard2 = document.querySelector('.scoresDiv2')

      for (let i = 0; i < scores.length; i++) {
        const scorePanel = document.createElement('div')
        scorePanel.classList.add('scorePanel')
        if (scores[i].currentPlayer === true) {
          scorePanel.id = 'currentPlayer'
        } else {
          scorePanel.id = 'scorePanel' + i
        }
        const rankPosition = document.createElement('h1')
        const playerNameSection = document.createElement('p')
        const playerScoreSection = document.createElement('p')

        rankPosition.innerHTML = i + 1
        rankPosition.classList.add('white')
        playerNameSection.innerHTML = scores[i].name
        playerScoreSection.innerHTML = scores[i].score

        scorePanel.appendChild(rankPosition)
        scorePanel.appendChild(playerNameSection)
        scorePanel.appendChild(playerScoreSection)

        if (mainGameScreen.style.display === 'flex') {
          scoreBoard.appendChild(scorePanel)
        } else {
          scoreBoard2.appendChild(scorePanel)

        }
      }
    }

    function orderAndUpdateScoreBoard() {
      orderScoreBoard()
      const scoreBoard = document.querySelector('.scoresDiv')
      const scoreBoard2 = document.querySelector('.scoresDiv2')

      if (mainGameScreen.style.display === 'flex') {

        while (scoreBoard.hasChildNodes() && scoreBoard.childElementCount !== 1) {
          scoreBoard.removeChild(scoreBoard.lastChild)
        }
      } else {

        while (scoreBoard2.hasChildNodes()) {
          scoreBoard2.removeChild(scoreBoard2.lastChild)
        }
      }
      initialiseScoreBoard()
    }



    function orderScoreBoard() {
      scores = scores.sort((element, element2) => element2.score - element.score)
    }

    function updateCurrentScorePanel() {
      document.querySelector('#currentPlayer').lastChild.innerHTML = score
      scores.map((element) => {
        if (element.name === playerName && element.currentPlayer === true) {
          element.score = score
        }
      })
      orderAndUpdateScoreBoard()

    }

    function localStoreScores() {
      if (localStorage) {
        orderScoreBoard()
        // scores.map((element) => {
        //   if (element.currentPlayer === true) {
        //     element.currentPlayer = false
        //   }
        // })
        localStorage.setItem('playerScores', JSON.stringify(scores))
      }
    }

    function getLocalScores() {
      if (localStorage) {
        const playerScores = JSON.parse(localStorage.getItem('playerScores'))
        if (playerScores) {
          scores = playerScores
          console.log(scores)
        }
      }
      if (scores.length === 0) {
        scores.push({ name: 'Blinky', score: '5000', currentPlayer: false })
        scores.push({ name: 'Pinky', score: '2000', currentPlayer: false })
        scores.push({ name: 'Inky', score: '1000', currentPlayer: false })
        scores.push({ name: 'Clyde', score: '500', currentPlayer: false })
      }
    }

    //INITIALISE INFO BOARD

    const infos = []
    const infoBoard = document.querySelector('.infoDiv')
    const superFoods = ['bolt from the blue', 'wonder green', 'berry.. set... GO!']
    const superFoodColor = ['rgb(47, 188, 204)', 'rgb(39, 184, 130)', 'rgb(219, 83, 59)']
    const superFoodPower = ['EAT', 'FREEZE', 'SPEED']
    const superFoodGraphics = ['images/bolt-from-the-blue-1.png', 'images/wonder-green.png', 'images/berry-set-go.png']

    for (let i = 0; i < superFoods.length; i++) {
      const infoPanel = document.createElement('div')
      infoPanel.classList.add('infoPanel')
      infoPanel.id = 'infoPanel' + i
      const superFoodGraphic = document.createElement('img')
      const superFoodDescription = document.createElement('p')

      superFoodGraphic.src = superFoodGraphics[i]
      superFoodDescription.innerHTML = superFoods[i]
      // superFoodDescription.innerHTML += '<br>'
      // superFoodDescription.innerHTML += '= ' + superFoodPower[i] + '...'

      superFoodDescription.style.color = superFoodColor[i]

      infoPanel.appendChild(superFoodGraphic)
      infoPanel.appendChild(superFoodDescription)

      infoBoard.appendChild(infoPanel)
      infos.push(infoBoard)
    }




    //INITIALISE MAP

    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      // cell.innerHTML = i // REMOVE ONCE FINISHED WITH NUMBERS
      if (i === dude) {
        cell.classList.add('dude-right')
      }
      if (!(noFoodCells.includes(i)) && (!(wallCells.includes(i)))) {
        cell.classList.add('food')
      }

      if (isASuperFoodEatableCell(i)) {
        cell.classList.remove('food')
        cell.classList.add('superFoodEatable')
      }

      if (isASuperFoodFreezeCell(i)) {
        cell.classList.remove('food')
        cell.classList.add('superFoodFreeze')
      }

      if (isASuperFoodSpeedCell(i)) {
        cell.classList.remove('food')
        cell.classList.add('superFoodSpeed')
      }

      wallCells.filter((element) => {
        if (element === i) {
          cell.classList.add('wall')
        }
      })

      if (penGateCells.includes(i)) {
        cell.classList.remove('wall')
        cell.classList.add('cellGate')
      }

      grid.appendChild(cell)
      cells.push(cell)
    }

    // MAKE AND DISPLAY THE SCORE IN WHITE
    cells[161].innerHTML = score
    cells[161].classList.add('white')

    cells[188].classList.remove('wall')
    cells[188].classList.add('cellGate')


    function isASuperFoodEatableCell(cell) {
      if ((!(noFoodCells.includes(cell)) && (!(wallCells.includes(cell)))) && (superFoodEatableCells.includes(cell))) {
        return true
      }
    }

    function isASuperFoodFreezeCell(cell) {
      if ((!(noFoodCells.includes(cell)) && (!(wallCells.includes(cell)))) && (superFoodFreezeCells.includes(cell))) {
        return true
      }
    }

    function isASuperFoodSpeedCell(cell) {
      if ((!(noFoodCells.includes(cell)) && (!(wallCells.includes(cell)))) && (superFoodSpeedCells.includes(cell))) {
        return true
      }
    }



    class Location {

      constructor(cellNumber, path) {
        this.cellNumber = cellNumber
        this.path = path
      }
    }


    class Ghost {

      constructor(name, currentCell) {
        this.name = name
        this.ghostClass = name
        this.currentCell = currentCell
        this.directionMoving
        this.availableDirections = []
        this.cellOnPath
        this.cellJustLeft = currentCell //NEEDED FOR ENDING GAME WITHOUT GLITCHES AND PLAYER BEING ABLE TO 'CROSSOVER' ANY OF THE GHOSTS

      }
      setAvailableDirections() {

        if ((!(wallCells.includes(this.currentCell + 1))) && this.directionMoving !== 4) {
          this.availableDirections.push(this.currentCell + 1)
        }
        if ((!(wallCells.includes(this.currentCell - 1))) && this.directionMoving !== 2) {
          this.availableDirections.push(this.currentCell - 1)
        }
        if ((!(wallCells.includes(this.currentCell + width))) && this.directionMoving !== 1) {
          this.availableDirections.push(this.currentCell + width)
        }
        if ((!(wallCells.includes(this.currentCell - width))) && this.directionMoving !== 3) {
          this.availableDirections.push(this.currentCell - width)
        }
        return
      }

      moveGhost() {

        if (!(eatenGhosts.includes(this.name))) { // THIS REMOVES THE GHOST FROM EVALUATION IF IT HAS BEEN EATEN



          // THE FOLLOWING 2 X IF ELSE HANDLE IF THE GHOST GOES THROUGH THE TRANSPORT TUNNEL
          if (this.currentCell === 219 && this.directionMoving === 2) {
            this.removeAllGhostClasses()
            this.cellJustLeft = this.currentCell
            this.currentCell -= (width - 1)
            cells[this.currentCell].classList.add(this.ghostClass)

          } else if (this.currentCell === 200 && this.directionMoving === 4) {
            this.removeAllGhostClasses()
            this.cellJustLeft = this.currentCell
            this.currentCell += (width - 1)
            cells[this.currentCell].classList.add(this.ghostClass)

          } else if (!(ghostPenCells.includes(this.currentCell))) {

            if (this.cellOnPath !== '' && this.willFindCellOnPath() === true && playerIsHunter === false) { // THIS IF STATEMENT CHECKS IF THE GHOST SHOLD MOVE ON THE PATH OR RANDOMLY IF PATH NOT KNOWN. IT ALSO STOPS THE GHOST MOVING ON THE PATH IF THE PLAYER IS THE HUNTER

              // THIS IS NEEDED SO THE GHOST DIRECTION IS STILL SET EVEN IF MOVING ON PATH
              this.directionMoving = this.findDirectionMoving(this.currentCell, this.cellOnPath)

              // cells[this.currentCell].classList.remove(this.ghostClass)
              this.removeAllGhostClasses()
              this.cellJustLeft = this.currentCell
              // console.log('Ghost Moving to Smartly to Cell on Direct Path:')
              // console.log(this.cellOnPath)
              this.currentCell = this.cellOnPath
              this.cellOnPath = ''
              cells[this.currentCell].classList.add(this.ghostClass)
              this.addGhostAnimationClassNeeded()
              this.availableDirections = []

            } else {


              // THIS PICKS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT IF NO TARGET PATH AVAILABLE

              const nextCellGhost = Math.floor((Math.random()) * this.availableDirections.length)

              this.directionMoving = this.findDirectionMoving(this.currentCell, this.availableDirections[parseInt(nextCellGhost)])

              // cells[this.currentCell].classList.remove(this.ghostClass)
              this.removeAllGhostClasses()
              this.cellJustLeft = this.currentCell
              // console.log('Ghost moving from current cell, which is:')
              // console.log(this.currentCell)
              this.currentCell = this.availableDirections[parseInt(nextCellGhost)]
              this.cellOnPath = '' // THIS IS NEEDED AS IF BY CHANCE THE GHOST STOPS FOLLOWING THE PATH, I NEED TO ERASE THE PATH FOR THE GHOST TO FIND AGAIN
              cells[this.currentCell].classList.add(this.ghostClass)
              this.addGhostAnimationClassNeeded()
              this.availableDirections = []
            }
          }
        }

      }

      // THIS FUNCTIONALITY IS NOT ACTIVE AT THE MOMENT AS IS AFFECTING PERFORMANCE TOO MUCH
      addGhostAnimationClassNeeded() {
        if (this.directionMoving === 1) {
          cells[this.currentCell].classList.add('animate-ghost-up')
        }
        if (this.directionMoving === 2) {
          cells[this.currentCell].classList.add('animate-ghost-right')
        }
        if (this.directionMoving === 3) {
          cells[this.currentCell].classList.add('animate-ghost-down')
        }
        if (this.directionMoving === 4) {
          cells[this.currentCell].classList.add('animate-ghost-left')
        }
      }

      removeAllGhostClasses() {
        cells[this.currentCell].classList.remove(this.ghostClass)
        cells[this.currentCell].classList.remove('animate-ghost-down')
        cells[this.currentCell].classList.remove('animate-ghost-right')
        cells[this.currentCell].classList.remove('animate-ghost-left')
        cells[this.currentCell].classList.remove('animate-ghost-up')
        cells[this.currentCell].classList.remove('eatableBlue')
        cells[this.currentCell].classList.remove('freezeBlue')

      }


      findDirectionMoving(currentCell, newCell) {
        if (newCell - currentCell === 1 || newCell - currentCell === (width - 38)) { // The additional 'or' sets the direction as moving through the tunnel
          return 2
        }
        if (newCell - currentCell === -1 || newCell - currentCell === (width - 1)) {
          return 4
        }
        if (newCell - currentCell === -(width)) {
          return 1
        }
        if (newCell - currentCell === width) {
          return 3
        }
      }

      willFindCellOnPath() {
        const num = Math.floor((Math.random() * 100))
        if (num < chanceOfGhostMovingSmartly) {
          return true
        } else {
          return false
        }
      }

      findNextCellOnPath() {
        // PERFORMANCE NOTES - I COULD LIMIT THIS TO ONLT SEARCH UP TO 10 CELLS, SO THEY ONLY HOME IN ONCE THEY ARE NEAR? THIS COULD ALSO BE BETTER FOR GAME PLAY AS IT WOULD STOP THEM ALL TRACKING YOU AND BEING TOO DIFFICULT

        // THE BELOW IF MEANS THAT WE ONLY BOTHER CHECKING THE PATH IF THE GHOST HAS A CHOICE TO MAKE. THIS IS AGAIN TO IMPROVE PERFORMANCE. NOTE - THIS ALSO SOLVES THE ISSUE OF GHOSTS GOING THROUGH THE TUNNEL, AS THEY ARENT CHECKING THE PATH AT THIS POINT

        if (!(eatenGhosts.includes(this.name))) { // THIS REMOVES THE GHOST FROM EVALUATION IF IT HAS BEEN EATEN


          if (this.availableDirections.length > 1) {
            const queue = []
            const target = dude

            queue.push(new Location(this.currentCell, [this.currentCell]))
            // console.log('Current queue:')
            // console.log(queue)
            let pathNotFound = true
            console.log(this.availableDirections.length)
            console.log(queue.length)


            while (pathNotFound) {
              const checkCell = queue.shift()
              // console.log('Current Check Cell Path')
              // console.log(checkCell.path)
              console.log(checkCell)
              console.log(checkCell.path)


              // THESE NEXT 2 IFS HANDLE IF THE TARGET (dude) IS WITHIN A 10 CELL PATH AND HANDLES WEATHER TO SET THE NEXT CELL ON THE GHOST PATH, OR IF TO SET IT TO AN EMPTY STRING

              if (checkCell.path.length > searchWidth - 1) {
                pathNotFound = false
                // clearTimeout(stopLoopIfFrozenTimeout)
                // console.log(checkCell.path)
                // console.log('Path not Found - Distance above 10')
                this.cellOnPath = ''
              }

              if (checkCell.cellNumber === target) {
                pathNotFound = false
                // clearTimeout(stopLoopIfFrozenTimeout)
                // console.log(checkCell.path)
                // console.log('Path Found and Target set')
                this.cellOnPath = checkCell.path[1]
              }

              // THIS CODE HANDLES FINDING EVERY POSSIBLE PATH OF LENGTH 1 ,2, 3 etc, UNTIL IT FINDS THE TARGET

              if (!(wallCells.includes(checkCell.cellNumber + 1)) && (!(checkCell.path.includes(checkCell.cellNumber + 1))) && (!(checkCell.path.includes(this.cellJustLeft)))) {
                checkCell.path.push(checkCell.cellNumber + 1)
                const newPath = checkCell.path.slice()
                queue.push(new Location(checkCell.cellNumber + 1, newPath))
                checkCell.path.pop()
                // console.log('Checking right')
              }
              if (!(wallCells.includes(checkCell.cellNumber - 1)) && (!(checkCell.path.includes(checkCell.cellNumber - 1))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

                checkCell.path.push(checkCell.cellNumber - 1)
                const newPath = checkCell.path.slice()
                queue.push(new Location(checkCell.cellNumber - 1, newPath))
                checkCell.path.pop()
                // console.log('Checking left')

              }
              if (!(wallCells.includes(checkCell.cellNumber + width)) && (!(checkCell.path.includes(checkCell.cellNumber + width))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

                checkCell.path.push(checkCell.cellNumber + width)
                const newPath = checkCell.path.slice()
                queue.push(new Location(checkCell.cellNumber + width, newPath))
                checkCell.path.pop()
                // console.log('Checking down')
              }
              if (!(wallCells.includes(checkCell.cellNumber - width)) && (!(checkCell.path.includes(checkCell.cellNumber - width))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

                checkCell.path.push(checkCell.cellNumber - width)
                const newPath = checkCell.path.slice()
                queue.push(new Location(checkCell.cellNumber - width, newPath))
                checkCell.path.pop()
                // console.log('Checking up')
              }

            }
          }
        }
      }
    }

    // THIS CODE LOGS THE DIRECTION THE PLAYER IS WANTING PAC MAN TO MOVE DURING THE NEXT INTERVAL


    document.addEventListener('keydown', (event) => {

      //SETS THE PLAYER DIRECTION TO BE USED AT EACH INTERVAL

      if (event.key === 'ArrowRight') {
        playerDirection = 2
      } else if (event.key === 'ArrowLeft') {
        playerDirection = 4
      } else if (event.key === 'ArrowDown') {
        playerDirection = 3
      } else if (event.key === 'ArrowUp') {
        playerDirection = 1
      }

    })


    //FUNCTION TO CREATE A NEW GHOST, GIVING IT THE CELL TO START IN IN THE 'GHOST HOLDING PEN'

    function createGhost(startingCell) {

      ghosts.push(new Ghost(`ghost${ghosts.length + 1}`, startingCell))
      cells[startingCell].classList.add(ghosts[ghosts.length - 1].name)
      ghostPenOccupied.push(startingCell)
      console.log(ghosts)
    }

    function startGhostReleaseTimer() {
      ghostReleaseTimer = setTimeout(() => {
        if (ghostPenOccupied.length > 0) {
          ghosts.map((element) => {
            if (element.currentCell === ghostPenOccupied[0]) {
              cells[element.currentCell].classList.remove(element.removeAllGhostClasses())
              cells[element.currentCell].classList.remove('eatableBlue')
              element.currentCell -= 40
              eatenGhosts.shift() //THIS REACTIVATES THE PATH FINDING OF THE GHOST
              cells[element.currentCell].classList.add(element.ghostClass)
            }
          })
        }
        ghostPenOccupied.shift()
        ghostReleaseCountdownActive = false

      }, secondsBetweenGhostRelease * 1000)
    }

    function releaseGhosts() {
      if (ghostReleaseCountdownActive === false) {
        ghostReleaseCountdownActive = true
        startGhostReleaseTimer()
      }
    }

    function moveGhosts() {
      ghosts.map((element) => {
        if (!(ghostPenOccupied.includes(element.currentCell))) {
          element.setAvailableDirections()
          element.findNextCellOnPath() // IT IS VERY IMPORTANT THIS IS SECOND, AS I DONT WANT IT TO RUN UNLESS THERE ARE MULTIPLE AVAILABLE DIRECTIONS. THIS IS FOR PERDORMANCE AND TO LIMIT NEEDED CALCULATIONS

          element.moveGhost()

        }
      })
    }

    //GENERATES A NEW GHOST IN AN EMPTY PEN CELL
    function generateNewGhost() {
      if (ghostPenOccupied.length < 4) { //THIS IF STATEMENT STOPS A GHOST BEING GENERATED IF NOT ENOUGH CELLS ARE AVAILABLE
        createGhost(ghostPenCells.find((element) => !(ghostPenOccupied.includes(element))))
      }
    }

    function removeFoodIncrementScore(cellNum) {
      if (cells[cellNum].classList.contains('food')) {
        cells[cellNum].classList.remove('food')
        score += 10
        cells[161].innerHTML = score
        updateCurrentScorePanel()
      }
    }

    function ghostPenCellsFull() {
      ghostPenOccupied.length >= 4
    }


    function removeSuperFoodActivateChase(cellNum) {

      if (cells[cellNum].classList.contains('superFoodEatable')) {
        if (((ghosts.some((element) => element.ghostClass === 'eatableBlue')))) { //// THERE IS PROBABLY AN EDGE CASE TO DO WITH THE TIMER HERE THAT NEEDS TO BE SORTED. IF ALL GHOST ARE EATEN DO WE NEED TO HANDLE THE TIMER
          clearTimeout(ghostEatableTimer)
        }

        handleDomDisplayGhostEatabletimer()
        cells[cellNum].classList.remove('superFoodEatable')

        clearTimeout(ghostReleaseTimer)
        ghostReleaseCountdownActive = true //// THIS LINE AND THE LINE ABOVE ENSURE GHOSTS ARE NOT RELEASE UNTIL THE 'EATABLE' PERIOD IS OVER (10 SECONDS)

        if ((ghostPenCellsFull()) && ghostsAreFrozen === false) {
          ghostReleaseCountdownActive = false
        }

        score += 50
        cells[161].innerHTML = score
        playerIsHunter = true
        ghosts.map((element) => {
          if (!(ghostPenOccupied.includes(element.currentCell))) {
            cells[element.currentCell].classList.remove(element.name)
            cells[element.currentCell].classList.add('eatableBlue')
            element.ghostClass = 'eatableBlue'
          }
        })

        ghostEatableTimer = setTimeout(() => {
          playerIsHunter = false
          ghosts.map((element) => {
            cells[element.currentCell].classList.remove('eatableBlue')
            element.ghostClass = element.name
            cells[element.currentCell].classList.add(element.name)
            ghostReleaseCountdownActive = false

          })

        }, timeGhostsRemainEatable * 1000)
      }
      // CHECK IF A GHOST IS EATEN AND REMOVE IT FROM THE ARRAY IF IT IS
      ghosts.map((element) => {

        if ((doesCellContainDude(element.currentCell)) || doesCellContainDude(element.cellJustLeft) && element.ghostClass === 'eatableBlue') {


          eatenGhosts.push(element.name)
          score += 100
          cells[161].innerHTML = score
          cells[element.currentCell].classList.remove(element.removeAllGhostClasses())

          const path = calculateGhostReturnPath(element.currentCell)

          element.currentCell = (ghostPenCells.find((element) => !(ghostPenOccupied.includes(element))))
          ghostPenOccupied.push(element.currentCell) // THIS IS MAKING SURE THE NEXT GHOST EATEN DOESNT GO TO THE SAME CELL
          element.ghostClass = element.name
          element.directionMoving = ''
          element.availableDirections = []
          element.cellOnPath = ''
          element.cellJustLeft = element.currentCell

          sendEatanGhostOnPath(path, element.currentCell)

        }
      })
    }

    function sendEatanGhostOnPath(path, ghostCell) {

      returningGhostInterval = setInterval(() => {
        if (path.length > 1) {
          cells[path[0]].classList.remove('returningGhost')
          cells[path[1]].classList.add('returningGhost')
        }
        path.shift()
        if (path.length === 1) {
          cells[path[0]].classList.remove('returningGhost')
          ghosts.map((element) => {
            if (element.currentCell === ghostCell) {
              cells[element.currentCell].classList.add(element.ghostClass)
            }
          })
        }
      }, 100)

    }


    function calculateGhostReturnPath(currentGhostCell) { ///THIS IS WHAT I AM WORKING ON /////////////////

      let pathBackToPen
      const queue = []
      const target = 249

      queue.push(new Location(currentGhostCell, [currentGhostCell]))
      let pathNotFound = true

      while (pathNotFound) {
        const checkCell = queue.shift()

        if (checkCell.cellNumber === target) {
          pathNotFound = false
          pathBackToPen = checkCell.path
        }

        // THIS CODE HANDLES FINDING EVERY POSSIBLE PATH OF LENGTH 1 ,2, 3 etc, UNTIL IT FINDS THE TARGET

        if (!(wallCells.includes(checkCell.cellNumber + 1)) && (!(checkCell.path.includes(checkCell.cellNumber + 1))) && (!(checkCell.path.includes(this.cellJustLeft)))) {
          checkCell.path.push(checkCell.cellNumber + 1)
          const newPath = checkCell.path.slice()
          queue.push(new Location(checkCell.cellNumber + 1, newPath))
          checkCell.path.pop()
          // console.log('Checking right')
        }
        if (!(wallCells.includes(checkCell.cellNumber - 1)) && (!(checkCell.path.includes(checkCell.cellNumber - 1))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

          checkCell.path.push(checkCell.cellNumber - 1)
          const newPath = checkCell.path.slice()
          queue.push(new Location(checkCell.cellNumber - 1, newPath))
          checkCell.path.pop()
          // console.log('Checking left')

        }
        if (!(wallCells.includes(checkCell.cellNumber + width)) && (!(checkCell.path.includes(checkCell.cellNumber + width))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

          checkCell.path.push(checkCell.cellNumber + width)
          const newPath = checkCell.path.slice()
          queue.push(new Location(checkCell.cellNumber + width, newPath))
          checkCell.path.pop()
          // console.log('Checking down')
        }
        if (!(wallCells.includes(checkCell.cellNumber - width)) && (!(checkCell.path.includes(checkCell.cellNumber - width))) && (!(checkCell.path.includes(this.cellJustLeft)))) {

          checkCell.path.push(checkCell.cellNumber - width)
          const newPath = checkCell.path.slice()
          queue.push(new Location(checkCell.cellNumber - width, newPath))
          checkCell.path.pop()
          // console.log('Checking up')
        }

      }
      return pathBackToPen

    }

    function ghostPenCellsLocked() {
      penGateCells.map((element) => {
        element.style.outline.color = 'red'

      })
    }

    function removeSuperFoodActivateFreeze(cellNum) {
      if (cells[cellNum].classList.contains('superFoodFreeze')) {
        if (((ghosts.some((element) => element.ghostClass === 'freezeBlue')))) { //// THERE IS PROBABLY AN EDGE CASE TO DO WITH THE TIMER HERE THAT NEEDS TO BE SORTED. IF ALL GHOST ARE EATEN DO WE NEED TO HANDLE THE TIMER
          clearTimeout(ghostFreezeTimer)
        }
        handleDomDisplayGhostFreezeTimer()
        cells[cellNum].classList.remove('superFoodFreeze')

        clearTimeout(ghostReleaseTimer)
        ghostReleaseCountdownActive = true
        // ghostPenCellsLocked()


        if (ghostPenCellsFull() && playerIsHunter === false) {
          ghostReleaseCountdownActive = false
        }

        score += 50
        cells[161].innerHTML = score
        ghostsAreFrozen = true

        ghosts.map((element) => {
          if (!(ghostPenOccupied.includes(element.currentCell))) {
            // element.pathNotFound = false //// THIS STOPS THE GHOSTS FREEZING AND AN ERROR BEING THROWN AS THE WHILE LOOP FOR FIND PATH IS NEVER EXITED
            cells[element.currentCell].classList.add('freezeBlue')
            element.cellJustLeft = 211 ////THIS MEANS AFTER THE GHOSTS ARE FROZEN THEY DONT GET STUCK AND 'FIND NEXT CELL ON PATH' CAN FIRE

          }
        })


        ghostFreezeTimer = setTimeout(() => {
          ghostsAreFrozen = false
          ghostReleaseCountdownActive = false
          ghosts.map((element) => {
            if (!(ghostPenOccupied.includes(element.currentCell))) {
              cells[element.currentCell].classList.remove('freezeBlue')


            }
          })

        }, timeGhostsRemainFrozen * 1000)
      }
    }



    function handleDomDisplayGhostFreezeTimer() {
      const display1 = document.querySelector('#infoPanel1').lastChild
      clearInterval(ghostFreezeDisplayInterval)
      let i = timeGhostsRemainFrozen
      const superFoodDescription = 'wonder green'

      ghostFreezeDisplayInterval = setInterval(() => {
        display1.innerHTML = i.toFixed(2)
        i -= 0.1
        if (i <= 0) {
          clearInterval(ghostFreezeDisplayInterval)
          display1.innerHTML = superFoodDescription
        }
      }, 100)

    }



    function handleDomDisplayPlayerSpeedTimer() {
      const display = document.querySelector('#infoPanel2').lastChild
      clearInterval(playerSpeedDisplayInterval)
      let i = timePlayerIsSpeedy
      const superFoodDescription = 'berry.. set... GO'

      playerSpeedDisplayInterval = setInterval(() => {
        display.innerHTML = i.toFixed(2)
        i -= 0.1
        if (i <= 0) {
          clearInterval(playerSpeedDisplayInterval)
          display.innerHTML = superFoodDescription
        }
      }, 100)

    }



    function handleDomDisplayGhostEatabletimer() {
      const display = document.querySelector('#infoPanel0').lastChild
      clearInterval(ghostEatableDisplayInterval)
      let i = timeGhostsRemainEatable
      const superFoodDescription = 'bolt from the blue'

      ghostEatableDisplayInterval = setInterval(() => {
        display.innerHTML = i.toFixed(2)
        i -= 0.1
        if (i <= 0) {
          clearInterval(ghostEatableDisplayInterval)
          display.innerHTML = superFoodDescription
        }
      }, 100)

    }


    function removeSuperFoodActivateSpeed(cellNum) {
      if (cells[cellNum].classList.contains('superFoodSpeed')) {

        handleDomDisplayPlayerSpeedTimer()
        cells[cellNum].classList.remove('superFoodSpeed')



        clearInterval(intervalId2)
        startPlayerInterval(playerSpeed / 1.5)
        playerIsSpeedy = true

        score += 50
        cells[161].innerHTML = score

        playerSpeedTimer = setTimeout(() => {
          playerIsSpeedy = false
          clearInterval(intervalId2)
          startPlayerInterval(playerSpeed)

        }, timePlayerIsSpeedy * 1000)
      }
    }

    function doesCellContainDude(cellToCheck) {
      // if (cells[cellToCheck] === dude) {
      if ((cells[cellToCheck].classList.contains('dude-right')) || (cells[cellToCheck].classList.contains('dude-up')) || (cells[cellToCheck].classList.contains('dude-down')) || (cells[cellToCheck].classList.contains('dude-left')) || (cells[cellToCheck].classList.contains('dude-right-fast')) || (cells[cellToCheck].classList.contains('dude-up-fast')) || (cells[cellToCheck].classList.contains('dude-down-fast')) || (cells[cellToCheck].classList.contains('dude-left-fast'))) {
        return true
      }
    }

    function clearSuperFoodTimeOuts() {
      clearTimeout(ghostFreezeTimer)
      ghostsAreFrozen = false
      clearTimeout(playerSpeedTimer)
      playerIsSpeedy = false
      clearTimeout(ghostEatableTimer)
      playerIsHunter = false
      // clearTimeout(ghostReleaseTimer)

    }

    function checkForGameOver() {
      if (playerIsHunter === false)
        ghosts.map((element) => {
          if (cells[dude].classList.contains(element.name) || (doesCellContainDude(element.cellJustLeft))) {

            removeGhostsFromGame()
            removeAllPlayerClasses()

            clearSuperFoodTimeOuts()
            clearInterval(intervalId3)
            clearInterval(intervalId2)
            clearInterval(intervalId)
            clearInterval(returningGhostInterval)
            cells[dude].classList.add('apple')

            setTimeout(() => {

              // cells[element.cellJustLeft].doesCellContainDude(element.cellJustLeft)) {

              lives--
              cells[dude].classList.remove('apple')
              ghostReleaseCountdownActive = false

              if (livesDoRemain()) {
                resetAfterLifeLost()
              } else {
                displayLives(lives)
                movePlayerToStartingLocation()
                handleGameInterval('gameOver')
              }
            }, 3000)

          }
        })
    }

    function superFoodRemainingInGame() {
      cells.some((cell) => {
        if (cell.classList.contains('superFoodEatable')) {
          return true
        }
      })
    }

    function checkForGameWon() {
      const foodRemaining = cells.some((cell) => {
        return cell.classList.contains('food')
      })

      if ((!(foodRemaining)) && (!(superFoodRemainingInGame()))) {
        clearSuperFoodTimeOuts()
        clearInterval(intervalId2)
        clearInterval(intervalId)
        clearInterval(intervalId3)
        clearInterval(returningGhostInterval)
        // alert(`LEVEL COMPLETE! You scored ${score}...`)
        beginNextLevel()
      }
    }

    function resetAfterLifeLost() {
      // removeGhostsFromGame()
      movePlayerToStartingLocation()
      displayLives(lives)
      playerDirection =
        handleGameInterval('lifeLost')
    }

    function movePlayerToStartingLocation() {
      removeAllPlayerClasses()
      dude = 250
      cells[250].classList.add('dude-right')
    }


    function removeGhostsFromGame() {
      ghosts.map((element) => cells[element.currentCell].classList.remove(element.removeAllGhostClasses()))

      for (let i = 0; i < numOfGhostsInGame + 1; i++) { //// REMOVE ALL GHOSTS FROM THE GAME 
        ghosts.pop()
      }
    }

    function livesDoRemain() {
      if (lives !== 0) {
        return true
      }
    }

    function beginNextLevel() {
      if (level === 1 || level === 2 || level === 3 || level === 4) {
        level++
        secondsBetweenGhostRelease -= 0.5
        chanceOfGhostMovingSmartly += 4
        searchWidth += 1

        removeGhostsFromGame()
        movePlayerToStartingLocation()
        displayLives(lives)
        resetGameBoard()
        playerDirection =


          // setTimeout(() => {
          //   startGame(numOfGhostsInGame)
          // }, 3000)

          handleGameInterval('newLevel')

      } else {
        handleGameInterval('gameWon')
        // goToScoreBoard()

      }
    }

    function goToScoreBoard() {
      localStoreScores()
      // mainGameScreen.style.display = 'none'
      // gameCountdownScreen.style.display = 'none'
      // playerNameInputScreen.style.display = 'flex'
      // getLocalScores()
      updateCurrentScorePanel()
      location.reload()
      // alert('This should take you to the score board')
    }



    function resetGameBoard() {
      for (let i = 0; i < cells.length; i++) {
        if (!(noFoodCells.includes(i)) && (!(wallCells.includes(i)))) {
          cells[i].classList.add('food')
        }

        if (isASuperFoodEatableCell(i)) {
          cells[i].classList.remove('food')
          cells[i].classList.add('superFoodEatable')
        }

        if (isASuperFoodSpeedCell(i)) {
          cells[i].classList.remove('food')
          cells[i].classList.add('superFoodSpeed')
        }

        if (isASuperFoodFreezeCell(i)) {
          cells[i].classList.remove('food')
          cells[i].classList.add('superFoodFreeze')
        }
      }
    }

    function displayLives(numOfLives) {
      lifeCells.map((element) => {
        cells[element].classList.remove('life')
        cells[element].classList.remove('wall')
      })
      for (let i = 0; i < numOfLives; i++) {
        cells[lifeCells[i]].classList.add('life')
      }
    }




    function startPlayerInterval(playSpeed) {


      intervalId2 = setInterval(() => {

        //INTERVAL 2 - LOGIC CONTROLL FOR PLAYER --- USES THE PLAYED DIRECTION VARIABLE TO MOVRE THE PLAYER ONE SQUARE AT EACH INTERVAL

        if (playerDirection === 2) {
          movePlayerRight()

        } else if (playerDirection === 4) {
          movePlayerLeft()

        } else if (playerDirection === 3) {
          movePlayerDown()

        } else if (playerDirection === 1) {
          movePlayerUp()
        }

      }, playSpeed * 1000)

    }



    function movePlayerUp() {
      if (wallCells.includes(dude - width)) {
        return
      }
      removeAllPlayerClasses()
      dude -= width
      cells[dude].classList.add('dude-up')
      if (playerIsSpeedy) {
        cells[dude].classList.remove('dude-up')
        cells[dude].classList.add('dude-up-fast')
        cells[dude].classList.add('animate-dude-up-fast')
      } else {
        cells[dude].classList.add('animate-dude-up')
      }
    }

    function movePlayerRight() {
      if (dude === 219) {
        removeAllPlayerClasses()
        dude -= 19
        cells[dude].classList.add('dude-right')

      } else if (wallCells.includes(dude + 1)) {
        return
      }
      removeAllPlayerClasses()
      dude += 1
      cells[dude].classList.add('dude-right')
      if (playerIsSpeedy) {
        cells[dude].classList.remove('dude-right')
        cells[dude].classList.add('dude-right-fast')
        cells[dude].classList.add('animate-dude-right-fast')
      } else {
        cells[dude].classList.add('animate-dude-right')
      }

    }

    function movePlayerDown() {
      if (wallCells.includes(dude + width)) {
        return
      }
      removeAllPlayerClasses()
      dude += width
      cells[dude].classList.add('dude-down')
      if (playerIsSpeedy) {
        cells[dude].classList.remove('dude-down')
        cells[dude].classList.add('dude-down-fast')
        cells[dude].classList.add('animate-dude-down-fast')
      } else {
        cells[dude].classList.add('animate-dude-down')
      }
    }

    function movePlayerLeft() {
      if (dude === 200) {
        removeAllPlayerClasses()
        dude += 19
        cells[dude].classList.add('dude-left')
      } else if (wallCells.includes(dude - 1)) {
        return
      }
      removeAllPlayerClasses()
      dude -= 1
      cells[dude].classList.add('dude-left')
      if (playerIsSpeedy) {
        cells[dude].classList.remove('dude-left')
        cells[dude].classList.add('dude-left-fast')
        cells[dude].classList.add('animate-dude-left-fast')
      } else {
        cells[dude].classList.add('animate-dude-left')
      }
    }



    function removeAllPlayerClasses() {
      cells[dude].classList.remove('dude-right')
      cells[dude].classList.remove('dude-up')
      cells[dude].classList.remove('dude-down')
      cells[dude].classList.remove('dude-left')
      cells[dude].classList.remove('dude-right-fast')
      cells[dude].classList.remove('dude-up-fast')
      cells[dude].classList.remove('dude-down-fast')
      cells[dude].classList.remove('dude-left-fast')
      cells[dude].classList.remove('animate-dude-up')
      cells[dude].classList.remove('animate-dude-down')
      cells[dude].classList.remove('animate-dude-right')
      cells[dude].classList.remove('animate-dude-left')
      cells[dude].classList.remove('animate-dude-up-fast')
      cells[dude].classList.remove('animate-dude-down-fast')
      cells[dude].classList.remove('animate-dude-right-fast')
      cells[dude].classList.remove('animate-dude-left-fast')

    }

    const gameCountdownScreen = document.querySelector('.gameCountdownDiv')
    const countDownTextDisplay = document.querySelector('.countDownTextDisplay')

    function handleGameInterval(interval) {

      playerNameInputScreen.style.display = 'none'
      mainGameScreen.style.display = 'none'
      gameCountdownScreen.style.display = 'flex'

      let i = 6

      const gameStartingInterval = setInterval(() => {
        i--

        if (interval === 'gameOver') {
          countDownTextDisplay.innerHTML = 'GAME OVER. <br><br> YOU SCORED: ' + score
        } else if (interval === 'gameWon') {
          countDownTextDisplay.innerHTML = 'GAME COMPLETE! <br><br>YOU SCORED: ' + score
        } else if (i > 3) {

          if (interval === 'newLevel') {
            countDownTextDisplay.innerHTML = 'LEVEL ' + level + '. GET READY...'
          } else if (interval === 'lifeLost' && lives === 1) {
            countDownTextDisplay.innerHTML = lives + ' LIFE REMAINING. GET READY...'
          } else if (interval === 'lifeLost') {
            countDownTextDisplay.innerHTML = lives + ' LIVES REMAINING. GET READY...'
          }
        } else {
          countDownTextDisplay.innerHTML = i.toString()
        }


        if ((i === 0) && (lives > 0)) {
          gameCountdownScreen.style.display = 'none'
          mainGameScreen.style.display = 'flex'
          startGame(numOfGhostsInGame)
          countDownTextDisplay.innerHTML = ''
          clearInterval(gameStartingInterval)
        } else if (i === 0) {
          goToScoreBoard()
          clearInterval(gameStartingInterval)
        }

      }, 1000)
    }

    //startGame(numOfGhostsInGame)

    function startGame(numberOfGhosts) {


      displayLives(lives)

      createGhost(208)
      createGhost(209)
      createGhost(210)
      createGhost(211)

      setInterval(() => {
        if ((numberOfGhosts - 4) > 0) {
          generateNewGhost()
          numberOfGhosts--

        }
      }, secondsBetweenNewGhostGeneration * 1000)

      intervalId = setInterval(() => {

        if (!((ghosts.some((element) => element.ghostClass === 'eatableBlue'))) && ghostsAreFrozen === false) {
          releaseGhosts()
        }
        if (ghostsAreFrozen === false) {
          moveGhosts()
        }

      }, ghostSpeed * 1000)

      startPlayerInterval(playerSpeed)


      //THIS INTERVAL RUNS VERY QUICKLY AND CONTINUALLY CHECKS TO SEE IF THE GAME IS OVER OR IF THE PLAYER HAS WON

      intervalId3 = setInterval(() => {

        checkForGameOver()
        checkForGameWon()
        removeFoodIncrementScore(dude)
        removeSuperFoodActivateChase(dude)
        removeSuperFoodActivateFreeze(dude)
        removeSuperFoodActivateSpeed(dude)

      }, 10)

    }

  }
}


window.addEventListener('DOMContentLoaded', main)