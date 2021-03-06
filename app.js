
function main() {

  launchGame()

  function launchGame() {

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
    const ghostSpeed = 0.35
    const playerSpeed = 0.35
    let lives = 4
    const numOfGhostsInGame = 4
    const secondsBetweenNewGhostGeneration = 8
    let secondsBetweenGhostRelease = 2.5
    let searchWidth = 7
    let chanceOfGhostMovingSmartly = 70 // this is as a percentage
    const timeGhostsRemainEatable = 8
    const timeGhostsRemainFrozen = 6
    const timePlayerIsSpeedy = 4
    let playerMissiles = 0
    let missileInterval
    let missileDirection
    let missile
    let missileIsActive = false
    const directionsCount = [width, -width, 1, -1]

    const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

    const noFoodCells = [160, 161, 162, 166, 167, 168, 169, 170, 171, 172, 173, 200, 208, 209, 210, 211, 219, 246, 247, 248, 249, 250, 251, 252, 253]

    const penGateCells = [188, 189, 190, 191]

    const lifeCells = [161, 162, 177, 178, 179]

    const superFoodEatableCells = [24, 215]
    const superFoodFreezeCells = [126, 336]
    const superFoodSpeedCells = [35, 204]
    const superFoodMissileCells = [133, 323]

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

      playSound('beginning')
      playerName = document.querySelector('#playerName').value

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
      handleGameInterval('newLevel')

    })

    //HANDLE SOUNDS

    const audio = document.querySelector('#sound')

    function playSound(sound) {
      audio.pause()
      audio.currentTime = 0
      audio.src = 'sounds/pacman_' + sound + '.wav'
      audio.play()
    }

    //INITIALISE SCORE BOARDS X 2 (May reduce to one)

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
        rankPosition.classList.add('white2')
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
        localStorage.setItem('playerScores', JSON.stringify(scores))
      }
    }

    function getLocalScores() {
      if (localStorage) {
        const playerScores = JSON.parse(localStorage.getItem('playerScores'))
        if (playerScores) {
          scores = playerScores
        }
      }
      if (scores.length === 0) {
        scores.push({ name: 'Blinky', score: '7500', currentPlayer: false })
        scores.push({ name: 'Pinky', score: '4000', currentPlayer: false })
        scores.push({ name: 'Inky', score: '2000', currentPlayer: false })
        scores.push({ name: 'Clyde', score: '1000', currentPlayer: false })
      }
    }

    //INITIALISE INFO BOARD

    const infos = []
    const infoBoard = document.querySelector('.infoDiv')
    const superFoods = ['bolt from the blue', 'wonder green', 'berry.. set... GO!', 'citrus shield']
    const superFoodColor = ['rgb(47, 188, 204)', 'rgb(39, 184, 130)', 'rgb(219, 83, 59)', 'yellow']
    const superFoodPower = ['EAT', 'FREEZE', 'SPEED', 'SHOOT']
    const superFoodGraphics = ['images/bolt-from-the-blue-1.png', 'images/wonder-green.png', 'images/berry-set-go.png', 'images/citrus-shield.png']

    createLevelDisplay()

    for (let i = 0; i < superFoods.length; i++) {
      const infoPanel = document.createElement('div')
      infoPanel.classList.add('infoPanel')
      infoPanel.id = 'infoPanel' + i
      const superFoodGraphic = document.createElement('img')
      const superFoodDescription = document.createElement('p')
      superFoodDescription.id = 'timeDisplay' + i
      const superFoodPowerDescription = document.createElement('p')

      superFoodGraphic.src = superFoodGraphics[i]
      superFoodDescription.innerHTML = superFoods[i]
      superFoodPowerDescription.innerHTML = superFoodPower[i]
      superFoodDescription.style.color = superFoodColor[i]

      infoPanel.appendChild(superFoodGraphic)
      infoPanel.appendChild(superFoodDescription)
      infoPanel.appendChild(superFoodPowerDescription)

      infoBoard.appendChild(infoPanel)
      infos.push(infoBoard)
    }

    //INITIALISE MAP

    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')

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

      if (isASuperFoodMissileCell(i)) {
        cell.classList.remove('food')
        cell.classList.add('superFoodMissile')
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
    const livesp = document.createElement('p')
    livesp.innerHTML = 'Lives'
    livesp.classList.add('white')
    cells[160].appendChild(livesp)
    cells[160].classList.add('flexCell')

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

    function isASuperFoodMissileCell(cell) {
      if ((!(noFoodCells.includes(cell)) && (!(wallCells.includes(cell)))) && (superFoodMissileCells.includes(cell))) {
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
        this.cellJustLeft = currentCell

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
              this.removeAllGhostClasses()
              this.cellJustLeft = this.currentCell
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
            let pathNotFound = true

            while (pathNotFound) {
              const checkCell = queue.shift()

              // THESE NEXT 2 IFS HANDLE IF THE TARGET (dude) IS WITHIN A 10 CELL PATH AND HANDLES WEATHER TO SET THE NEXT CELL ON THE GHOST PATH, OR IF TO SET IT TO AN EMPTY STRING

              if (checkCell.path.length > searchWidth - 1) {
                pathNotFound = false
                this.cellOnPath = ''
              }

              if (checkCell.cellNumber === target) {
                pathNotFound = false
                this.cellOnPath = checkCell.path[1]
              }

              // THIS CODE HANDLES FINDING EVERY POSSIBLE PATH OF LENGTH 1 ,2, 3 etc, UNTIL IT FINDS THE TARGET
              directionsCount.map((directionCount) => {

                if (!(wallCells.includes(checkCell.cellNumber + directionCount)) && (!(checkCell.path.includes(checkCell.cellNumber + directionCount))) && (!(checkCell.path.includes(this.cellJustLeft)))) {
                  checkCell.path.push(checkCell.cellNumber + directionCount)
                  const newPath = checkCell.path.slice()
                  queue.push(new Location(checkCell.cellNumber + directionCount, newPath))
                  checkCell.path.pop()
                }
              })
            }
          }
        }
      }
    }

    // THIS CODE LOGS THE DIRECTION THE PLAYER IS WANTING PAC MAN TO MOVE DURING THE NEXT INTERVAL


    document.addEventListener('keydown', (event) => {

      //SETS THE PLAYER DIRECTION TO BE USED AT EACH INTERVAL AND CHECKS IT IS CURRENTLY VALID BEFORE CHANGING

      if (event.key === 'ArrowRight' && rightPlayerMoveIsValid()) {
        playerDirection = 2
      } else if (event.key === 'ArrowLeft' && leftPlayerMoveIsValid()) {
        playerDirection = 4
      } else if (event.key === 'ArrowDown' && downPlayerMoveIsValid()) {
        playerDirection = 3
      } else if (event.key === 'ArrowUp' && upPlayerMoveIsValid()) {
        playerDirection = 1
      }
    })

    //FUNCTION TO CREATE A NEW GHOST, GIVING IT THE CELL TO START IN IN THE 'GHOST HOLDING PEN'

    function createGhost(startingCell) {

      ghosts.push(new Ghost(`ghost${ghosts.length + 1}`, startingCell))
      cells[startingCell].classList.add(ghosts[ghosts.length - 1].name)
      ghostPenOccupied.push(startingCell)
      
    }

    function flashPenGateGreen(gateNumber) {
      cells[gateNumber].classList.remove('cellGate')
      cells[gateNumber].classList.add('cellGateOpen')
      setTimeout(() => {
        cells[gateNumber].classList.remove('cellGateOpen')
        cells[gateNumber].classList.add('cellGate')
      }, 700)
    }

    function startGhostReleaseTimer() {
      ghostReleaseTimer = setTimeout(() => {
        if (ghostPenOccupied.length > 0) {
          ghosts.map((element) => {
            if (element.currentCell === ghostPenOccupied[0]) {
              cells[element.currentCell].classList.remove(element.removeAllGhostClasses())
              cells[element.currentCell].classList.remove('eatableBlue')
              flashPenGateGreen(element.currentCell - width)
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
        // if (score % 20 === 0) {
        playSound('eatfruit')
        // }
        updateCurrentScorePanel()
      }
    }

    function ghostPenCellsFull() {
      return ghostPenOccupied.length >= 4
    }

    function removeSuperFoodArmMissile(cellNum) {
      if (cells[cellNum].classList.contains('superFoodMissile')) {

        cells[cellNum].classList.remove('superFoodMissile')
        playerMissiles += 2
        playSound('chomp')
        handleDomDisplayMissileCount()
      }
    }

    function checkMissileCanFireOrContinue() {
      return (!(wallCells.includes(missile + missileDirection)))
    }

    function checkMissileHasHitGhost() {
      ghosts.map((element) => {
        if (element.currentCell === missile || element.cellJustLeft === missile) {
          eatenGhosts.push(element.name)
          score += 150
          cells[element.currentCell].classList.remove(element.removeAllGhostClasses())
          const path = calculateGhostReturnPath(element.currentCell, 249)
          missileBoom(missile)
          removeAllMissileClasses()
          missileIsActive = false

          clearInterval(missileInterval)

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

    function addMissileClassNeeded() {
      if (missileDirection === -width) {
        cells[missile].classList.add('missile-up')
        cells[missile].classList.add('animate-missile-up')
      }
      if (missileDirection === 1) {
        cells[missile].classList.add('missile-right')
        cells[missile].classList.add('animate-missile-right')
      }
      if (missileDirection === width) {
        cells[missile].classList.add('missile-down')
        cells[missile].classList.add('animate-missile-down')
      }
      if (missileDirection === -1) {
        cells[missile].classList.add('missile-left')
        cells[missile].classList.add('animate-missile-left')
      }
    }

    function removeAllMissileClasses() {
      cells[missile].classList.remove('missile-up')
      cells[missile].classList.remove('animate-missile-up')
      cells[missile].classList.remove('missile-right')
      cells[missile].classList.remove('animate-missile-right')
      cells[missile].classList.remove('missile-down')
      cells[missile].classList.remove('animate-missile-down')
      cells[missile].classList.remove('missile-left')
      cells[missile].classList.remove('animate-missile-left')
    }

    function missileBoom(cellNum) {
      cells[cellNum].classList.add('boom')
      setTimeout(() => {
        cells[cellNum].classList.remove('boom')
      }, 150)

    }

    fireMissile()
    function fireMissile() {
      document.addEventListener(('keydown'), (event) => {
        if (playerMissiles > 0) {
          if (missileIsActive === false) {
            console.log(event)
            if (event.key === ' ') {

              if (playerDirection === 1) {
                missileDirection = -width
              } else if (playerDirection === 2) {
                missileDirection = 1
              } else if (playerDirection === 3) {
                missileDirection = width
              } else if (playerDirection === 4) {
                missileDirection = -1
              }

              missile = dude

              if (checkMissileCanFireOrContinue()) {
                missileIsActive = true
                checkMissileHasHitGhost()
                playerMissiles -= 1
                handleDomDisplayMissileCount()
                missile += missileDirection
                if (missileIsActive === true) {
                  addMissileClassNeeded()
                }

                missileInterval = setInterval(() => {
                  if (checkMissileCanFireOrContinue()) {
                    removeAllMissileClasses()
                    checkMissileHasHitGhost()
                    if (missileIsActive === true) {
                      missile += missileDirection
                      addMissileClassNeeded()
                    }
                  } else {
                    removeAllMissileClasses()
                    missileBoom(missile)
                    clearInterval(missileInterval)
                    missileIsActive = false
                  }
                }, 100)
              }
            }
          }
        }
      })
    }

    function removeSuperFoodActivateChase(cellNum) {

      if (cells[cellNum].classList.contains('superFoodEatable')) {
        cells[cellNum].classList.remove('superFoodEatable')
        playSound('chomp')
        checkIfEatablePeriodAlreadyActive()
        clearTimeout(ghostReleaseTimer)
        ghostReleaseCountdownActive = true //// THIS LINE AND THE LINE ABOVE ENSURE GHOSTS ARE NOT RELEASE UNTIL THE 'EATABLE' PERIOD IS OVER (10 SECONDS)
        score += 50
        playerIsHunter = true
        handleDomDisplayGhostEatabletimer()
        setGhostsToEatable()
        startGhostEatableTimeOut()
      }
      returnGhostToPenIfEaten()
    }

    function checkIfEatablePeriodAlreadyActive() {
      if (((ghosts.some((element) => element.ghostClass === 'eatableBlue')))) { //// THERE IS PROBABLY AN EDGE CASE TO DO WITH THE TIMER HERE THAT NEEDS TO BE SORTED. IF ALL GHOST ARE EATEN DO WE NEED TO HANDLE THE TIMER
        clearTimeout(ghostEatableTimer)
      }
    }

    function setGhostsToEatable() {
      ghosts.map((element) => {
        if (!(ghostPenOccupied.includes(element.currentCell))) {
          cells[element.currentCell].classList.remove(element.name)
          cells[element.currentCell].classList.add('eatableBlue')
          element.ghostClass = 'eatableBlue'
        }
      })
    }

    function startGhostEatableTimeOut() {
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

    function returnGhostToPenIfEaten() { // CHECK IF A GHOST IS EATEN AND REMOVE IT FROM THE ARRAY IF IT IS
      ghosts.map((element) => {

        if ((doesCellContainDude(element.currentCell)) || doesCellContainDude(element.cellJustLeft) && element.ghostClass === 'eatableBlue') {

          eatenGhosts.push(element.name)
          score += 100
          playSound('eatghost')
          // scorep.innerHTML = score
          cells[element.currentCell].classList.remove(element.removeAllGhostClasses())

          const path = calculateGhostReturnPath(element.currentCell, 249)

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

    function calculateGhostReturnPath(currentGhostCell, targetCell) {

      let pathBackToPen
      const queue = []
      const target = targetCell

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


    function removeSuperFoodActivateFreeze(cellNum) {
      if (cells[cellNum].classList.contains('superFoodFreeze')) {
        if (((ghosts.some((element) => element.ghostClass === 'freezeBlue')))) { //// THERE IS PROBABLY AN EDGE CASE TO DO WITH THE TIMER HERE THAT NEEDS TO BE SORTED. IF ALL GHOST ARE EATEN DO WE NEED TO HANDLE THE TIMER
          clearTimeout(ghostFreezeTimer)
        }

        cells[cellNum].classList.remove('superFoodFreeze')
        playSound('chomp')

        clearTimeout(ghostReleaseTimer)
        ghostReleaseCountdownActive = true

        if (ghostPenCellsFull() && playerIsHunter === false) {
          ghostReleaseCountdownActive = false
        }

        score += 50
        ghostsAreFrozen = true
        handleDomDisplayGhostFreezeTimer()

        ghosts.map((element) => {
          if (!(ghostPenOccupied.includes(element.currentCell))) {
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

    function clearTimeOutandDomDisplayIfAllGhostsEaten() {
      if (ghostPenCellsFull() && (playerIsHunter === true || ghostsAreFrozen === true)) {
        playerIsHunter = false
        ghostsAreFrozen = false
        clearTimeout(ghostEatableTimer)
        clearTimeout(ghostFreezeTimer)
        handleDomDisplayGhostFreezeTimer()
        handleDomDisplayGhostEatabletimer()
        ghostReleaseCountdownActive = false
      }
    }

    function handleDomDisplayGhostFreezeTimer() {

      const display = document.querySelector('#timeDisplay1')
      const superFoodDescription = 'wonder green'
      clearInterval(ghostFreezeDisplayInterval)
      let i = timeGhostsRemainFrozen

      if (ghostsAreFrozen === false) {
        clearInterval(ghostFreezeDisplayInterval)
        display.innerHTML = superFoodDescription
        display.style.fontSize = '80%'

      } else {

        ghostFreezeDisplayInterval = setInterval(() => {
          display.innerHTML = i.toFixed(2)
          display.style.fontSize = '130%'
          i -= 0.1
          if (i <= 0) {
            clearInterval(ghostFreezeDisplayInterval)
            display.innerHTML = superFoodDescription
            display.style.fontSize = '80%'
          }
        }, 100)
      }
    }

    function handleDomDisplayPlayerSpeedTimer() {
      const display = document.querySelector('#timeDisplay2')
      clearInterval(playerSpeedDisplayInterval)
      let i = timePlayerIsSpeedy
      const superFoodDescription = 'berry.. set... GO'

      playerSpeedDisplayInterval = setInterval(() => {
        display.innerHTML = i.toFixed(2)
        display.style.fontSize = '130%'
        i -= 0.1
        if (i <= 0) {
          clearInterval(playerSpeedDisplayInterval)
          display.innerHTML = superFoodDescription
          display.style.fontSize = '80%'
        }
      }, 100)
    }

    function handleDomDisplayGhostEatabletimer() {
      const display = document.querySelector('#timeDisplay0')
      clearInterval(ghostEatableDisplayInterval)
      let i = timeGhostsRemainEatable
      const superFoodDescription = 'bolt from the blue'

      if (playerIsHunter === false) {
        clearInterval(ghostEatableDisplayInterval)
        display.innerHTML = superFoodDescription
        display.style.fontSize = '80%'

      } else {

        ghostEatableDisplayInterval = setInterval(() => {
          display.innerHTML = i.toFixed(2)
          display.style.fontSize = '130%'
          i -= 0.1
          if (i <= 0) {
            clearInterval(ghostEatableDisplayInterval)
            display.innerHTML = superFoodDescription
            display.style.fontSize = '80%'
          }
        }, 100)
      }
    }

    function handleCellGateColor() {
      penGateCells.map((element) => {
        if ((playerIsHunter === false && ghostsAreFrozen === false) || ghostPenCellsFull()) {
          if (cells[element].classList.contains('cellGateLocked')) {
            cells[element].classList.remove('cellGateLocked')
            cells[element].classList.add('cellGate')
          }
        } else {
          if (cells[element].classList.contains('cellGate')) {
            cells[element].classList.remove('cellGate')
            cells[element].classList.add('cellGateLocked')
          }
        }
      })
    }

    function handleDomDisplayMissileCount() {
      const display1 = document.querySelector('#timeDisplay3')
      display1.innerHTML = playerMissiles + ' x Missile'
    }

    function removeSuperFoodActivateSpeed(cellNum) {
      if (cells[cellNum].classList.contains('superFoodSpeed')) {

        handleDomDisplayPlayerSpeedTimer()
        cells[cellNum].classList.remove('superFoodSpeed')
        playSound('chomp')

        clearInterval(intervalId2)
        startPlayerInterval(playerSpeed / 1.5)
        playerIsSpeedy = true

        score += 50

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
      if (playerIsHunter === false) {
        ghosts.map((element) => {
          if (cells[dude].classList.contains(element.name) || (doesCellContainDude(element.cellJustLeft))) {

            playSound('death')
            removeGhostsFromGame()
            removeAllPlayerClasses()

            clearSuperFoodTimeOuts()
            clearInterval(intervalId3)
            clearInterval(intervalId2)
            clearInterval(intervalId)
            clearInterval(returningGhostInterval)
            cells[dude].classList.add('apple')

            setTimeout(() => {

              lives--
              cells[dude].classList.remove('apple')
              ghostReleaseCountdownActive = false
              // ghostPenCellsUnLocked()

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
    }

    //THIS IS NEEDED ON ONE LINE SO IT RETURNS THE RESULT, AND NOT UNDEFINED
    function superFoodRemainingInGame() {
      return cells.some((cell) => ((cell.classList.contains('superFoodEatable')) || (cell.classList.contains('superFoodFreeze')) || (cell.classList.contains('superFoodSpeed'))))
    }

    function checkForGameWon() {
      const foodRemaining = cells.some((cell) => {
        return cell.classList.contains('food')
      })

      if ((!(foodRemaining)) && (!(superFoodRemainingInGame()))) {
        ghostReleaseCountdownActive = false
        clearSuperFoodTimeOuts()
        clearInterval(intervalId2)
        clearInterval(intervalId)
        clearInterval(intervalId3)
        clearInterval(returningGhostInterval)
        beginNextLevel()
      }
    }

    function resetAfterLifeLost() {
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

    function removeRandomSuperFood(numToRemove) {

      for (let i = 0; i < numToRemove; i++) {
        const randomNumber = Math.floor(Math.random() * 4)
        if (randomNumber === 0) {
          superFoodEatableCells.pop()
        } else if (randomNumber === 1) {
          superFoodFreezeCells.pop()
        } else if (randomNumber === 2) {
          superFoodFreezeCells.pop()
        } else {
          superFoodMissileCells.pop()
        }
      }
    }

    function createLevelDisplay() {
      const infoBoard = document.querySelector('.infoDiv')
      const infoPanel = document.createElement('div')
      infoPanel.classList.add('infoPanelLevel')
      infoPanel.id = 'levelDisplay'
      const levelDisplay = document.createElement('h2')
      levelDisplay.id = 'levelDisplayText'
      levelDisplay.innerHTML = 'LEVEL ' + level
      infoPanel.appendChild(levelDisplay)
      infoBoard.appendChild(infoPanel)
    }

    function updateLevelDisplay() {
      const levelDisplay = document.querySelector('#levelDisplayText')
      levelDisplay.innerHTML = 'LEVEL ' + level
    }

    function beginNextLevel() {
      if (level === 1 || level === 2 || level === 3 || level === 4) {
        level++
        secondsBetweenGhostRelease -= 0.5
        chanceOfGhostMovingSmartly += 4
        searchWidth += 1
        playerMissiles = 0
        handleDomDisplayMissileCount()
        removeRandomSuperFood(1)
        removeGhostsFromGame()
        movePlayerToStartingLocation()
        displayLives(lives)
        resetGameBoard()
        updateLevelDisplay()
        playerDirection = ''
        handleGameInterval('newLevel')

      } else {
        handleGameInterval('gameWon')
      }
    }

    function goToScoreBoard() {
      localStoreScores()
      updateCurrentScorePanel()
      location.reload() /// THIS RELOADS THE PAGE AND RESETS ALL FOR NEXT GAME
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

        if (isASuperFoodMissileCell(i)) {
          cells[i].classList.remove('food')
          cells[i].classList.add('superFoodMissile')
        }

        cells[i].classList.remove('eatableBlue')
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

    function upPlayerMoveIsValid() {
      return (!(wallCells.includes(dude - width)))
    }
    function rightPlayerMoveIsValid() {
      return (!(wallCells.includes(dude + 1)))
    }
    function downPlayerMoveIsValid() {
      return (!(wallCells.includes(dude + width)))
    }
    function leftPlayerMoveIsValid() {
      return (!(wallCells.includes(dude - 1)))
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

        if (score > 0 && i === 5) {
          playSound('intermission')
        }
        if (interval === 'gameOver') {
          countDownTextDisplay.innerHTML = 'GAME OVER. <br><br> YOU SCORED: ' + score
        } else if (interval === 'gameWon') {
          countDownTextDisplay.innerHTML = 'GAME COMPLETE! <br><br>YOU SCORED: ' + score
        } else if (i > 3) {

          if (interval === 'newLevel') {
            countDownTextDisplay.innerHTML = 'LEVEL ' + level + '. GET READY...'
            // countDownTextDisplay.innerHTML += '<br><br><br> 1 x SUPERFOOD REMOVED'
            // countDownTextDisplay.innerHTML += '<br><br> GHOST INTELIGENCE INCREASED'
            if (level === 3 && i === 5) {
              lives++
            }
            if (level === 3 && i > 3) {
              countDownTextDisplay.innerHTML += '<br><br><br> EXTRA LIFE AWARDED'
            }
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
        removeSuperFoodArmMissile(dude)
        handleCellGateColor()
        clearTimeOutandDomDisplayIfAllGhostsEaten()

      }, 10)
    }
  }
}

window.addEventListener('DOMContentLoaded', main)