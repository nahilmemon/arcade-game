/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

let Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  let doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  const canvasMaxWidth = 505;
  const canvasMaxHeight = 606;
  const gameArea = doc.querySelector('.game');

  canvas.width = canvasMaxWidth;
  canvas.height = canvasMaxHeight;
  changeCanvasSize();
  gameArea.insertBefore(canvas, doc.querySelector('#button-help'));

  // This function changes the size of the canvas based on the
  // window's current size
  function changeCanvasSize(){
    // If the window's aspect ratio is greater than the canvas' aspect ratio
    if (window.innerHeight/window.innerWidth > (canvasMaxHeight/canvasMaxWidth)){
      // And if the window's width is smaller than the canvas' max width,
      // then resize the canvas so that it takes up all of the window's width and
      // the height is resized in proportion to the new width such that the original
      // aspect ratio is maintained
      if (window.innerWidth < canvasMaxWidth) {
        const newCanvasHeight = canvasMaxHeight/canvasMaxWidth*window.innerWidth;
        canvas.setAttribute('style', `width: 100%; height: ${newCanvasHeight}px`);
        gameArea.setAttribute('style', `width: 100%; height: ${newCanvasHeight}px`);
      }
      // Otherwise, use the canvas' max width and height dimensions so that it
      // doesn't get too pixelated on larger screens
      else {
        canvas.setAttribute('style', `width: ${canvasMaxWidth}px; height: ${canvasMaxHeight}px`);
        gameArea.setAttribute('style', `width: ${canvasMaxWidth}px; height: ${canvasMaxHeight}px`);
      }
    }
    // Otherwise, if the window's aspect ratio is less than the canvas' aspect ratio
    else {
      // And if the window's height is smaller than the canvas' max height,
      // then resize the canvas so that it takes up all of the window's height and
      // the width is resized in proportion to the new height such that the original
      // aspect ratio is maintained
      if (window.innerHeight < canvasMaxHeight) {
        const newCanvasWidth = canvasMaxWidth/canvasMaxHeight*window.innerHeight;
        canvas.setAttribute('style', `width: ${newCanvasWidth}px; height: 100vh`);
        gameArea.setAttribute('style', `width: ${newCanvasWidth}px; height: 100vh`);
      }
      // Otherwise, use the canvas' max width and height dimensions so that it
      // doesn't get too pixelated on larger screens
      else {
        canvas.setAttribute('style', `width: ${canvasMaxWidth}px; height: ${canvasMaxHeight}px`);
        gameArea.setAttribute('style', `width: ${canvasMaxWidth}px; height: ${canvasMaxHeight}px`);
      }
    }
  }

  // This changes the size of the canvas whenever the window is
  // resized
  window.addEventListener('resize', changeCanvasSize);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    updateEntities(dt);
    checkCollisions();
    // Reset the game if need be
    if (resetGame == true) {
      resetGame = false;
      init();
    }
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    allPlayers.forEach(function(player) {
      player.update(dt);
    });
  }

  function checkCollisions() {
    gear.checkCollision(allPlayers[currentPlayerIndex]);
    allEnemies.forEach(function(enemy) {
      enemy.checkCollision(allPlayers[currentPlayerIndex]);
    });
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
        'images/water-block.png',   // Top row is water
        'images/wood-block.png',    // Next row is wood
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/grass-block.png'   // Bottom row is grass
      ],
      numRows = 6,
      numCols = 5,
      row, col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    gear.render();

    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    allPlayers.forEach(function(player) {
      player.render();
    });
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    gear.restart(allPlayers[currentPlayerIndex], true);
    currentPlayerIndex = 0;
    allPlayers = createArrayOfPlayers();
    allEnemies = createArrayOfEnemies();
    docksFilledArray = resetDocksFilledArray();
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/wood-block.png',
    'images/enemy-bug-ltr.png',
    'images/enemy-bug-rtl.png',
    'images/fishing-pole.png',
    'images/char-cat-girl.png',
    'images/char-boy.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
