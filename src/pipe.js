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