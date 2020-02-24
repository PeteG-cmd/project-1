
function main() {

  //SET UP VARIABLES NEEDED

  const width = 20
  const gridCellCount = width * width
  const grid = document.querySelector('.grid')
  const cells = []
  let score = 0
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
  let playerIsHunter = false
  const eatenGhosts = []
  let ghostEatableTimer
  let ghostReleaseTimer
  const ghostSpeed = 0.5
  const playerSpeed = 0.5
  let lives = 2
  const numOfGhostsInGame = 3
  const secondsBetweenNewGhostGeneration = 8
  const secondsBetweenGhostRelease = 3
  const searchWidth = 8
  const chanceOfGhostMovingSmartly = 75 // this is as a percentage
  const timeGhostsRemainEatable = 10
  const lifeCells = [177, 178, 179]


  const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

  const noFoodCells = [166, 167, 168, 169, 170, 171, 172, 173, 200, 208, 209, 210, 211, 219, 246, 247, 248, 249, 250, 251, 252, 253]

  const superFoodCells = [81, 24, 35, 98, 323, 336]

  //INITIALISE MAP

  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.innerHTML = i // REMOVE ONCE FINISHED WITH NUMBERS
    if (i === dude) {
      cell.classList.add('dude-right')
    }
    if (!(noFoodCells.includes(i)) && (!(wallCells.includes(i)))) {
      cell.classList.add('food')
    }

    if ((!(noFoodCells.includes(i)) && (!(wallCells.includes(i)))) && (superFoodCells.includes(i))) {
      cell.classList.remove('food')
      cell.classList.add('superFood')
    }


    wallCells.filter((element) => {
      if (element === i) {
        cell.classList.add('wall')
      }
    })
    grid.appendChild(cell)
    cells.push(cell)
  }

  // MAKE AND DISPLAY THE SCORE IN WHITE
  cells[161].innerHTML = score
  cells[161].classList.add('white')


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
          cells[this.currentCell].classList.remove(this.ghostClass)
          this.cellJustLeft = this.currentCell
          this.currentCell -= (width - 1)
          cells[this.currentCell].classList.add(this.ghostClass)
        } else if (this.currentCell === 200 && this.directionMoving === 4) {
          cells[this.currentCell].classList.remove(this.ghostClass)
          this.cellJustLeft = this.currentCell
          this.currentCell += (width - 1)
          cells[this.currentCell].classList.add(this.ghostClass)
        } else if (this.currentCell !== 209) {

          if (this.cellOnPath !== '' && this.willFindCellOnPath() === true) { // THIS IF STATEMENT CHECKS IF THE GHOST SHOLD MOVE ON THE PATH OR RANDOMLY IF PATH NOT KNOWN
            // THIS IS NEEDED SO THE GHOST DIRECTION IS STILL SET EVEN IF MOVING ON PATH

            this.directionMoving = this.findDirectionMoving(this.currentCell, this.cellOnPath)

            cells[this.currentCell].classList.remove(this.ghostClass)
            this.cellJustLeft = this.currentCell
            console.log('Ghost Moving to Smartly to Cell on Direct Path:')
            console.log(this.cellOnPath)
            this.currentCell = this.cellOnPath
            this.cellOnPath = ''
            cells[this.currentCell].classList.add(this.ghostClass)
            this.availableDirections = []

          } else {


            // THIS PICKS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT IF NO TARGET PATH AVAILABLE

            const nextCellGhost = Math.floor((Math.random()) * this.availableDirections.length)

            this.directionMoving = this.findDirectionMoving(this.currentCell, this.availableDirections[parseInt(nextCellGhost)])

            cells[this.currentCell].classList.remove(this.ghostClass)
            this.cellJustLeft = this.currentCell
            console.log('Ghost moving from current cell, which is:')
            console.log(this.currentCell)
            this.currentCell = this.availableDirections[parseInt(nextCellGhost)]
            this.cellOnPath = '' // THIS IS NEEDED AS IF BY CHANCE THE GHOST STOPS FOLLOWING THE PATH, I NEED TO ERASE THE PATH FOR THE GHOST TO FIND AGAIN
            cells[this.currentCell].classList.add(this.ghostClass)
            this.availableDirections = []
          }
        }
      }

    }


    findDirectionMoving(currentCell, newCell) {
      if (newCell - currentCell === 1) {
        return 2
      }
      if (newCell - currentCell === -1) {
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
          console.log('Current queue:')
          console.log(queue)
          let pathNotFound = true

          while (pathNotFound) {
            const checkCell = queue.shift()
            // console.log('Current Check Cell Path')
            // console.log(checkCell.path)

            // THESE NEXT 2 IFS HANDLE IF THE TARGET (dude) IS WITHIN A 10 CELL PATH AND HANDLES WEATHER TO SET THE NEXT CELL ON THE GHOST PATH, OR IF TO SET IT TO AN EMPTY STRING

            if (checkCell.path.length > searchWidth - 1) {
              pathNotFound = false
              console.log(checkCell.path)
              console.log('Path not Found - Distance above 10')
              this.cellOnPath = ''
            }

            if (checkCell.cellNumber === target) {
              pathNotFound = false
              console.log(checkCell.path)
              console.log('Path Found and Target set')
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
            cells[element.currentCell].classList.remove(element.ghostClass)
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
    }
  }



  function removeSuperFoodActivateChase(cellNum) {

    if (cells[cellNum].classList.contains('superFood')) {
      if (((ghosts.some((element) => element.ghostClass === 'eatableBlue')))) { //// THERE IS PROBABLY AN EDGE CASE TO DO WITH THE TIMER HERE THAT NEEDS TO BE SORTED. IF ALL GHOST ARE EATEN DO WE NEED TO HANDLE THE TIMER
        clearTimeout(ghostEatableTimer)
      }
      cells[cellNum].classList.remove('superFood')

      clearTimeout(ghostReleaseTimer)
      ghostReleaseCountdownActive = false //// THIS LINE AND THE LINE ABOVE ENSURE GHOSTS ARE NOT RELEASE UNTIL THE 'EATABLE' PERIOD IS OVER (10 SECONDS)
      clearInterval(intervalId2)
      startPlayerInterval(playerSpeed / 1.4)

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

        })

        clearInterval(intervalId2)
        startPlayerInterval(playerSpeed)

      }, timeGhostsRemainEatable * 1000)

    }
    // CHECK IF A GHOST IS EATEN AND REMOVE IT FROM THE ARRAY IF IT IS
    ghosts.map((element) => {

      if (((doesCellContainDude(element.currentCell)) || doesCellContainDude(element.cellJustLeft)) && element.ghostClass === 'eatableBlue') {


        eatenGhosts.push(element.name)
        score += 100
        cells[161].innerHTML = score
        cells[element.currentCell].classList.remove(element.ghostClass)

        const path = calculateGhostReturnPath(element.currentCell) /////////////////////

        element.currentCell = (ghostPenCells.find((element) => !(ghostPenOccupied.includes(element))))
        ghostPenOccupied.push(element.currentCell) // THIS IS MAKING SURE THE NEXT GHOST EATEN DOESNT GO TO THE SAME CELL
        element.ghostClass = element.name
        element.directionMoving = ''
        element.availableDirections = []
        element.cellOnPath = ''
        element.cellJustLeft = element.currentCell
        /////////////
        // cells[element.currentCell].classList.add(element.ghostClass)
        sendEatanGhostOnPath(path, element.currentCell)

        /////////////
        

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

        clearInterval(returningGhostInterval)
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

      // THESE NEXT 2 IFS HANDLE IF THE TARGET (dude) IS WITHIN A 10 CELL PATH AND HANDLES WEATHER TO SET THE NEXT CELL ON THE GHOST PATH, OR IF TO SET IT TO AN EMPTY STRING

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

  function doesCellContainDude(cellToCheck) {
    if ((cells[cellToCheck].classList.contains('dude-right')) || (cells[cellToCheck].classList.contains('dude-up')) || (cells[cellToCheck].classList.contains('dude-down')) || (cells[cellToCheck].classList.contains('dude-left'))) {
      return true
    }
  }

  function checkForGameOver() {
    if (playerIsHunter === false)
      ghosts.map((element) => {
        if (cells[dude].classList.contains(element.name) || doesCellContainDude(element.cellJustLeft)) {

          // cells[element.cellJustLeft].doesCellContainDude(element.cellJustLeft)) {
          clearInterval(intervalId3)
          clearInterval(intervalId2)
          clearInterval(intervalId)
          lives--
          console.log(lives)

          if (livesDoRemain()) {
            resetAfterLifeLost()
          } else {
            displayLives(lives)
            alert(`GAME OVER! You scored ${score}...`)
            // activateInitialStart()

          }
        }
      })
  }

  function resetAfterLifeLost() {
    removeGhostsFromGame()
    movePlayerToStartingLocation()
    displayLives(lives)

    setTimeout(() => {
      startGame(numOfGhostsInGame)
    }, 3000)


  }

  function movePlayerToStartingLocation() {
    removeAllPlayerClasses()
    dude = 250
    cells[250].classList.add('dude-right')
  }


  function removeGhostsFromGame() {
    ghosts.map((element) => cells[element.currentCell].classList.remove(element.ghostClass))

    for (let i = 0; i < numOfGhostsInGame + 1; i++) { //// REMOVE ALL GHOSTS FROM THE GAME 
      ghosts.pop()
    }
  }

  function livesDoRemain() {
    if (lives !== 0) {
      return true
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


  function checkForGameWon() {
    const foodRemaining = cells.some((cell) => {
      return cell.classList.contains('food')
    })
    const superFoodRemaining = cells.some((cell) => {
      return cell.classList.contains('superFood')
    })
    if ((!(foodRemaining)) && (!(superFoodRemaining))) {
      clearInterval(intervalId2)
      clearInterval(intervalId)
      clearInterval(intervalId3)
      alert(`LEVEL COMPLETE! You scored ${score}...`)
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
    if (wallCells.includes(dude - 20)) {
      return
    }
    removeAllPlayerClasses()
    dude -= 20
    cells[dude].classList.add('dude-up')

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
  }

  function movePlayerDown() {
    if (wallCells.includes(dude + 20)) {
      return
    }
    removeAllPlayerClasses()
    dude += 20
    cells[dude].classList.add('dude-down')
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
  }


  function removeAllPlayerClasses() {
    cells[dude].classList.remove('dude-right')
    cells[dude].classList.remove('dude-up')
    cells[dude].classList.remove('dude-down')
    cells[dude].classList.remove('dude-left')
  }




  startGame(numOfGhostsInGame)

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

      // if ((ghosts[0].ghostClass === ghosts[0].name)) { // THIS MAKES SURE WHILE GHOSTS ARE EATABLE THEY CAN NOT BE RELEASED FROM PEN. THIS MAY NEED TO BE CHANGED
      if (!((ghosts.some((element) => element.ghostClass === 'eatableBlue')))) {
        releaseGhosts()
      }
      moveGhosts()

    }, ghostSpeed * 1000)

    startPlayerInterval(playerSpeed)


    //THIS INTERVAL RUNS VERY QUICKLY AND CONTINUALLY CHECKS TO SEE IF THE GAME IS OVER OR IF THE PLAYER HAS WON

    intervalId3 = setInterval(() => {

      checkForGameOver()
      checkForGameWon()
      removeFoodIncrementScore(dude)
      removeSuperFoodActivateChase(dude)

    }, 10)

  }


}


window.addEventListener('DOMContentLoaded', main)