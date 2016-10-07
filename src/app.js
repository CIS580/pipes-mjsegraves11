"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var level = 1;
var score = 0;
var pipeStack = [];
var pipeStart = new Pipe({x:128,y:128}, 12);
var pipeEnd = new Pipe({x:640,y:384}, 13);
var onPipe = false;
getNewPipe();

var placePipe = new Audio();
placePipe.src = encodeURI('assets/PlacePipe.wav');
var lose = new Audio();
lose.src = encodeURI('assets/GameOver.wav');
var win = new Audio();
win.src = encodeURI('assets/LevelUp.wav');
var background = new Audio();
background.src = encodeURI('assets/Background.wav');

//var image = new Image();
//image.src = 'assets/pipes.png';

canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  var x = event.offsetX;
  var y = event.offsetY;
  var gridX = Math.floor(x/64);
  var gridY = Math.floor(y/64);
  if(gridX > 1) {
    pipeStack.forEach(function(pipe) {
      if(pipe.x == gridX*64 && pipe.y == gridY*64)
      {
        onPipe = true;
      }
    });
    if(!onPipe) {
      pipeStack[0].x = gridX*64;
      pipeStack[0].y = gridY*64;
      placePipe.play();
      getNewPipe();
    }
    onPipe = false;
  }
}

canvas.oncontextmenu = function(event) {
  event.preventDefault();
  var x = event.offsetX;
  var y = event.offsetY;
  var gridX = Math.floor(x/64);
  var gridY = Math.floor(y/64);
  if(gridX > 1) {
    pipeStack.forEach(function(pipe) {
      if(pipe.x == gridX*64 && pipe.y == gridY*64)
      {
        pipe.rotate();
      }
    });
  }
}

function gameOver() {
  lose.play();
  pipeStack = [];
  getNewPipe();
  score = 0;
  level = 1;
}

function beatLevel() {
  win.play();
  pipeStack = [];
  getNewPipe();
  score += 10 + level;
  level += 1;
}

function getNewPipe() {
  var rand = Math.random() * 100;
  console.log(rand);
  var type;
  if(rand >= 92) {
    type = 1;
  }
  else if(rand >= 87) {
    type = 6;
  }
  else if(rand >= 83) {
    type = 9;
  }
  else if(rand >= 61) {
    type = 5
  }
  else if(rand >= 48) {
    type = 3;
  }
  else if(rand >= 40) {
    type = 2;
  }
  else if(rand >= 30) {
    type = 4;
  }
  else if(rand >= 15) {
    type = 10;
  }
  else if(rand < 15) {
    type = 11;
  }

  pipeStack.unshift(new Pipe({x:32,y:96}, type));
  //pipeStack.unshift(new Pipe({x:32,y:96}, 2));
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  background.play();
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  /*pipeStack.forEach(function(pipe) {
    pipe.filling("right", level);
  });*/
  /*if(pipeStack.length > 10) {
    beatLevel();
  }*/
  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 128, 860);
  //draw score and level
  ctx.fillStyle = "black"
  ctx.font = "20px Arial";
  ctx.fillText("Next Pipe",18,60);

  ctx.font = "25px Arial";
  ctx.fillText("Level: " + level, 10,230);
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 300);

  ctx.beginPath();
  for(var x=0;x<9;x++) {
    ctx.moveTo(128+(x*64), 0);
    ctx.lineTo(128+(x*64), canvas.height);
    ctx.stroke();
  }
  for(var y=0;y<9;y++) {
    ctx.moveTo(128, y*64);
    ctx.lineTo(canvas.width, y*64);
    ctx.stroke();
  }
  pipeStart.render(elapsedTime, ctx);
  pipeStack.forEach(function(pipe) {
    pipe.render(elapsedTime, ctx);
  });
  pipeEnd.render(elapsedTime, ctx);
  // TODO: Render the board

}
