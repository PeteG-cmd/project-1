# project-1

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
