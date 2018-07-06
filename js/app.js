// Global Variables
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

// Enemies our player must avoid
class Enemy {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.rowPos = 2; // 2, 3, or 4
    this.x = 0;
    this.y = canvasHeight - rowWidth*(11/4) - 83*this.rowPos;
    this.speed = 50;
    // Enemy's dimensions
    this.actualWidth = 97;
    this.actualHeight = 66;
    this.leftOffset = 1.5;
    this.topOffset = 77.5;
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
    // If the enemy has not reached the other side of the canvas
    if (this.x < canvasWidth) {
      // then move the enemy right
      this.x += this.speed*dt;
    } else {
      // otherwise, reset the position of the enemy
      this.x = -101;
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
    this.actualWidth = 62;
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
