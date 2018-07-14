# Arcade Game Project: Let’s Go Fishing!

## Table of Contents

* [Description](#description)
* [How to Run the Game](#how-to-run-the-game)
* [How to Play the Game](#how-to-play-the-game)
  * [The Story](#the-story)
  * [The Objective](#the-objective)
  * [Gameplay Mechanics](#gameplay-mechanics)
* [Minimum Requirements](#minimum-requirements)
* [Extra Features](#extra-features)
* [Resources Used](#resources-used)

## Description

This is a HTML5 canvas and JS implementation of the classic Frogger arcade game. Having been provided some [visual assets and a game loop engine](https://github.com/udacity/frontend-nanodegree-arcade-game), I used object-oriented programming to create the player, enemy, and gear entities and implement the game logic.

## How to Run the Game

### Option A

Go [here](https://nahilmemon.github.io/arcade-game/) to play the game in your web browser.

### Option B

Download the repository and open index.html to load the game and begin playing.

## How to Play the Game

### The Story

One day, Luka and her friends were bored and hungry, so they decided to go fishing. As they race over to the docks, a huge gust of wind preceding a stampede of humongous lady bugs sweeps over and they lose their fishing gear during all the madness. Help Luka and her friends find their fishing gear and get to the docks without getting stomped on.

### The Objective

The objective of the game is to move Luka and her friends around to collect their fishing gear before heading to the docks row without colliding into a lady bug. If you hit a lady bug, then you will drop the gear at the site of the collision and your position will reset to the beginning location of the game. There is a total of five levels; in each level, you play a different friend and the lady bugs get faster. Only one friend can occupy one of the blocks in the docks row. The game is won when all five friends have been successfully moved to the docks with their fishing gear.

### Gameplay Mechanics

* Use the ↑, ↓, ←, and → keys to move around.
* Press R to reset the game.
* Press ENTER or ESC to close the help or game won modals.

## Minimum Requirements

The minimum requirements of this project involved implementing the following features:
* Create a Player class
* Fill in the missing parts of the Enemy class
* Move the player around with the arrow keys
* Move the enemies automatically in the stone block rows with varying speeds
* Reset the game when the player hits an enemy
* A win condition when the player reaches the top of the board

## Extra Features

Extra features that were added to the game included:
* A help modal popup explaining how to play the game. This was presented upon page and when the user clicks on the ? button.
* A Gear class to represent the fishing gear collectibles
* A story behind the game with a plausible objective
* A leveling up system with a total of five levels in which the player must move a different character around and the speed of the lady bugs increases
* A modal popup to congratulate the user upon winning the game
* The ability to reset the game using the R key or when closing the game won modal popup
* Ensure that the game is usable across modern desktop, tablet, and phone browsers

## Resources Used
* [Modal effects tutorial](https://tympanus.net/Development/ModalWindowEffects/)
* [Game icons](https://game-icons.net/)
* [Wood painting by Van Rothko](https://www.pinterest.com/pin/495536765221856407/)
* [Background image by Lisa Lowe](https://www.pinterest.com/pin/495536765221856407/)