
function main() {

  const width = 20
  const gridCellCount = width * width
  const grid = document.querySelector('.grid')
  const cells = []
  let score = 0
  let dude = 250
  let playerDirection
  let ghost1 = 209
  let ghost2 = 211

  const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

  const noFoodCells = [166, 167, 168, 169, 170, 171, 172, 173, 200, 208, 209, 210, 211, 219, 246, 247, 248, 249, 250, 251, 252, 253]

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
    if (i === ghost1) {
      cell.classList.add('ghost1')
    }
    if (i === ghost2) {
      cell.classList.add('ghost2')
    }
    wallCells.filter((element) => {
      if (element === i) {
        cell.classList.add('wall')
      }
    })
    grid.appendChild(cell)
    cells.push(cell)
  }




  // THIS CODE CONTROLLS THE MOVEMENT OF THE PLAYER AND DOES NOT ALLOW MOVEMENT IN TO WALLS


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


  //LOGIC TO ACTIVATE AND CONTROLL GHOST

  let ghost1Direction // THIS STOPS GHOST 1 REVERSING DIRECTION FOR NO REASON
  let ghost2Direction // THIS STOPS GHOST 2 REVERSING DIRECTION FOR NO REASON

  const intervalId = setInterval(() => {

    //GHOST 1 CONTROLL
    // THIS CODE CALCULATES THE AVALABLE CELLS TO MOVE TO IN TO AN ARRAY AND PICKS A RANDOM NUMBER TO CHOOSE THE DIRECTION FROM AVAILABLE
    const ghost1AvailableDirctions = []

    if ((!(wallCells.includes(ghost1 + 1))) && ghost1Direction !== 4) {
      ghost1AvailableDirctions.push(ghost1 + 1)
    }
    if ((!(wallCells.includes(ghost1 - 1))) && ghost1Direction !== 2) {
      ghost1AvailableDirctions.push(ghost1 - 1)
    }
    if ((!(wallCells.includes(ghost1 + 20))) && ghost1Direction !== 1) {
      ghost1AvailableDirctions.push(ghost1 + 20)
    }
    if ((!(wallCells.includes(ghost1 - 20))) && ghost1Direction !== 3) {
      ghost1AvailableDirctions.push(ghost1 - 20)
    }

    // THE FOLLOWING 2 X IF ELSE HANDLE IF THE GHOST GOES THROUGH THE TRANSPORT TUNNEL
    if (ghost1 === 219 && ghost1Direction === 2) {
      cells[ghost1].classList.remove('ghost1')
      ghost1 = 200
      cells[ghost1].classList.add('ghost1')
    } else if (ghost1 === 200 && ghost1Direction === 4) {
      cells[ghost1].classList.remove('ghost1')
      ghost1 = 219
      cells[ghost1].classList.add('ghost1')
    } else if (ghost1 !== 209) {

      // THIS PICHS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT
      const nextCellGhost = Math.floor((Math.random()) * ghost1AvailableDirctions.length)

      ghost1Direction = directionMoving(ghost1, ghost1AvailableDirctions[parseInt(nextCellGhost)])


      cells[ghost1].classList.remove('ghost1')
      ghost1 = ghost1AvailableDirctions[parseInt(nextCellGhost)]
      cells[ghost1].classList.add('ghost1')
    }


    // GHOST 2 CONTROLL
    const ghost2AvailableDirctions = []

    if ((!(wallCells.includes(ghost2 + 1))) && ghost2Direction !== 4) {
      ghost2AvailableDirctions.push(ghost2 + 1)
    }
    if ((!(wallCells.includes(ghost2 - 1))) && ghost2Direction !== 2) {
      ghost2AvailableDirctions.push(ghost2 - 1)
    }
    if ((!(wallCells.includes(ghost2 + 20))) && ghost2Direction !== 1) {
      ghost2AvailableDirctions.push(ghost2 + 20)
    }
    if ((!(wallCells.includes(ghost2 - 20))) && ghost2Direction !== 3) {
      ghost2AvailableDirctions.push(ghost2 - 20)
    }

    // THE FOLLOWING 2 X IF ELSE HANDLE IF THE GHOSTS GO THROUGH THE TRANSPORT TUNNEL
    if (ghost2 === 219 && ghost2Direction === 2) {
      cells[ghost2].classList.remove('ghost2')
      ghost2 = 200
      cells[ghost2].classList.add('ghost2')
    } else if (ghost2 === 200 && ghost2Direction === 4) {
      cells[ghost2].classList.remove('ghost2')
      ghost2 = 219
      cells[ghost2].classList.add('ghost2')
    } else if (ghost2 !== 211) {

      // THIS PICKS THE DIRECTION A GHOST SHOULD GO AT AN INTERSECTION AND IMPLEMENTS IT
      const nextCellGhost = Math.floor((Math.random()) * ghost2AvailableDirctions.length)

      ghost2Direction = directionMoving(ghost2, ghost2AvailableDirctions[parseInt(nextCellGhost)])

      cells[ghost2].classList.remove('ghost2')
      if (ghost2 === 200 && ghost2Direction === 4) {
        ghost2 = 219
      } else if (ghost2 === 219 && ghost2Direction === 2) {
        ghost2 = 200
      } else {
        ghost2 = ghost2AvailableDirctions[parseInt(nextCellGhost)]
      }
      cells[ghost2].classList.add('ghost2')
    }


    // INITIAL ACTIVATION OF GHOSTS OUT OF STARTING PEN
    if (ghost1 === 209) {
      cells[ghost1].classList.remove('ghost1')
      ghost1 = 169
      cells[ghost1].classList.add('ghost1')
    }

    if (ghost2 === 211) {
      cells[ghost2].classList.remove('ghost2')
      ghost2 = 171
      cells[ghost2].classList.add('ghost2')
    }

    //IN INTERVAL LOGIC CONTROLL FOR PLAYER --- USES THE PLAYED DIRECTION VARIABLE TO MOVRE THE PLAYER ONE SQUARE AT EACH INTERVAL

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





    console.log(intervalId)


  }, 500)


  function removeFoodIncrementScore(cellNum) {
    if (cells[cellNum].classList.contains('food')) {
      cells[cellNum].classList.remove('food')
      score += 10
      console.log(score)
    }
  }


  function directionMoving(currentCell, newCell) {
    if (newCell - currentCell === 1) {
      return 2
    }
    if (newCell - currentCell === -1) {
      return 4
    }
    if (newCell - currentCell === -20) {
      return 1
    }
    if (newCell - currentCell === 20) {
      return 3
    }
  }
}


window.addEventListener('DOMContentLoaded', main)