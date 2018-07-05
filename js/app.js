// Global Variables
// Canvas dimensions
let canvasWidth = 505;
let canvasHeight = 606;
let rowWidth = 83;
let colWidth = 101;
let numRows = 5;
let numCols = 6;
// Game status
let gameOver = false;
let gameWon = false;

// Enemies our player must avoid
class Enemy {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  };

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
    // First figure out the correct row and column position
    // for the player
    this.rowPos = 2;
    this.colPos = 0;
    // Then figure out the correct x and y positions accordingly
    this.x = colWidth*this.rowPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.colPos;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(keyPressed) {
    // Move the player according to the key pressed without crossing
    // the boundaries of the game
    // First figure out the correct row and column position
    if (keyPressed == 'left' && this.rowPos > 0) {
      this.rowPos -= 1;
    } else if (keyPressed == 'right' && this.rowPos < (numRows - 1)) {
      this.rowPos += 1;
    } else if (keyPressed == 'up' && this.colPos < (numCols - 1)) {
      this.colPos += 1;
    } else if (keyPressed == 'down' && this.colPos > 0) {
      this.colPos -= 1;
    }
    // Then figure out the correct x and y positions accordingly
    this.x = colWidth*this.rowPos;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.colPos;

    // Check if the game has been won (i.e. if the player reached
    // the river successfully)
    if (this.colPos == (numCols - 1)) {
      gameOver = true;
      gameWon = true;
      endGame(gameOver, gameWon);
    }
  }
}

// Alert the user when the game is over and if it was won or lost
function endGame(isGameOver, isGameWon) {
  // Check if the game is over
  if (isGameOver) {
    // Check if the game was won
    if (isGameWon == true) {
      // Notify the user
      alert('You won the game! XD');
    }
    // Or if the game was lost
    else {
      // Notify the user
      alert('You lost the game! T_T');
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy()];
let player = new Player();

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
