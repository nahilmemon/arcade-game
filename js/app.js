// --- GLOBAL VARIABLES --- //
// Canvas dimensions
let canvasWidth = 505;
let canvasHeight = 606;
let rowWidth = 83;
let colWidth = 101;
let numRows = 6;
let numCols = 5;
// Game status
let gameLost = false;
let levelWon = false;
let gameWon = false;
let collisionOccurred = false;
let resetGame = false;
// Modal
const buttonHelp = document.querySelector('#button-help');
const modalOverlay = document.querySelector('.modal-overlay');
const modalCloseButtons = document.querySelectorAll('.button-close-modal');
// Players
let currentPlayerIndex = 0;
const arrayPlayerSprites = [
  'images/char-cat-girl.png',
  'images/char-boy.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];
let finalPlayerID = arrayPlayerSprites.length - 1;

// --- CLASSES --- //
// Enemies our player must avoid
class Enemy {
  constructor(row, rowDirection, startXCol, movementSpeed) {
    // Determine the enemy's y position
    this.rowPos = row; // 2, 3, or 4
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
    // Determine the enemy's x position
    this.x = colWidth*startXCol;
    // Enemy's speed
    this.speed = movementSpeed;
    // Enemy's dimensions
    this.actualWidth = 97;
    this.actualHeight = 66;
    this.leftOffset = 1.5;
    this.topOffset = 77.5;
    // Enemy's direction
    this.direction = rowDirection;
    // Choose the sprite (enemy's orientation) based on the
    // enemy's direction. The image/sprite uses a helper
    // function to easily load images
    if (this.direction == 0) {
      this.sprite = 'images/enemy-bug-ltr.png';
    } else  {
      this.sprite = 'images/enemy-bug-rtl.png';
    }
  }

  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    const offset = 10; // used to help reset the enemy's position
    // Movement is multiplied by the dt parameter to ensure the
    // game runs at the same speed for all computers.
    // If the enemy is moving from left to right:
    if (this.direction == 0) {
      // If the enemy has not reached the other side of the canvas
      if (this.x < (canvasWidth + colWidth*offset)) {
        // then move the enemy right
        this.x += this.speed*dt;
      } else {
        // reset the enemy's position
        this.x = -colWidth - colWidth*offset;
      }
    } else { // If the enemy if moving from right to left:
      // If the enemy has not reached the other side of the canvas
      if (this.x > (-colWidth - colWidth*offset)) {
        // then move the enemy left
        this.x -= this.speed*dt;
      } else {
        // reset the enemy's position
        this.x = canvasWidth + colWidth*offset;
      }
    }
  };

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  // Check if the enemy has collided with the player
  checkCollision(player) {
    // Enemy boundaries
    let leftBoundaryEnemy = this.x + this.leftOffset;
    let rightBoundaryEnemy = this.x + this.leftOffset + this.actualWidth;
    let topBoundaryEnemy = this.y + this.topOffset;
    let bottomBoundaryEnemy = this.y + this.topOffset + this.actualHeight;

    // Player Boundaries
    let leftBoundaryPlayer = player.x + player.leftOffset;
    let rightBoundaryPlayer = player.x + player.leftOffset + player.actualWidth;
    let topBoundaryPlayer = player.y + player.topOffset;
    let bottomBoundaryPlayer = player.y + player.topOffset + player.actualHeight;

    // Check if the enemy and the player overlap each other
    if (leftBoundaryEnemy < rightBoundaryPlayer &&
     rightBoundaryEnemy > leftBoundaryPlayer &&
     topBoundaryEnemy < bottomBoundaryPlayer &&
     bottomBoundaryEnemy > topBoundaryPlayer) {
      // If so, then end the game (as the game was lost)
      collisionOccurred = true;
      gameLost = true;
      levelWon = false;
      gameWon = false;
      // End the game after a 10ms delay so that the user can actually see
      // the collision overlap
      setInterval(function(){
        [gameLost, levelWon, gameWon] = endGame(gameLost, levelWon, gameWon);
      }, 10);
    }
  };
}

// Player class
class Player {
  constructor(spriteImage, index) {
    // Player's intial row and column positions
    this.colPos = 2;
    this.rowPos = 0;
    // Player's x and y positions based on row and column positions
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
    // Player's dimensions
    this.actualWidth = 61;
    this.actualHeight = 76;
    this.leftOffset = 20;
    this.topOffset = 63.5;
    // The image/sprite for the player, which uses
    // a helper function to easily load images
    this.sprite = spriteImage;
    this.ID = index;
    this.active = false;
    this.isVisible = false;
  }

  // Update the player's position based on the keyboard input given
  handleInput(keyPressed) {
    // Move the player according to the key pressed without crossing
    // the boundaries of the game
    // First figure out the correct row and column position
    if (keyPressed == 'left' && this.colPos > 0) {
      this.colPos -= 1;
    } else if (keyPressed == 'right' && this.colPos < (numCols - 1)) {
      this.colPos += 1;
    } else if (keyPressed == 'down' && this.rowPos > 0) {
      this.rowPos -= 1;
    }
    // Special case: Make sure the player can't move into the docks
    // if the player did not collect the gear and/or if the dock
    // is already filled with another player
    else if (keyPressed == 'up') {
      // If the player is not trying to move into the docks,
      // then move up one row
      if ((this.rowPos + 1) < (numRows - 2)) {
        this.rowPos += 1;
      }
      // Otherwise, the player can only move into the docks
      // if the gear has been collected and that particular
      // column is empty
      else if (gear.hasBeenCollected == true &&
       docksFilledArray[this.colPos] == false) {
        this.rowPos += 1;
      }
    }

    // Check if the game has been won (i.e. if the player reached
    // the docks successfully and has the gear collected)
    if (this.rowPos == (numRows - 2) && gear.hasBeenCollected == true) {
      gameLost = false;
      levelWon = true;
      // Remember which part of the dock was filled in
      docksFilledArray[this.colPos] = true;
      // If the final player was the currently active player,
      // then the whole game was won
      if (this.ID == finalPlayerID) {
        gameWon = true;
      } else {
        gameWon = false;
      }
      // End the level and/or game
      [gameLost, levelWon, gameWon] = endGame(gameLost, levelWon, gameWon);
    }
  }

  // Update the player's position, based on the results of
  // the handleInput(keyPressed) function
  update() {
    // Figure out the correct x and y positions according to the
    // new row and column positions
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
  };

  // Draw the player on the screen if it is currently active
  render() {
    if (this.isVisible == true) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

  // Restart the player's position
  restart() {
    this.colPos = 2;
    this.rowPos = 0;
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
  }
}

// Fishing gear that the player needs to collect
class Gear {
  constructor() {
    // Gear's intial row and column positions
    this.colPos = getRandomInteger(0, numCols - 1);
    this.rowPos = getRandomInteger(1, 3);
    // Gear's x and y positions based on row and column positions
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
    // Has the gear been collected
    this.hasBeenCollected = false;
    // The image/sprite for the fishing gear, which uses
    // a helper function to easily load images
    this.sprite = 'images/fishing-pole.png';
  }

  // Draw the fishing gear on screen if it hasn't been collected
  // yet
  render() {
    if (this.hasBeenCollected == false) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  };

  // Check if the player has reached where the gear is, and let
  // the player "collect" the gear (i.e. hide the gear)
  checkCollision(player) {
    // Check if the gear and the player overlap each other
    if (this.rowPos == player.rowPos &&
     this.colPos == player.colPos) {
      // If so, then hide the gear item
      this.hasBeenCollected = true;
      this.rowPos = null;
      this.colPos = null;
      this.x = null;
      this.y = null;
    }
  };

  // Reset the gear's position and appearance
  restart(player, pureReset) {
    // If there was a collision between the player and an enemy
    // while the player had possession of the gear,
    // then drop the gear where the player was last standing
    if (pureReset == false) {
      if (this.hasBeenCollected == true) {
        this.colPos = player.colPos;
        this.rowPos = player.rowPos;
      }
    } else { // Otherwise, get a new random position for the gear
      this.colPos = getRandomInteger(0, numCols - 1);
      this.rowPos = getRandomInteger(1, 3);
    }
    // Gear's x and y positions based on row and column positions
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
    // Has the rod been collected
    this.hasBeenCollected = false;
  }
}

// --- FUNCTIONS --- //
// Alert the user when the game is over and if it was won or lost
function endGame(isGameLost, isLevelWon, isGameWon) {
  // Check if the game was lost
  if (isGameLost == true) {
    // Alert the user?
    // Reset the collisionOccurred boolean
    collisionOccurred = false;
    // Reset the isGameWon boolean
    isGameWon = false;
    // Reset the isLevelWon boolean
    isLevelWon = false;
    // Reset the isGameLost boolean
    isGameLost = false;
    // Restart the gear's position and state
    // ---?
    gear.restart(allPlayers[currentPlayerIndex], false);
    // Restart the player's position
    allPlayers[currentPlayerIndex].restart();
  }
  // Else check if the level and/or game were won
  else {
    // Check if the level and the game were won
    if (isLevelWon == true && isGameWon == true) {
      // Notify the user
      toggleModal(1, true);
      // Reset the isGameWon boolean
      isGameWon = false;
      // Reset the isLevelWon boolean
      isLevelWon = false;
      // Reset the isGameLost boolean
      isGameLost = false;
      // Restart the gear's position and state
      // ---?
      gear.restart(allPlayers[currentPlayerIndex], false);
    }
    // Else check if only the level was won
    else if (isLevelWon == true && isGameWon == false) {
      // Change the currently active player
      allPlayers[currentPlayerIndex].active = false;
      currentPlayerIndex++;
      allPlayers[currentPlayerIndex].active = true;
      allPlayers[currentPlayerIndex].isVisible = true;
      // Reset the gear
      // ---?
      gear.restart(allPlayers[currentPlayerIndex], true);
      // Reset the enemies
      allEnemies = createArrayOfEnemies();
      // Reset the isGameWon boolean
      isGameWon = false;
      // Reset the isLevelWon boolean
      isLevelWon = false;
      // Reset the isGameLost boolean
      isGameLost = false;
    }
  }
  return [isGameLost, isLevelWon, isGameWon];
}

// Return a random integer from within the given range
function getRandomInteger(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

// Create an array of enemies with random positioning and speeds
// and running in opposite directions for each row
function createArrayOfEnemies() {
  let arrayOfEnemies = [];
  const spacing = 4; // the spacing between each enemy in each row
  // Iterate through each stone row
  for (let i=1; i<4; i++) {
    // Determine a random speed for the enemies in each row based on
    // the current level (player index being played)
    const lowerSpeedLimit = 50 + currentPlayerIndex*25;
    const upperSpeedLimit = 75 + currentPlayerIndex*25;
    const speed = getRandomInteger(lowerSpeedLimit, upperSpeedLimit);
    // Alternate direction for each row
    const direction = i%2;
    // Create 8 enemies within each row.
    for (let j=-3; j<4; j++) {
      // Determine the column in which the enemy will initialize.
      // This is determined according to index of the enemy in the
      // current row, the set spacing provided for the row, and
      // a random increment in spacing so that the enemies don't
      // march with a uniform spacing. Some enemies will initialize
      // before the visibile portion of the row begins, within the
      // visible portion of the row, and after the visible portion
      // of the row ends.
      const startXCol = j*spacing + getRandomInteger(0, 2);
      // Create and add an enemy to the arrayOfEnemies
      arrayOfEnemies.push(new Enemy(i, direction, startXCol, speed));
    }
  }
  return arrayOfEnemies;
}

// Create an array of players
function createArrayOfPlayers() {
  let arrayOfPlayers = [];
  // Iterate through the array of player sprites,
  // and make new player with each sprite
  for (let i=0; i<arrayPlayerSprites.length; i++) {
    arrayOfPlayers.push(new Player(arrayPlayerSprites[i], i));
  }
  // Display the first player
  arrayOfPlayers[0].active = true;
  arrayOfPlayers[0].isVisible = true;
  return arrayOfPlayers;
}

// Show/hide the given modal and the desired contents to go with it
function toggleModal(modalContents, reveal) {
  // Toggle the display of the desired contents of the modal
  const modalHelp = document.querySelector('#modal-help');
  const modalGameWon = document.querySelector('#modal-game-won');
  // If the modal needs to be revealed, then reveal the correct
  // modal based on the modalContents input given
  if (reveal == true) {
    // Reveal the help modal
    if (modalContents == 0) {
      modalHelp.classList.add('modal-show');
    } else { // Reveal the game won modal
      modalGameWon.classList.add('modal-show');
      // Change the modal overlay color to match the contents
      modalOverlay.classList.add('game-won-overlay');
    }
  } else { // Otherwise, hide all the modals and reset the overlay
    // First check if the game won modal was the modal currently open
    if (modalGameWon.classList.contains('modal-show')) {
      // If so, reset the game upon closing the modal
      resetGame = true; // the game will reset in engine.js
    }
    // Then hide all the modals
    modalHelp.classList.remove('modal-show');
    modalGameWon.classList.remove('modal-show');
    modalOverlay.classList.remove('game-won-overlay');
  }
}

// Reset the docksFilledArray
function resetDocksFilledArray() {
  let docksArray = [];
  for (let i=0; i<numCols; i++) {
    docksArray[i] = false;
  }
  return docksArray;
}

// --- INSTANTIATIONS --- //
// Instantiate enemy objects within the allEnemies array
let allEnemies = createArrayOfEnemies();
// Instantiate the player objects within the allPlayers array
let allPlayers = createArrayOfPlayers();
// Instantiate the fishing pole object
let gear = new Gear();
// Instantiate the docksFilledArray
let docksFilledArray = resetDocksFilledArray();

// --- EVENT LISTENERS --- //
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter',
    27: 'escape',
    82: 'restart'
  };

  // Based on the keyboard input, hide the modal, reset
  // the game, or move the player around
  if (allowedKeys[e.keyCode] == 'enter'
   || allowedKeys[e.keyCode] == 'escape') {
    toggleModal(0, false);
  } else if (allowedKeys[e.keyCode] == 'restart') {
    resetGame = true;
  } else {
    allPlayers[currentPlayerIndex].handleInput(allowedKeys[e.keyCode]);
  }
});

// Open/close the modal if the user clicks on the help button
buttonHelp.addEventListener('click', function() {
  toggleModal(0, true);
});

// Close the modal if the user clicks outside the modal when
// it's currently opened
modalOverlay.addEventListener('click', function() {
  toggleModal(0, false);
});

// Close the modal if the user clicks the close modal button
for (const closeButton of modalCloseButtons) {
  closeButton.addEventListener('click', function() {
    toggleModal(0, false);
  });
}