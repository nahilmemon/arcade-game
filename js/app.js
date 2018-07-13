// --- GLOBAL VARIABLES --- //
// Canvas dimensions
let canvasWidth = 505;
let canvasHeight = 606;
let rowWidth = 83;
let colWidth = 101;
let numRows = 6;
let numCols = 5;
// Game status
let gameOver = false;
let gameWon = false;
let collisionOccurred = false;
// Modal
const modalHelp = document.querySelector('#modal-help');
const buttonHelp = document.querySelector('#button-help');
const modalOverlay = document.querySelector('.modal-overlay');

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
      gameOver = true;
      gameWon = false;
      // End the game after a 10ms delay so that the user can actually see
      // the collision overlap
      setInterval(function(){
        [gameOver, gameWon] = endGame(gameOver, gameWon);
      }, 10);
    }
  };
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
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
    this.sprite = 'images/char-boy.png';
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
    } else if (keyPressed == 'up' && this.rowPos < (numRows - 1)) {
      this.rowPos += 1;
    } else if (keyPressed == 'down' && this.rowPos > 0) {
      this.rowPos -= 1;
    }

    // Check if the game has been won (i.e. if the player reached
    // the river successfully)
    if (this.rowPos == (numRows - 1)) {
      gameOver = true;
      gameWon = true;
      endGame(gameOver, gameWon);
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

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Restart the player's position
  restart() {
    this.colPos = 2;
    this.rowPos = 0;
    this.x = colWidth*this.colPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
  }
}

// --- FUNCTIONS --- //
// Alert the user when the game is over and if it was won or lost
function endGame(isGameOver, isGameWon) {
  // Check if the game is over
  if (isGameOver) {
    // Check if the game was won
    if (isGameWon == true) {
      // Notify the user
      alert('You won the game! XD');
      // Reset the isGameWon variable's value
      isGameWon = false;
    }
    // Or if the game was lost
    else {
      // Notify the user
      alert('You lost the game! T_T');
      collisionOccurred = false;
    }
    // Reset the isGameOver variable's value
    isGameOver = false;
    // Restart the player's position
    player.restart();
  }
  // Return the updated values of game status variables
  return [isGameOver, isGameWon];
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
  for (let i=2; i<5; i++) {
    // Determine a random speed for the enemies in each row
    const speed = getRandomInteger(50, 150);
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

// Show/hide the game over modal
function toggleModal(modal) {
  modal.classList.toggle('modal-show');
}

// --- INSTANTIATIONS --- //
// Instantiate enemy objects within allEnemies array
let allEnemies = createArrayOfEnemies();
// Instantiate the player object
let player = new Player();

// --- EVENT LISTENERS --- //
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// Have the instructions modal open upon page load
window.addEventListener('load', function() {
  toggleModal(modalHelp);
});

// Open/close the modal if the user clicks on the help button
buttonHelp.addEventListener('click', function() {
  toggleModal(modalHelp);
});

// Close the modal if the user clicks outside the modal when
// it's currently opened
modalOverlay.addEventListener('click', function() {
  toggleModal(modalHelp);
});