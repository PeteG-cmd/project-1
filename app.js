
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
  const ghostPenOccupied = []
  let ghostReleaseCountdownActive = false

  const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

  const noFoodCells = [166, 167, 168, 169, 170, 171, 172, 173, 200, 208, 209, 210, 211, 219, 246, 247, 248, 249, 250, 251, 252, 253]

  //INITIALISE MAP

  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.innerHTML = i // REMOVE ONCE FINISHED WITH NUMBERS
    if (i === dude) {
      cell.classList.add('dude')
    }
    if (!(noFoodCells.includes(i)) && (!(wallCells.includes(i)))) {
      cell.classList.add('food')
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


  class Ghost {

    constructor(name, currentCell) {
      this.name = name
      this.currentCell = currentCell
      this.directionMoving
      this.availableDirections = []

    }
    setAvailableDirections() {

      if ((!(wallCells.includes(this.currentCell + 1))) && this.directionMoving !== 4) {
        this.availableDirections.push(this.currentCell + 1)
      }
      if ((!(wallCells.includes(this.currentCell - 1))) && this.directionMoving !== 2) {
        this.availableDirections.push(this.currentCell - 1)
      }
      if ((!(wallCells.includes(this.currentCell + 20))) && this.directionMoving !== 1) {
        this.availableDirections.push(this.currentCell + 20)
      }
      if ((!(wallCells.includes(this.currentCell - 20))) && this.directionMoving !== 3) {
        this.availableDirections.push(this.currentCell - 20)
      }
      return
    }

    moveGhost() {

      // THE FOLLOWING 2 X IF ELSE HANDLE IF THE GHOST GOES THROUGH THE TRANSPORT TUNNEL
      if (this.currentCell === 219 && this.directionMoving === 2) {
        cells[this.currentCell].classList.remove(this.name)
        this.currentCell -= (width - 1)
        cells[this.currentCell].classList.add(this.name)
      } else if (this.currentCell === 200 && this.directionMoving === 4) {
        cells[this.currentCell].classList.remove(this.name)
        this.currentCell += (width - 1)
        cells[this.currentCell].classList.add(this.name)
      } else if (this.currentCell !== 209) {

        // THIS PICHS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT
        const nextCellGhost = Math.floor((Math.random()) * this.availableDirections.length)

        this.directionMoving = this.findDirectionMoving(this.currentCell, this.availableDirections[parseInt(nextCellGhost)])


        cells[this.currentCell].classList.remove(this.name)
        this.currentCell = this.availableDirections[parseInt(nextCellGhost)]
        cells[this.currentCell].classList.add(this.name)

        this.availableDirections = []
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

  createGhost(208)
  createGhost(209)
  createGhost(210)
  createGhost(211)

  function startGhostRelease() {
    setTimeout(() => {
      if (ghostPenOccupied.length > 0) {
        ghosts.map((element) => {
          if (element.currentCell === ghostPenOccupied[0]) {
            cells[element.currentCell].classList.remove(element.name)
            element.currentCell -= 40
            cells[element.currentCell].classList.add(element.name)

          }
        })
      }
      ghostPenOccupied.shift()
      ghostReleaseCountdownActive = false
    }, 3000)
  }



  const intervalId = setInterval(() => {

    if (ghostReleaseCountdownActive === false) {
      ghostReleaseCountdownActive = true
      startGhostRelease()
    }

    ghosts.map((element) => {

      if (!(ghostPenOccupied.includes(element.currentCell))) {
        element.setAvailableDirections()
        element.moveGhost()
      }
    })

  }, 500)

  const intervalId2 = setInterval(() => {

    //INTERVAL 2 - LOGIC CONTROLL FOR PLAYER --- USES THE PLAYED DIRECTION VARIABLE TO MOVRE THE PLAYER ONE SQUARE AT EACH INTERVAL

    if (playerDirection === 2) {
      if (dude === 219) {
        cells[dude].classList.remove('dude')
        dude -= 19
        cells[dude].classList.add('dude')

      } else if (wallCells.includes(dude + 1)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude += 1
      cells[dude].classList.add('dude')
      removeFoodIncrementScore(dude)

    } else if (playerDirection === 4) {
      if (dude === 200) {
        cells[dude].classList.remove('dude')
        dude += 19
        cells[dude].classList.add('dude')
      } else if (wallCells.includes(dude - 1)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude -= 1
      cells[dude].classList.add('dude')
      removeFoodIncrementScore(dude)

    } else if (playerDirection === 3) {
      if (wallCells.includes(dude + 20)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude += 20
      cells[dude].classList.add('dude')
      removeFoodIncrementScore(dude)

    } else if (playerDirection === 1) {
      if (wallCells.includes(dude - 20)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude -= 20
      cells[dude].classList.add('dude')
      removeFoodIncrementScore(dude)

    }

  }, 500)



  function removeFoodIncrementScore(cellNum) {
    if (cells[cellNum].classList.contains('food')) {
      cells[cellNum].classList.remove('food')
      score += 10
      cells[161].innerHTML = score
    }
  }

  //THIS INTERVAL RUNS VERY QUICKLY AND CONTINUALLY CHECKS TO SEE IF THE GAME IS OVER OR IF THE PLAYER HAS WON

  const intervalId3 = setInterval(() => {
    ghosts.map((element) => {
      if (cells[dude].classList.contains(element.name)) {
        clearInterval(intervalId2)
        clearInterval(intervalId)
        clearInterval(intervalId3)
        alert(`GAME OVER! You scored ${score}...`)
      }
    })


    const foodRemaining = cells.some((cell) => {
      return cell.classList.contains('food')
    })

    if (!(foodRemaining)) {

      clearInterval(intervalId2)
      clearInterval(intervalId)
      clearInterval(intervalId3)
      alert(`LEVEL COMPLETE! You scored ${score}...`)
    }

  }, 10)



}


window.addEventListener('DOMContentLoaded', main)