(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./game":2,"./pipe":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

module.exports = exports = Pipe;

function Pipe(position, type) {
	this.x = position.x;
	this.y = position.y;
	this.fillingState = false;
	this.type = type;
	this.direction = "none";
	this.pixles = 0;
	this.arcLen = 1;
	this.fillX = 0;
	this.fillY = 0;
	this.width = 64;
	this.height = 64;
	this.sprite = new Image();
	this.sprite.src = encodeURI('assets/pipes.png');
	this.audio = new Audio();
	this.audio.src = encodeURI('assets/TurnPipe.wav');
}

Pipe.prototype.rotate = function() {
	if(this.type > 1 && this.type < 6) {
		if(this.type == 5) {
			this.type = 2;
		}
		else {
			this.type++;
		}
	}
	if(this.type > 5 && this.type < 10) {
		if(this.type == 9) {
			this.type = 6;
		}
		else {
			this.type++;
		}
	}
	if(this.type > 9 && this.type < 12) {
		if(this.type == 11) {
			this.type = 10;
		}
		else {
			this.type++;
		}
	}
	this.audio.play();
}

Pipe.prototype.filling = function(direction, speed) {
	this.direction = direction;
	if(this.pixles<64) {
		this.pixles+=speed;
	}
	else {
		this.pixles = 64;
	}
	if(this.arcLen<1.5) {
		this.arcLen+=speed/180;
	}
}

Pipe.prototype.update = function(elapsedTime) {
	
}

Pipe.prototype.render = function(time, ctx) {
	switch(this.type) {
		case 1:
			ctx.fillStyle = "blue";
			switch(this.direction) {
				case "left":
					this.fillX = this.x;
					this.fillY = this.y + 26;
					ctx.fillRect(this.fillX,this.fillY,this.pixles,12);
					if(this.pixles>=32) {
						ctx.fillRect(this.x + 26, this.y + 32, 12, this.pixles-32);
						ctx.fillRect(this.x + 26, this.y-(this.pixles-64), 12, this.pixles-32);
					}
					
					break;
				case "right":
					this.fillX = this.x + 64;
					this.fillY = this.y + 26;
					ctx.fillRect(this.fillX-this.pixles,this.fillY,this.pixles,12);
					if(this.pixles>=32) {
						ctx.fillRect(this.x + 26, this.y + 32, 12, this.pixles-32);
						ctx.fillRect(this.x + 26, this.y - (this.pixles-64), 12, this.pixles-32);
					}
					break;
				case "up":
					this.fillX = this.x + 26;
					this.fillY = this.y;
					ctx.fillRect(this.fillX,this.fillY,12,this.pixles);
					if(this.pixles>=32) {
						ctx.fillRect(this.x + 32, this.y + 26, this.pixles-32, 12);
						ctx.fillRect(this.x - (this.pixles-64), this.y + 26, this.pixles-32, 12);
					}
					break;
				case "down":
					this.fillX = this.x + 26;
					this.fillY = this.y + 64;
					ctx.fillRect(this.fillX,this.fillY-this.pixles,12,this.pixles);
					if(this.pixles>=32) {
						ctx.fillRect(this.x + 32, this.y + 26, this.pixles-32, 12);
						ctx.fillRect(this.x - (this.pixles-64), this.y + 26, this.pixles-32, 12);
					}
					break;
			}
			ctx.drawImage(
        		// image
        		this.sprite,
        		// source rectangle
        		0, 0, this.width, this.height,
        		// destination rectangle
        		this.x, this.y, this.width, this.height
    		);
    		break;
		case 2:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					ctx.fillStyle="blue";
					ctx.beginPath();
					ctx.arc(this.x+64, this.y+64, 45, 3/2 * Math.PI, ((3/2)/this.arcLen) * Math.PI, 1);
					ctx.stroke();
					ctx.fill();
					break;
				case "up":
					//lose
					break;
				case "down":
					ctx.fillStyle="blue";
					ctx.beginPath();
					ctx.arc(this.x+64, this.y+64, 45, Math.PI, this.arcLen * Math.PI, -1);
					ctx.stroke();
					ctx.fill();
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				64, 64, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 3:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				127, 64, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 5:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				64, 127, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 4:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				127, 127, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 6:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				64, 192, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 7:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				127, 192, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 9:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				64, 256, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 8:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				127, 256, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 10:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				192, 64, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 11:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				192, 127, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 13:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.fillStyle = "red";
  			ctx.fillRect(this.x,this.y,64,64);
  			ctx.fillStyle = "#777777";
  			ctx.fillRect(this.x,this.y+22,64,20);
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				64, 0, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
		case 12:
			switch(this.direction) {
				case "left":
					//lose
					break;
				case "right":
					//fill
					break;
				case "up":
					//lose
					break;
				case "down":
					//fill
					break;
			}
			ctx.fillStyle = "green";
  			ctx.fillRect(this.x,this.y,64,64);
  			ctx.fillStyle = "#777777";
  			ctx.fillRect(this.x,this.y+22,64,20);
			ctx.drawImage(
				// image
				this.sprite,
				// source rectangle
				192, 0, this.width, this.height,
				// destination rectangle
				this.x, this.y, this.width, this.height
			);
			break;
	}
}
},{}]},{},[1]);
