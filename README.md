# PAC-DUDE


## Overview

PAC-DUDE is my first ever front-end development project, produced as part of General Assembly's Immersive Software Engineering Bootcamp.

My task was to create a grid-based game rendered in the browser that utilised 'vanilla' JavaScript, HTML and CSS.

Given a selection of classic arcade games to choose from, I opted to build my take on PAC-MAN. The theme was inspired by last project for my current employer, which was to produce the new 'innocent +' range of drinks.

The project was mainly to consolidate my beginners' knowledge of JavaScript and interacting with the DOM, but I worked hard to make the game workable and to achieve the correct level of difficulty to make it challenging, but not impossible for the player to complete all 5 levels.

You can play the game [here](https://peteg-cmd.github.io/project-1/)

## The Brief

Render a game in the browser
Design logic for winning & visually display which player won
Include separate HTML / CSS / JavaScript files
Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
Use Javascript for DOM manipulation
Deploy your game online, where the rest of the world can access it
Use semantic markup for HTML and CSS (adhere to best practices)

##The Technologies used

HTML5
CSS3
JavaScript (ES6)
Git and GitHub
Google Fonts
Adobe Illustrator


##The Approach

The Grid

The game is built using a grid. A 20 x 20 square is created using JavaScript. HTML divs are created using a for loop and appended as children of the grid. The differant classes of cells are added and all cells pushed to an array.



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

During gameplay the grid is not visible, but is highlighted for demonstration porposes:







Decription - Basic themed version of classic PAC-MAN game.

A simple game written in JavaScript which should be able to run in all modern
browsers. The aim behind this project was to increase and deepen my knowledge of JS and its ability to make grid based games which run onl;y on the client side. The theme was taken from my current employers and uses the new 'innocent +' range of drinks as the food and super food.


GAMEPLAY

The game is simple and follows the same basic principles of the original PACMAN game, with a few additional functions. In addition to the classic super food that allows the player to chase and eat the ghosts, there are two additional super foods. The first freezes the ghosts in their current locations for a set period of time, and the second increases the speed the playes can move at to 1.5X for a set period. 

During the first 2 super food periods (Freeze and Hunt), ghosts which are in their starting pen will not be released until the period is over. 


LEVELS AND DIFFICULTY

Once the player has eaten all the food and superfood the level ends and a message to the player is displayed showing the level and the score. There are 5 levels in total. Each level uses the same map, however as levels increase there are 2 changes made to increase difficulty. The first is that the amount of super food is reduced. The second is that the inteligence of the ghosts is gradually incresed. In each subsequent level the ghosts expand their search area by 2 (the amount of cells from themselves they check to locate the player), and once they have found and are tracking the player, with each level their ability to continue tracking the player increases. This starts with them making the correct choices 76% of the time, and increase by 4% with each level completed - meaning in level 5 the ghosts have a 96% chance of tracking the player correctly.


SCORING

The player earns 10 points for each bit of food eaten, 50 points for eating a superfood, and 100 points for eating a ghost.

The scores are kept track of live and the leader board shown and updated on the left side of the screen during gameplay. The scores are persisted using local storage if available.


CHALLENGES

During this project their were 2 main challenges to get the game running as designed.

1: The first was to give the ghosts the correct level of inteligence to make the game challenging, whilst also balancing this with the perfomance ability of most modern laptops. At first the search width of the ghosts was unrestricted, however the calculation time needed was increasing the interval which controlled the ghost as so many calculations were needed. The trade off here was limit the search width of the ghost to below approx 15 cells, and if they could not find the player within this width they will move randomly (but will never reverse direction). In the end i was happy with this decision and actually think that it leads to a better game play experience as the ghost do not continually home in on the player, but tracking must be triggered by distance.

2: The implementation of multiple 'Super Food Periods' that can overlap was a challenge to get running correctly. 






Pac - man (Pac - Dude)

Be a 20 x 20 grid?
Should walls be full squarwes, or borders of squares
Speed initially set at one speed
3 x levels, with increasing difficulty
Scores updeated live as player plays


  PACMAN
    - Always starts in the same location
    - Continues to move in the same direction as the last one specified by the player, until a wall is hit, or the player change it
    - Killed & game over if caught by a ghost
    - Able to eat ghost for XXX seconds if eaten a superfood
    - Has 5 lives
    - Can have classes HUNTER & HUNTED (should change color between the 2)

  GHOSTS
    - Start in a holding Pen and are relesed one after another
    - Move generally towards player
    - Move generally away from player if a SUPERFOOD has been eaten
    - If gets eaten, returns to pen for X seconds and is re-released
    - Can have classes HUNTER AND HUNTED (Should change color between the 2)

  MAP
    - Generated on startup with walls pre set
    - Ideally 20 x 20 so the speed of the game can be quite fast
    - Each grid will be able to have several classes:
        - Wall
        - Map
        - Food
        - Superfood
        - Ghost
        - Player
        - **Explosion (or something)* if the ghost catches the player
    - In the later levels the superfoods could be randomly positioned?

  GAMEPLAY
    - Game has a 3 second countdown to start after button is pressed
    - Game starts with player and First Ghost at same time
    - Score is updated each interval and displayed on thew page
    - If player completes it some sort of Alert/animation should show
    - 2 or 3 levels of increasing difficult


DRAW OUT WHAT THE MAP WILL LOOK LIKE ON A PIECE OF PAPER AND CALCULATE GRID SIZE



Create Map
      - Physically draw out map so I know what its going to look like
            - This should include index ID's of cells which are 'map' and 'wall'
            - Create and array containg the numbers of the 'walls'
      - create outer border in HTML (Or JS)
      - Create limited style of divs and border in CSS to get the basic map started, and set required flex properties
      - create JS to create required Divs (Create elements and append children)
      - add cells to an array as they are created
      - Map should include 'crossover' to allow pacman to move to the other side
            - Pacman should appear on the same row when travelling through it (Implement in movement rules stage)

      - Create an array so I can tell the created blocks (Probably as they are created if they are 'map' or 'wall')
      - This array could also be utilised in the movement logic

      HAVE CREATED MAP THAT LOOKS AS IT SHOULD

Create Pac man and movement rules
      - Create js variable and CSS to show starting position of Pac-man
      - Create event listeners for KEYS ONLY
      - Create logic for rules as to how player can move (Think about Math)
            - If a wall is left, cannot move left
            - If a wall is above, cannot move up
            - ETC
            - Put some thought in to how to structure this as could re-use for ghosts?

            - The Array that tells the map where the walls are could also be utilised in this movment step
                  - For example if the index number of the cell is INCLUDES in the Array, then cant move in that direction

      PACMAN CAN MOVE AROUND MAP CORRECTLY

Create single ghost
      - Create the first ghost in its starting position
      - Create logic for how it can move
            - At each intersection it randomly picks a direc tion to move
            - Think more about this
            - Maybe a function which calculates avalable movement directions, and if this is more than 1 at any interval, then a random number is used to pick which way it goes

      - Create interval to allow it to know how fast it can move

      A GHOST IS ABLE TO MOVE AROUND THE MAP

Create remainimg ghosts
      - Create remaining ghosts and apply same logic for movement
      - Use same interval
      - Apply logic for when they can release from starting Pen after start of game

      HAVE $ GHOSTS AND PLAYER THAT CAN MOVE AROUND THE MAP

Add player in to interval loop (Or new loop?)
      - Move the code so that the player and the ghosts are moving at the allowed speed
      - Create logic and CSS for what happens to end a game - ie. player is caught

      GAME RUNS AT CORRECT SPEED AND ABLE TO END

Add food and score logic
      - Add classes and initialization rules for where the food shoiuld be
      - Add logic so player can eat food, and score increases
            - This can be done by checking the classes applied to each div, and then to increase the score and remove the food
      - Add logic for player to win game if all food is eaten
            - This could be done by counting the GridSquares that have class of Food (ie. if it === 0 then the player wins)

      PLAYER ABLE TO EAT FOOD, INCREASE SCORE & WIN

Limited CSS and other styling to make it look better
      - Get final resources needed for theming
      - add pictures, colors, background colors & animation as needed
      - Dont go mad for the moment but should look ok




/////////

Add 'superfood' initialization and classes
      - Add new class of super food
      - Add ability for 'HUNTER' to become 'HUNTED'
      - If ghost is eaten, destroy this ghost, increase score and 'respawn' ghost to release after XXX seconds

      SUPER FOOD WORKS

Increase inteligence of Ghosts
      - Use improved mathamatical logic to move the ghosts in a more inteligent way
      - For level 2 this could be using Pythagorean theorem???

      - If there is another level is there a way to make the ghosts calculate and use always the shortewst path to the player???
      PATHFINDING (A* MAy help)
