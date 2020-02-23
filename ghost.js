

var searchGridSize = 20

const searchGrid = []
for (let i = 0; i < searchGrid.length; i++) {
  searchGrid[i] = []
  for (let j = 0; j < searchGrid.length; j++) {
    searchGrid[i][j] = 'empty'
  }
}
//CREATE SEARCH GRID AS ABOVE
//TRANSLATE CURRENT LOCATION, GOAL LOCATION AND WALLS TO ARRAY COORDINATES ARRAY[X][X]
//CREATE A QUEUE ARRAY

//GIVE CURRENT LOCATION TO FUNCTION
//HAVE IT CHECK UP, DOWN, LAEF, RIGHT, ON EACH
// IF THE CELL IS 'VALID' IT SHOULD PUT IT IN THE QUEUE ARRAY

// var newLocation = {
//   cellNumber
//   path: newPath,
//   status: 'Unknown'


//GIVE GHOST ITS CURRENT LOCATION
//CREAT QUEUE ARRAY AND PUSH LOCATION IN TO IT
//GET FIRST CELL FROM QUEUE AND...
//GET AVAILABLE NEXT CELLS, (CHECK IF CALL NUMBER IS AREADY 
//////    IN 'CELL LOCATION PATH') AND IF NOT,CALCULATE NEXT PATH STEP AND ADD TO 'PATH' PROPERTY, AND PUSH TO QUEUE
//GET FIRST AVALABLE CELL FROM QUEUE (WHICH WILL HAVE ITS PATH TO GET THERE STORED)
//
//


class Location {

  constructor(cellNumber, path = []) {
    this.cellNumber = cellNumber
    this.path = path
  }
}


//function for Ghost calculateShortestPath() {



const queue = []
const tatget = dude
queue.push(new Location(this.currentLocation))
let pathNotFound = true

while (pathNotFound) {
  const checkCell = queue.shift()

  if (checkCell.cellNumber === dude) {
    pathNotFound = false
    return checkCell.path
  } else {

    if (!(wallCells.includes(checkCell.cellNumber + 1)) && (!(checkCell.path.includes(checkCell.cellNumber + 1)))) {
      queue.push(new Location(checkCell.cellNumber + 1), checkCell.path.slice())
    }
    if (!(wallCells.includes(checkCell.cellNumber - 1)) && (!(checkCell.path.includes(checkCell.cellNumber - 1)))) {
      queue.push(new Location(checkCell.cellNumber - 1), checkCell.path.slice())
    }
    if (!(wallCells.includes(checkCell.cellNumber + width)) && (!(checkCell.path.includes(checkCell.cellNumber + width)))) {
      queue.push(new Location(checkCell.cellNumber + width), checkCell.path.slice())
    }
    if (!(wallCells.includes(checkCell.cellNumber - width)) && (!(checkCell.path.includes(checkCell.cellNumber - width)))) {
      queue.push(new Location(checkCell.cellNumber - width), checkCell.path.slice())
    }

  }


}








class Ghost {

  constructor(name, currentCell) {
    this.name = name
    this.currentCell = currentCell
    this.directionMoving
    this.availableDirections = []
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

    // THE FOLLOWING 2 X IF ELSE HANDLE IF THE GHOST GOES THROUGH THE TRANSPORT TUNNEL
    if (this.currentCell === 219 && this.directionMoving === 2) {
      cells[this.currentCell].classList.remove(this.name)
      this.cellJustLeft = this.currentCell
      this.currentCell -= (width - 1)
      cells[this.currentCell].classList.add(this.name)
    } else if (this.currentCell === 200 && this.directionMoving === 4) {
      cells[this.currentCell].classList.remove(this.name)
      this.cellJustLeft = this.currentCell
      this.currentCell += (width - 1)
      cells[this.currentCell].classList.add(this.name)
    } else if (this.currentCell !== 209) {

      // THIS PICHS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT
      const nextCellGhost = Math.floor((Math.random()) * this.availableDirections.length)

      this.directionMoving = this.findDirectionMoving(this.currentCell, this.availableDirections[parseInt(nextCellGhost)])


      cells[this.currentCell].classList.remove(this.name)
      this.cellJustLeft = this.currentCell
      console.log(this.currentCell)
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