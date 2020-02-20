
function main() {

  const width = 20
  const gridCellCount = width * width
  const grid = document.querySelector('.grid')
  const cells = []
  let dude = 250

  const wallCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 29, 30, 39, 40, 42, 43, 45, 46, 47, 49, 50, 52, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 79, 80, 99, 100, 102, 103, 105, 107, 108, 109, 110, 111, 112, 114, 116, 117, 119, 120, 125, 129, 130, 134, 139, 140, 141, 142, 143, 145, 146, 147, 149, 150, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 165, 174, 176, 177, 178, 179, 180, 181, 182, 183, 185, 187, 188, 189, 190, 191, 192, 194, 196, 197, 198, 199, 207, 212, 220, 221, 222, 223, 225, 227, 228, 229, 230, 231, 232, 234, 236, 237, 238, 239, 240, 245, 254, 259, 260, 262, 263, 265, 267, 268, 269, 270, 271, 272, 274, 276, 277, 279, 280, 283, 296, 299, 300, 301, 303, 303, 305, 306, 307, 309, 310, 312, 313, 314, 316, 318, 319, 320, 325, 329, 330, 334, 339, 340, 342, 343, 345, 347, 349, 350, 352, 354, 356, 357, 359, 360, 367, 372, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]

  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.innerHTML = i // REMOVE ONCE FINISHED WITH NUMBERS
    if (i === dude) {
      cell.classList.add('dude')
    }
    wallCells.filter((element) => {
      if (element === i) {
        cell.classList.add('wall')
      }
    })
    grid.appendChild(cell)
    cells.push(cell)
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
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
    } else if (event.key === 'ArrowLeft') {
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
    } else if (event.key === 'ArrowDown') {
      if (wallCells.includes(dude + 20)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude += 20
      cells[dude].classList.add('dude')
    } else if (event.key === 'ArrowUp') {
      if (wallCells.includes(dude - 20)) {
        return
      }
      cells[dude].classList.remove('dude')
      dude -= 20
      cells[dude].classList.add('dude')
    }
  })


}


window.addEventListener('DOMContentLoaded', main)