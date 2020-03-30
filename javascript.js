var NONE = 4,
	UP = 3,
	WALL = 4,
	LEFT = 2,
	DOWN = 1,
	RIGHT = 11,
	WAITING = 5,
	PAUSE = 6,
	PLAYING = 7,
	COUNTDOWN = 8,
	EATEN_PAUSE = 9,
	DYING = 10,
	TIME_TO_START_C = 24,
	Pacman = {};

var context = canvas.getContext("2d");
var blockSize = canvas.height / 10;
var context1 = canvas1.getContext("2d");
var shape; // = new Position();
var board; //0 is nothing, 1 is food, 2 is pacman, 100 is ghost, 5 is 5pointfood, 15 is 15pointfood, 25 is 25pointfood, 50 is 50pointfood
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var food_remain;
var lifes; //3
var tick = 0;
var time_to_start;
var stop_flag = false;

var game_audio = new Audio("audio/opening_song.mp3");
game_audio.loop = true;
var eat_audio = new Audio("audio/eating.short.mp3");
eat_audio.loop = false;
var bonus__eat_audio = new Audio("audio/eatpill.mp3");
bonus__eat_audio.loop = false;
var die_audio = new Audio("audio/die.mp3");
bonus__eat_audio.loop = false;
var winning_audio = new Audio("audio/battleOver.mp3");
winning_audio.loop = true;

var Position = function(i, j) {
	var i = i,
		j = j;

	function distance(other) {
		return Math.sqrt(
			Math.pow(this.i - other.i, 2) + Math.pow(this.j - other.j, 2)
		);
	}

	function plus_position(other) {
		return new Position(this.i + other.i, this.j + other.j);
	}

	function add_position(other) {
		this.i += other.i;
		this.j += other.j;
	}
	function equals(other) {
		return this.i == other.i && this.j == other.j;
	}

	// function minus_position(other) {
	//     return new Position(this.i - other.j, this.j - other.j);
	// }

	return {
		i: i,
		j: j,
		distance: distance,
		plus_position: plus_position,
		add_position: add_position,
		equals: equals
	};
};

var DIRECTION = {
	// UP: { direction: new Position(0, -1), name: "up", code: "" },
	// DOWN: { direction: new Position(0, 1), name: "down", code: "" },
	// LEFT: { direction: new Position(-1, 0), name: "left", code: "" },
	// RIGHT: { direction: new Position(1, 0), name: "right", code: "" },
	// STILL: { direction: new Position(0, 0), name: "still", code: "" }
	UP: { direction: new Position(-1, 0), name: "up" },
	DOWN: { direction: new Position(1, 0), name: "down" },
	LEFT: { direction: new Position(0, -1), name: "left" },
	RIGHT: { direction: new Position(0, 1), name: "right" },
	STILL: { direction: new Position(0, 0), name: "still" },
	opposite_direction: function opposite_direction(d1, d2) {
		return d1.direction.plus_position(d2.direction).equals(new Position(0, 0));
	}
};

var pacman_direction;

var max_balls = 90;
var min_balls = 50;
var max_ghosts = 3;
var min_ghosts = 1;
var eated = false;

var pressedOnce = false;
var eaten50Points = false;

var color5points;
var color15points;
var color25points;
var ghostsNum;
var targetScore;
var gameTime;

//bonus 50 points
var bonusX;
var bonusY;

//for start new game
var food_remain_new;
var gameTime_new;
var pacman_remain;

var ghostsNum;
var ghost = function(p, c) {
	var position = p,
		color = c,
		direction = DIRECTION.STILL; //typeof DIRECTION

	function draw(ctx) {
		var s = blockSize,
			top = this.position.i * s,
			left = this.position.j * s;

		var tl = left + s;
		var base = top + s - blockSize / (60 / 3);
		var inc = s / 10;

		var high = tick % 2 == 0 ? blockSize / (60 / 6) : -blockSize / (60 / 6);
		var low = tick % 2 == 1 ? blockSize / (60 / 6) : -blockSize / (60 / 6);

		// ctx.fillStyle = "#0000BB";
		ctx.fillStyle = this.color;
		ctx.beginPath();

		ctx.moveTo(left, base);

		ctx.quadraticCurveTo(left, top, left + s / 2, top);
		ctx.quadraticCurveTo(left + s, top, left + s, base);

		// Wavy things at the bottom
		ctx.quadraticCurveTo(tl - inc * 1, base + high, tl - inc * 2, base);
		ctx.quadraticCurveTo(tl - inc * 3, base + low, tl - inc * 4, base);
		ctx.quadraticCurveTo(tl - inc * 5, base + high, tl - inc * 6, base);
		ctx.quadraticCurveTo(tl - inc * 7, base + low, tl - inc * 8, base);
		ctx.quadraticCurveTo(tl - inc * 9, base + high, tl - inc * 10, base);

		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = "#FFF";
		ctx.arc(
			left + blockSize / (60 / 20),
			top + blockSize / (60 / 20),
			s / 7,
			0,
			300,
			false
		);
		ctx.arc(
			left + s - blockSize / (60 / 20),
			top + blockSize / (60 / 20),
			s / 7,
			0,
			300,
			false
		);
		ctx.closePath();
		ctx.fill();

		var f = s / 12;
		var off = {};
		off[DIRECTION.RIGHT.name] = [f, 0];
		off[DIRECTION.LEFT.name] = [-f, 0];
		off[DIRECTION.UP.name] = [0, -f];
		off[DIRECTION.DOWN.name] = [0, f];
		off[DIRECTION.STILL.name] = [0, 0];

		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.arc(
			left + blockSize / (60 / 20) + off[this.direction.name][0],
			top + blockSize / (60 / 20) + off[this.direction.name][1],
			s / 18,
			0,
			300,
			false
		);
		ctx.arc(
			left + s - blockSize / (60 / 20) + off[this.direction.name][0],
			top + blockSize / (60 / 20) + off[this.direction.name][1],
			s / 18,
			0,
			300,
			false
		);
		ctx.closePath();
		ctx.fill();
	}
	//changing the position using the variables: shape,board
	function move() {
		var maxdiff = -Infinity;
		var newd;
		for (d in DIRECTION) {
			try {
				newPosition = this.position.plus_position(DIRECTION[d].direction);
				if (
					newPosition.i >= 0 &&
					newPosition.i < 10 &&
					newPosition.j >= 0 &&
					newPosition.j < 10 &&
					board[newPosition.i][newPosition.j] != WALL &&
					board[newPosition.i][newPosition.j] < 100
				) {
					diff =
						-shape.distance(
							this.position.plus_position(DIRECTION[d].direction)
						) + shape.distance(this.position);
					if (diff > maxdiff) {
						newd = d;
						maxdiff = diff;
					}
				}
			} catch {}
		}
		//assumption: wont stuck
		board[this.position.i][this.position.j] -= 100;
		this.direction = DIRECTION[newd];
		this.position.add_position(this.direction.direction);
		board[this.position.i][this.position.j] += 100;
	}
	return {
		position: position,
		color: color,
		direction: direction,
		draw: draw,
		move: move
	};
};
var ghosts = []; //the ghosts of the game

var usersDataBase = { a: sha256("a") };
var controls = {
	left: undefined,
	right: undefined,
	up: undefined,
	down: undefined
};
// var controls = {};

var currentUser = {
	username: "",
	setUsername: function(username1) {
		this.username = username1;
		document.getElementById("current_user").innerHTML = username1;
	}
};
var currentPage = {
	pageName: "Welcome",
	setPageName: function(pageName1) {
		if (this.pageName == "Register") {
			document.getElementById("registerForm").reset();
		}
		this.pageName = pageName1;
	}
};

document.getElementById("range").oninput = function() {
	document.getElementById("range_number").innerHTML = this.value;
};

function handlekeyup() {
	keysDown[event.code] = false;
}

function handlekeydown() {
	keysDown[event.code] = true;
	if (lifes > 0 && event.code == "KeyP") {
		stop_flag = !stop_flag;
		if (stop_flag) {
			stopGame();
		} else {
			game_audio.play();
			interval = setInterval(UpdatePosition, 125);
		}
	}
}

function Start() {
	board = new Array();
	pacman_direction = DIRECTION.STILL;
	tick = 0;
	stop_flag = false;
	score = 0;
	pac_color = "yellow";
	pacman_remain = 1;
	lifes = 3;
	eaten50Points = false;
	pressedOnce = false;
	time_to_start = TIME_TO_START_C;
	var num5Point = Math.round(0.6 * food_remain);
	var num15Point = Math.round(0.3 * food_remain);
	var num25Point = food_remain - num5Point - num15Point;
	targetScore = 0;
	targetScore = 5 * num5Point + 15 * num15Point + 25 * num25Point;
	var cnt = 100;
	ghosts = [];
	var ghosts_remain = ghostsNum;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i === 3 && j === 3) ||
				(i === 3 && j === 4) ||
				(i === 3 && j === 5) ||
				(i === 6 && j === 1) ||
				(i === 6 && j === 2) ||
				(i === 7 && j === 7) ||
				(i === 6 && j === 7)
			) {
				board[i][j] = 4;
			} else if (i === 0 && j === 0) {
				board[i][j] = 50;
				bonusX = i;
				bonusY = j;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					var randomNum2 = Math.random();
					var sum = num5Point + num15Point + num25Point;
					var percent5 = num5Point / sum;
					var precent15 = num15Point / sum;
					var precent25 = num25Point / sum;
					if (randomNum2 < percent5) {
						num5Point--;
						board[i][j] = 5;
					} else if (randomNum2 < precent15 + percent5) {
						num15Point--;
						board[i][j] = 15;
					} else if (randomNum2 < precent25 + precent15 + percent5) {
						num25Point--;
						board[i][j] = 25;
					}
					food_remain--;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape = new Position(i, j);
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (num5Point > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell.i][emptyCell.j] = 5;
		food_remain--;
		num5Point--;
	}
	while (num15Point > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell.i][emptyCell.j] = 15;
		food_remain--;
		num15Point--;
	}
	while (num25Point > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell.i][emptyCell.j] = 25;
		food_remain--;
		num25Point--;
	}
	while (pacman_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		shape = emptyCell;
		pacman_remain--;
		board[emptyCell.i][emptyCell.j] = 2;
	}
	var randomColor;
	while (ghosts_remain > 0) {
		var emptyCell = findRandomEmptyCellForGhost(board);
		board[emptyCell.i][emptyCell.j] += 100;
		ghosts_remain--;
		randomColor =
			"#" +
			("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
		ghosts.push(new ghost(emptyCell, randomColor));
	}
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	for (var i = 0; i < lifes; i++) {
		context1.fillStyle = "yellow";
		context1.beginPath();
		context1.arc(250 + 35 * i, 20, 15, 0.15 * Math.PI, 1.85 * Math.PI);
		context1.lineTo(250 + 35 * i, 20);
		context1.fill();
	}

	keysDown = {};

	addEventListener("keyup", handlekeyup, false);
	addEventListener("keydown", handlekeydown, false);
	Draw(); ///////////////
	interval = setInterval(UpdatePosition, 125);
	game_audio.play();
	// clock_interval = setInterval(drawClock, 125);
}

function reassemble() {
	//check
	// tick=0;
	score -= 10;
	board[shape.i][shape.j] -= 2;
	for (i = 0, len = ghosts.length; i < len; i += 1) {
		board[ghosts[i].position.i][ghosts[i].position.j] -= 100;
	}

	var emptyCell = findRandomEmptyCell(board);
	shape = emptyCell;
	board[emptyCell.i][emptyCell.j] = 2;
	pacman_direction = DIRECTION.STILL;

	for (i = 0, len = ghosts.length; i < len; i += 1) {
		emptyCell = findRandomEmptyCellForGhost(board);
		board[emptyCell.i][emptyCell.j] += 100;
		ghosts[i].position = emptyCell;
		ghosts[i].direction = DIRECTION.STILL;
	}
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	for (var i = 0; i < lifes; i++) {
		context1.fillStyle = "yellow";
		context1.beginPath();
		context1.arc(250 + 35 * i, 20, 15, 0.15 * Math.PI, 1.85 * Math.PI);
		context1.lineTo(250 + 35 * i, 20);
		context1.fill();
	}
	time_to_start = TIME_TO_START_C;
	Draw();
	interval = setInterval(UpdatePosition, 125);
	game_audio.play();
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] !== 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return new Position(i, j);
}

//assumption: there is a pacman on the board
function findRandomEmptyCellForGhost(board) {
	var i = shape.i,
		j = shape.j;
	// try {
	while (board[i][j] == 2 || board[i][j] >= 100) {
		//check
		if (Math.random() > 0.5) {
			i = 0;
			j = 9;
		} else {
			i = 9;
			j = Math.random() < 0.5 ? 0 : 9;
		}
	}
	// }

	return new Position(i, j);
}

function GetKeyPressed() {
	if (keysDown[controls["up"]]) {
		pacman_direction = DIRECTION.UP;
		pressedOnce = true;
	} else if (keysDown[controls["down"]]) {
		pacman_direction = DIRECTION.DOWN;
		pressedOnce = true;
	} else if (keysDown[controls["left"]]) {
		pacman_direction = DIRECTION.LEFT;
		pressedOnce = true;
	} else if (keysDown[controls["right"]]) {
		pacman_direction = DIRECTION.RIGHT;
		pressedOnce = true;
	}
}

function Draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); //clean board
	lblScore.innerHTML = score;
	lblTime.innerHTML = Math.ceil(time_elapsed);
	var centerPackmanX;
	var centerPackmanY;
	var centerX;
	var centerY;
	var startAngle;
	var stopAngle;
	var drawPackman = false;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = j * blockSize + blockSize / 2;
			center.y = i * blockSize + blockSize / 2;
			if (board[i][j] === 2) {
				centerPackmanX = center.x;
				centerPackmanY = center.y;
				drawPackman = true;
				switch (pacman_direction.name) {
					case "right":
						startAngle = 0.15 * Math.PI;
						stopAngle = 1.85 * Math.PI;
						centerX = center.x + blockSize / (60 / 5);
						centerY = center.y - blockSize / (60 / 15);
						break;
					case "left":
						startAngle = 1.15 * Math.PI;
						stopAngle = 0.85 * Math.PI;
						centerX = center.x;
						centerY = center.y - blockSize / (60 / 15);
						break;
					case "down":
						startAngle = 0.65 * Math.PI;
						stopAngle = 0.35 * Math.PI;
						centerX = center.x + blockSize / (60 / 15);
						centerY = center.y;
						break;
					case "up":
						startAngle = 1.65 * Math.PI;
						stopAngle = 1.35 * Math.PI;
						centerX = center.x + blockSize / (60 / 15);
						centerY = center.y;
						break;
					case "still":
						startAngle = 0.15 * Math.PI;
						stopAngle = 1.85 * Math.PI;
						centerX = center.x + blockSize / (60 / 5);
						centerY = center.y - blockSize / (60 / 15);
						break;
				}
				context.beginPath();
				context.arc(
					center.x,
					center.y,
					blockSize / (60 / 30),
					startAngle,
					stopAngle
				); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(centerX, centerY, blockSize / (60 / 5), 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] === 5) {
				roundRect(
					context,
					center.x - blockSize / (60 / 8),
					center.y - blockSize / (60 / 8),
					blockSize / (60 / 8),
					blockSize / (60 / 8),
					blockSize / (60 / 2),
					true,
					false,
					color5points
				);
				// context.beginPath();
				// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				// context.fillStyle = color5points; //color
				// context.fill();
			} else if (board[i][j] === 15) {
				roundRect(
					context,
					center.x - blockSize / (60 / 10),
					center.y - blockSize / (60 / 10),
					blockSize / (60 / 10),
					blockSize / (60 / 10),
					blockSize / (60 / 2),
					true,
					false,
					color15points
				);
				// context.beginPath();
				// context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				// context.fillStyle = color15points; //color
				// context.fill();
			} else if (board[i][j] === 25) {
				roundRect(
					context,
					center.x - blockSize / (60 / 14),
					center.y - blockSize / (60 / 14),
					blockSize / (60 / 14),
					blockSize / (60 / 14),
					blockSize / 30,
					true,
					false,
					color25points
				);
				// context.beginPath();
				// context.arc(center.x, center.y, 16, 0, 2 * Math.PI); // circle
				// context.fillStyle = color25points; //color
				// context.fill();
			} else if (board[i][j] === 4) {
				context.beginPath();
				context.rect(
					center.x - blockSize / 2,
					center.y - blockSize / 2,
					blockSize,
					blockSize
				);
				context.fillStyle = "grey"; //color
				context.fill();
			} else if (board[i][j] >= 50 && board[i][j] < 100) {
				center.x = center.x - blockSize / (60 / 22);
				center.y = center.y + blockSize / 6;
				context.fillStyle = "gold"; //////////////////
				context.font = blockSize / (60 / 30) + "px Arial";
				context.fillText("+50", center.x, center.y);
			}
		}
	}
	for (i = 0, len = ghosts.length; i < len; i += 1) {
		ghosts[i].draw(context);
	}
	if (eated && drawPackman) {
		context.beginPath();
		context.arc(
			centerPackmanX,
			centerPackmanY,
			blockSize / (60 / 30),
			0 * Math.PI,
			2 * Math.PI
		); // half circle
		context.lineTo(centerPackmanX, centerPackmanY);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(centerX, centerY, blockSize / (60 / 5), 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		context.beginPath();
		context.arc(
			centerPackmanX,
			centerPackmanY,
			blockSize / (60 / 30),
			startAngle,
			stopAngle
		); // half circle
		context.lineTo(centerPackmanX, centerPackmanY);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(centerX, centerY, blockSize / (60 / 5), 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		eated = false;
		drawPackman = false;
	}
	if (time_to_start > 0) {
		context.fillStyle = "#000";
		context.font = (canvas.height / 2) * 0.15 + "px arial";
		context.fillText(
			Math.ceil(time_to_start / 8),
			canvas.width / 2,
			canvas.height / 2
		);
	}
}

function UpdatePosition() {
	if (time_to_start == 0) {
		if (tick % 2 == 1) {
			for (i = 0, len = ghosts.length; i < len; i += 1) {
				ghosts[i].move();
				if (
					board[shape.i][shape.j] >= 100 &&
					DIRECTION.opposite_direction(ghosts[i].direction, pacman_direction)
				) {
					//////////
					stopGame();
					die_audio.play();
					lifes--;
					if (lifes == 0) {
						context1.clearRect(0, 0, canvas1.width, canvas1.height);
						Swal.fire({
							type: "error",
							title: "You Lost!",
							showCloseButton: true
						});
					} else {
						Swal.fire({
							type: "error",
							title: "You've been eaten!...",
							text: "now you got " + lifes + " more lifes left",
							showCloseButton: true,
							closelButtonText: "Continue"
						}).then((result) => {
							reassemble();
						});
					}
					return;
				}
			}
		}
	}
	tick++;

	board[shape.i][shape.j] -= 2;
	GetKeyPressed();
	if (pressedOnce) {
		if (pacman_direction.name === "up") {
			if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
				shape.i--;
			}
		} else if (pacman_direction.name === "down") {
			if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
				shape.i++;
			}
		} else if (pacman_direction.name === "left") {
			if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
				shape.j--;
			}
		} else if (pacman_direction.name === "right") {
			if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
				shape.j++;
			}
		}
	}
	board[shape.i][shape.j] += 2;

	if (board[shape.i][shape.j] >= 100) {
		Draw();
		stopGame();
		lifes--;
		die_audio.play();
		if (lifes == 0) {
			context1.clearRect(0, 0, canvas1.width, canvas1.height);
			Swal.fire({
				type: "error",
				title: "You Lost!",
				showCloseButton: true
			});
		} else {
			Swal.fire({
				type: "error",
				title: "You've been eaten!...",
				text: "now you got " + lifes + " more lifes left",
				showCloseButton: true,
				confirmButtonText: "Continue"
			}).then((result) => {
				reassemble();
			});
		}
		return;
	}
	board[shape.i][shape.j] -= 2;
	eated = false; //
	if (board[shape.i][shape.j] === 5) {
		score += 5;
		eated = true;
		eat_audio.play();
		// board[shape.i][shape.j] -=5;
	} else if (board[shape.i][shape.j] === 15) {
		score += 15;
		eated = true;
		eat_audio.play();
		// board[shape.i][shape.j] -=15;
	} else if (board[shape.i][shape.j] === 25) {
		score += 25;
		eat_audio.play();
		eated = true;
	} else if (board[shape.i][shape.j] >= 50 && board[shape.i][shape.j] < 100) {
		score += board[shape.i][shape.j];
		eated = true;
		eaten50Points = true;
		bonus__eat_audio.play();
		if (shape.i === bonusX && shape.j === bonusY) {
			bonusX = 11;
			bonusY = 11;
			board[shape.i][shape.j] -= 50;
		}
	}
	if (eated) {
		board[shape.i][shape.j] = 0;
	}
	board[shape.i][shape.j] += 2;
	if (!eaten50Points) {
		if (board[bonusX][bonusY] >= 50) {
			board[bonusX][bonusY] -= 50;
		}
		var random = Math.random();
		if (random < 0.25) {
			//up
			bonusY =
				bonusY === 0 || board[bonusX][bonusY - 1] === 4 ? bonusY : bonusY - 1;
		} else if (random < 0.5) {
			//down
			bonusY =
				bonusY === 9 || board[bonusX][bonusY + 1] === 4 ? bonusY : bonusY + 1;
		} else if (random < 0.75) {
			//left
			bonusX =
				bonusX === 0 || board[bonusX - 1][bonusY] === 4 ? bonusX : bonusX - 1;
		} else if (random < 1) {
			//right
			bonusX =
				bonusX === 9 || board[bonusX + 1][bonusY] === 4 ? bonusX : bonusX + 1;
		}
		board[bonusX][bonusY] += 50;
	}

	var currentTime = new Date();
	time_elapsed = gameTime - (currentTime - start_time) / 1000;
	if (time_elapsed <= 0) {
		lblTime.innerHTML = 0;
		stopGame();
		if (score < 150) {
			Swal.fire({
				type: "error",
				title: "You can do better", //plus score
				text: "you've got " + score + " points",
				showCloseButton: true
			});
		} else {
			winning_audio.play();
			Swal.fire({
				type: "success",
				title: "We have a Winner!!!", //plus score
				text: "you've got " + score + " points",
				showCloseButton: true,
				imageUrl: "imgs/giphy.gif"
			}).then((result) => {
				winning_audio.pause();
				winning_audio.currentTime = 0;
			});
		}
		return;
	} else if (score >= targetScore) {
		Draw();
		stopGame();
		winning_audio.play();
		Swal.fire({
			type: "success",
			title: "We have a Winner!!!", //plus score
			showCloseButton: true,
			imageUrl: "imgs/giphy.gif"
		}).then((result) => {
			winning_audio.pause();
			winning_audio.currentTime = 0;
		});
		return;
	} else {
		Draw();
	}
	if (time_to_start > 0) {
		time_to_start--;
	}
}

function open_tab() {
	document.getElementById(currentPage.pageName).hidden = true;
	currentPage.setPageName(event.srcElement.value);
	document.getElementById(currentPage.pageName).hidden = false;
}

$(document).ready(function() {
	$("#registerForm").validate({
		rules: {
			username: {
				required: true
			},
			password: {
				required: true,
				minlength: 8,
				regexp: "^[a-zA-Z0-9]*$"
			},
			firstname: {
				required: true,
				regexp: "^[a-zA-Z]*$"
			},
			lastname: {
				required: true,
				regexp: "^[a-zA-Z]*$"
			},
			email: {
				required: true,
				email: true
			},
			birthday: {
				required: true
			}
		},
		massages: {
			username: {
				required: "This field cannot be empty"
			},
			password: {
				required: "This field cannot be empty",
				minlength: "password must be at least 8 characters",
				regexp: "password must contain only numbers and letters"
			},
			firstname: {
				required: "This field cannot be empty",
				regexp: "first name must contains only letters"
			},
			lastname: {
				required: "This field cannot be empty",
				regexp: "last name must contains only letters"
			},
			email: {
				required: "This field cannot be empty",
				email: "Please enter a valid email address"
			},
			birthday: {
				required: "This field cannot be empty"
			}
		}
	});
	jQuery.validator.addMethod(
		"regexp",
		function(value, element, regexp) {
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},
		"Please check your input."
	);
});

$("#registerForm").submit(function(e) {
	if ($(this).valid()) {
		var username = document.getElementById("usernameID").value;
		if (usersDataBase[username] == undefined) {
			var password = document.getElementById("passwordID").value;
			usersDataBase[username] = sha256(password);
			Swal.fire("Successful registeration").then((result) => {
				document.getElementById("Welcome").hidden = false;
				currentPage.setPageName("Welcome");
				document.getElementById("Register").hidden = true;
			});
			e.preventDefault();
		} else {
			Swal.fire("There is a user with this username");
			e.preventDefault();
		}
	}
});

function checkLogin() {
	var username = document.getElementById("usernameLoginID").value;
	var password = document.getElementById("passordLoginID").value;
	if (usersDataBase[username] === sha256(password)) {
		var loginForm = document.getElementById("loginForm");
		loginForm.hidden = true;
		var settings = document.getElementById("settings");
		settings.hidden = false;
		currentUser.setUsername(username);
	} else {
		Swal.fire("username or password not exists. Try again");
	}
}

function getGameControl() {
	event.srcElement.value = event.code;
	event.preventDefault();
}

function setRandom() {
	controls["up"] = "ArrowUp";
	controls["right"] = "ArrowRight";
	controls["down"] = "ArrowDown";
	controls["left"] = "ArrowLeft";
	document.getElementById("up").value = "ArrowUp";
	document.getElementById("right").value = "ArrowRight";
	document.getElementById("down").value = "ArrowDown";
	document.getElementById("left").value = "ArrowLeft";

	food_remain = Math.floor(Math.random() * (max_balls - min_balls) + min_balls);
	document.getElementById("range").value = food_remain;
	document.getElementById("range_number").innerHTML = food_remain;

	document.getElementById("5points").value =
		"#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
	document.getElementById("15points").value =
		"#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
	document.getElementById("25points").value =
		"#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);

	document.getElementById("gameTime").value = Math.floor(
		Math.random() * (6000 - 60) + 60
	);

	document.getElementById("num_of_ghosts").value = Math.floor(
		Math.random() * (max_ghosts + 1 - min_ghosts) + min_ghosts
	);
}
$("#settingsForm").submit(function(e) {
	e.preventDefault();
	food_remain = parseInt(document.getElementById("range").value);
	food_remain_new = food_remain;
	var cs = document.getElementsByClassName("controls");
	for (var i = 0; i < cs.length; i++) {
		for (var j = i + 1; j < cs.length; j++) {
			if (cs[i].value == cs[j].value) {
				Swal.fire("controls must be different");
				return;
			}
		}
	}
	for (var i = 0; i < cs.length; i++) {
		controls[cs[i].id] = cs[i].value;
	}
	// controls[event.srcElement.id] = event.code;
	var cs = document.getElementsByClassName("color");
	for (var i = 0; i < cs.length; i++) {
		for (var j = i + 1; j < cs.length; j++) {
			if (cs[i].value === cs[j].value) {
				Swal.fire("colors must be different");
				return;
			}
		}
	}
	gameTime = document.getElementById("gameTime").value;
	gameTime_new = gameTime;
	color5points = document.getElementById("5points").value;
	color15points = document.getElementById("15points").value;
	color25points = document.getElementById("25points").value;
	ghostsNum = document.getElementById("num_of_ghosts").value;
	document.getElementById("settings").hidden = true;
	document.getElementById("game").hidden = false;
	Start();
});

function logout() {
	pressedOnce = false;
	eaten50Points = false;
	pacman_direction = DIRECTION.STILL;
	currentUser.setUsername("");
	var loginForm = document.getElementById("loginForm");
	loginForm.hidden = false;
	var settings = document.getElementById("settings");
	settings.hidden = true;
	var game = document.getElementById("game");
	game.hidden = true;
	resetSettings();
	stopGame();
	open_tab();
}

function stopGame() {
	keysDown = {};
	window.clearInterval(interval);
	game_audio.pause();
	game_audio.currentTime = 0;
}

function resetSettings() {
	controls["up"] = undefined;
	controls["right"] = undefined;
	controls["down"] = undefined;
	controls["left"] = undefined;
	document.getElementById("up").value = "";
	document.getElementById("right").value = "";
	document.getElementById("down").value = "";
	document.getElementById("left").value = "";

	food_remain = undefined;
	document.getElementById("range").value = 50;
	document.getElementById("range_number").innerHTML = 50;

	document.getElementById("5points").value = "#000000";
	document.getElementById("15points").value = "#000000";
	document.getElementById("25points").value = "#000000";

	document.getElementById("gameTime").value = "";

	document.getElementById("num_of_ghosts").value = undefined;
}

function guest_basic() {
	setRandom();
	document.getElementById("settingsForm").submit(new Event());
	currentUser.setUsername("a");
	currentPage.setPageName("Login");
	document.getElementById("Login").hidden = false;
	document.getElementById("loginForm").hidden = true;
	document.getElementById("game").hidden = false;
}

function startNewGame() {
	pressedOnce = false;
	eaten50Points = false;
	pacman_direction = DIRECTION.STILL;
	food_remain = food_remain_new;
	gameTime = gameTime_new;
	stopGame();
	removeEventListener("keydown", handlekeydown);
	removeEventListener("keyup", handlekeyup);
	Start();
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke, fillStyle) {
	if (typeof stroke == "undefined") {
		stroke = true;
	}
	if (typeof radius === "undefined") {
		radius = 5;
	}
	if (typeof radius === "number") {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(
		x + width,
		y + height,
		x + width - radius.br,
		y + height
	);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	ctx.fillStyle = fillStyle;
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}

function showAbout() {
	document.getElementById("About").showModal();
	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
		document.getElementById("About").close();
	};
}
function closeDialog() {
	document.getElementById("About").close();
}

window.onclick = function(e) {
	if (e.target == document.getElementById("About"))
		document.getElementById("About").close();
};

function changeSettings() {
	stopGame();
	removeEventListener("keyup", handlekeyup);
	removeEventListener("keydown", handlekeydown);
	document.getElementById("settings").hidden = false;
	document.getElementById("game").hidden = true;
}

var scroll_flag = true;
function setScroll() {
	document.body.style.overflow = scroll_flag ? "scroll" : "hidden";
	scroll_flag = !scroll_flag;
	document.getElementById("scroll_f").innerHTML =
		(scroll_flag ? "en" : "dis") + "able";
	document.getElementById("scroll_button").className =
		(scroll_flag ? "en" : "dis") + "able";
}
setScroll();
