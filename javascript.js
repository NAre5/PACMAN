var NONE        = 4,
    UP          = 3,
    LEFT        = 2,
    DOWN        = 1,
    RIGHT       = 11,
    WAITING     = 5,
    PAUSE       = 6,
    PLAYING     = 7,
    COUNTDOWN   = 8,
    EATEN_PAUSE = 9,
    DYING       = 10,
    Pacman      = {};

var context = canvas.getContext('2d');
var shape;// = new Position();
var board;//0 is nothing, 1 is food, 2 is pacman, 3 is ghost, 5 is 5pointfood, 15 is 15pointfood, 25 is 25pointfood, 50 is 50pointfood
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var food_remain;

var Position = function (i, j) {
    // var i= i,
    //     j= j;
    this.i = i;
    this.j = j;
}

var DIRECTION = {
    UP: { direction: new Position(1, 0), name: "up", code: "" },
    DOWN: { direction: new Position(-1, 0), name: "down", code: "" },
    LEFT: { direction: new Position(0, -1), name: "left", code: "" },
    RIGHT: { direction: new Position(0, 1), name: "right", code: "" }
};


var direction;
// var direction = "right";
// var direction = DIRECTION


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
var ghost = function (position) {
    var position = position,
        direction = RIGHT;//typeof DIRECTION
    // color

    function draw(ctx) {
        var blockSize=60;

        var s = blockSize,
            top = (position.j / 10) * s,
            left = (position.i / 10) * s;


        var tl = left + s;
        var base = top + s - 3;
        var inc = s / 10;

        // var high = game.getTick() % 10 > 5 ? 3 : -3;
        // var low = game.getTick() % 10 > 5 ? -3 : 3;
        var high = 3;
        var low = -3;

        ctx.fillStyle = "#0000BB";
        ctx.beginPath();

        ctx.moveTo(left, base);

        ctx.quadraticCurveTo(left, top, left + (s / 2), top);
        ctx.quadraticCurveTo(left + s, top, left + s, base);

        // Wavy things at the bottom
        ctx.quadraticCurveTo(tl - (inc * 1), base + high, tl - (inc * 2), base);
        ctx.quadraticCurveTo(tl - (inc * 3), base + low, tl - (inc * 4), base);
        ctx.quadraticCurveTo(tl - (inc * 5), base + high, tl - (inc * 6), base);
        ctx.quadraticCurveTo(tl - (inc * 7), base + low, tl - (inc * 8), base);
        ctx.quadraticCurveTo(tl - (inc * 9), base + high, tl - (inc * 10), base);

        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.arc(left + 6, top + 6, s / 6, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
        ctx.closePath();
        ctx.fill();

        var f = s / 12;
        var off = {};
        off[RIGHT] = [f, 0];
        off[LEFT] = [-f, 0];
        off[UP] = [0, -f];
        off[DOWN] = [0, f];

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(left + 6 + off[direction][0], top + 6 + off[direction][1],
            s / 15, 0, 300, false);
        ctx.arc((left + s) - 6 + off[direction][0], top + 6 + off[direction][1],
            s / 15, 0, 300, false);
        ctx.closePath();
        ctx.fill();
    }
    return{
        "position":position,
        "direction":direction,
        "draw":draw
    };
};
var ghosts = [];//the ghosts of the game

var usersDataBase = { "a": sha256("a") };
var controls = { "left": undefined, "right": undefined, "up": undefined, "down": undefined };
// var controls = {};

var currentUser = {
    username: "",
    setUsername: function (username1) {
        this.username = username1;
        document.getElementById("current_user").innerHTML = username1;
    }
};
var currentPage = {
    pageName: "Welcome",
    setPageName: function (pageName1) {
        if (this.pageName == "Register") {
            document.getElementById("registerForm").reset();
        }
        this.pageName = pageName1;

    }
};

var MyVar = {
    prop1: "Foo",
    prop2: "Bar",
    events: {},

    setProp1: function (prop1) {
        this.prop1 = prop1;
        this.notify('prop1', this.prop1);
    }
};

document.getElementById("range").oninput = function () {
    document.getElementById("range_number").innerHTML = this.value;
}

// alert(sha256("message"));

// Start();

function Start() {
    board = new Array();
    score = 0;
    pac_color = "yellow";
    pacman_remain = 1;
    eaten50Points = false;
    pressedOnce = false;
    var num5Point = Math.round(0.6 * food_remain);
    var num15Point = Math.round(0.3 * food_remain);
    var num25Point = food_remain - num5Point - num15Point;
    targetScore = 0;
    targetScore = 5 * num5Point + 15 * num15Point + 25 * num25Point + 50;
    var cnt = 100;
    var pacman_remain = 1;
    var ghosts_remain = ghostsNum;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = 4;
            }
            else if ((i === 0 && j === 0)) {
                board[i][j] = 50;
                bonusX = i;
                bonusY = j;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    var randomNum2 = Math.random();
                    var sum = num5Point + num15Point + num25Point;
                    var percent5 = num5Point / sum;
                    var precent15 = num15Point / sum;
                    var precent25 = num25Point / sum;
                    if (randomNum2 < percent5) {
                        num5Point--;
                        board[i][j] = 5;
                    }
                    else if (randomNum2 < precent15 + percent5) {
                        num15Point--;
                        board[i][j] = 15;
                    }
                    else if (randomNum2 < precent25 + precent15 + percent5) {
                        num25Point--;
                        board[i][j] = 25;
                    }
                    food_remain--;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
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
    // if (pacman_remain > 0) {
    //     var emptyCell = findRandomEmptyCell(board);
    //     board[emptyCell.i][emptyCell.j] = 2;
    //     pacman_remain--;
    // }
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
    while (ghosts_remain > 0) {
        var emptyCell = findRandomEmptyCellForGhost(board);
        board[emptyCell.i][emptyCell.j] = 3;
        ghosts_remain--;
        ghosts.push(new ghost(emptyCell));
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(UpdatePosition, 125);
}


function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return new Position(i, j);
}

//assumption: there is a pacman on the board
function findRandomEmptyCellForGhost(board) {
    var i = shape.i,
        j = shape.j;
    try {
        while (board[i][j] == 2)//check
        {
            if (Math.random > 0.5) {
                i = 0;
                j = Math.floor((Math.random() * 9) + 1);
            }
            else {
                i = Math.floor((Math.random() * 9) + 1);
                j = 0;
            }
        }
    } catch (error) {
        alert();
    };
    return new Position(i, j);
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown[controls['up']]) {
        direction = "up";
        pressedOnce = true;
    }
    else if (keysDown[controls['down']]) {
        direction = "down";
        pressedOnce = true;
    }
    else if (keysDown[controls['left']]) {
        direction = "left";
        pressedOnce = true;
    }
    else if (keysDown[controls['right']]) {
        direction = "right";
        pressedOnce = true;
    }
}

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed
    var centerPackmanX;
    var centerPackmanY;
    var centerX;
    var centerY;
    var startAngel;
    var stopAngel;
    var drawPackman = false;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] === 2) {
                centerPackmanX = center.x;
                centerPackmanY = center.y;
                drawPackman = true;
                switch (direction) {
                    case "right":
                        startAngel = 0.15 * Math.PI;
                        stopAngel = 1.85 * Math.PI;
                        centerX = center.x + 5;
                        centerY = center.y - 15;
                        break;
                    case "left":
                        startAngel = 1.15 * Math.PI;
                        stopAngel = 0.85 * Math.PI;
                        centerX = center.x;
                        centerY = center.y - 15;
                        break;
                    case "down":
                        startAngel = 0.65 * Math.PI;
                        stopAngel = 0.35 * Math.PI;
                        centerX = center.x + 15;
                        centerY = center.y;
                        break;
                    case "up":
                        startAngel = 1.65 * Math.PI;
                        stopAngel = 1.35 * Math.PI;
                        centerX = center.x + 15;
                        centerY = center.y;
                        break;
                }
                context.beginPath();
                context.arc(center.x, center.y, 30, startAngel, stopAngel); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(centerX, centerY, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();


            } else if (board[i][j] === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
                context.fillStyle = color5points; //color
                context.fill();
            } else if (board[i][j] === 15) {
                context.beginPath();
                context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
                context.fillStyle = color15points; //color
                context.fill();
            } else if (board[i][j] === 25) {
                context.beginPath();
                context.arc(center.x, center.y, 16, 0, 2 * Math.PI); // circle
                context.fillStyle = color25points; //color
                context.fill();
            }
            else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "grey"; //color
                context.fill();
            } else if (board[i][j] == 3) {

            }
            else if (board[i][j] >= 50) {
                center.x = center.x - 15;
                center.y = center.y + 10;
                context.fillStyle = "gold"
                context.font = "30px Arial";
                context.fillText("50", center.x, center.y);
            }
        }

    }
    // for (i = 0, len = ghosts.length; i < len; i += 1) {
    //     ghosts[i].draw(context);
    // }
    if (eated && drawPackman) {
        context.beginPath();
        context.arc(centerPackmanX, centerPackmanY, 30, 0 * Math.PI, 2 * Math.PI); // half circle
        context.lineTo(centerPackmanX, centerPackmanY);
        context.fillStyle = pac_color; //color
        context.fill();
        context.beginPath();
        context.arc(centerX, centerY, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
        context.beginPath();
        context.arc(centerPackmanX, centerPackmanY, 30, startAngel, stopAngel); // half circle
        context.lineTo(centerPackmanX, centerPackmanY);
        context.fillStyle = pac_color; //color
        context.fill();
        context.beginPath();
        context.arc(centerX, centerY, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color
        context.fill();
        eated = false;
        drawPackman = false;
    }

}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    GetKeyPressed();
    if (pressedOnce) {
        if (direction === "up") {
            if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
                shape.j--;
            }
        }
        else if (direction === "down") {
            if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
                shape.j++;
            }
        }
        else if (direction === "left") {
            if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
                shape.i--;
            }
        }
        else if (direction === "right") {
            if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
                shape.i++;
            }
        }
    }
    if (board[shape.i][shape.j] === 5) {
        score += 5;
        eated = true;
    }
    if (board[shape.i][shape.j] === 15) {
        score += 15;
        eated = true;

    }
    if (board[shape.i][shape.j] === 25) {
        score += 25;
        eated = true;
    }
    if (board[shape.i][shape.j] === 50) {
        score += 50;
        eated = true;
        eaten50Points = true;
    }
    if (!eaten50Points) {
        board[bonusX][bonusY] -= 50;
        var random = Math.random();
        if (random < 0.25) {
            bonusX = ((bonusX === 0 || board[bonusX - 1][bonusY] === 4) ? bonusX : bonusX - 1);
        }
        else if (random < 0.5) {
            bonusX = ((bonusX === 9 || board[bonusX + 1][bonusY] === 4) ? bonusX : bonusX + 1);
        }
        else if (random < 0.75) {
            bonusY = ((bonusY === 0 || board[bonusX][bonusY - 1] === 4) ? bonusY : bonusY - 1);
        }
        else if (random < 1) {
            bonusY = ((bonusY === 9 || board[bonusX][bonusY + 1] === 4) ? bonusY : bonusY + 1);
        }
        board[bonusX][bonusY] += 50;
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = gameTime - ((currentTime - start_time) / 1000);
    if (time_elapsed <= 0) {
        lblTime.value = 0;
        stopGame();
        if (score < 150) {
            alert("You can do better");
        }
        else {
            alert("We have a Winner!!!")
        }

    }
    else if (score === targetScore) {
        Draw();
        stopGame();
        window.alert("Game completed");
    } else {
        var canvas = document.getElementById("canvas");
        blockSize = canvas.offsetWidth / 10;
        canvas.setAttribute("width", (blockSize * 10) + "px");
        canvas.setAttribute("height", (blockSize * 10) + 30 + "px");
        Draw();
    }
}


function open_tab() {
    document.getElementById(currentPage.pageName).hidden = true;
    currentPage.setPageName(event.srcElement.value);
    document.getElementById(currentPage.pageName).hidden = false;
}

$(document).ready(function () {
    $("#registerForm").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true,
                minlength: 8,
                regexp: '^[a-zA-Z0-9]*$'
            },
            firstname: {
                required: true,
                regexp: '^[a-zA-Z]*$'
            },
            lastname: {
                required: true,
                regexp: '^[a-zA-Z]*$'
            },
            email: {
                required: true,
                email: true
            },
            birthday: {
                required: true,
            }
        },
        massages: {
            username: {
                required: "This field cannot be empty",
            },
            password: {
                required: "This field cannot be empty",
                minlength: "password must be at least 8 characters",
                regexp: "password must contain only numbers and letters",
            },
            firstname: {
                required: "This field cannot be empty",
                regexp: "first name must contains only letters",
            },
            lastname: {
                required: "This field cannot be empty",
                regexp: "last name must contains only letters",
            },
            email: {
                required: "This field cannot be empty",
                email: "Please enter a valid email address"
            },
            birthday: {
                required: "This field cannot be empty",
            }
        }
    });
    jQuery.validator.addMethod(
        'regexp',
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );
});

$("#registerForm").submit(function (e) {
    if ($(this).valid()) {
        var username = document.getElementById("usernameID").value;
        if (usersDataBase[username] == undefined) {
            var password = document.getElementById("passwordID").value;
            usersDataBase[username] = sha256(password)
            alert("Successful registeration");
            e.preventDefault();
        }
        else {
            alert("There is a user with this username");
        }
    }
});

function checkLogin() {
    var username = document.getElementById("usernameLoginID").value
    var password = document.getElementById("passordLoginID").value
    if (usersDataBase[username] === sha256(password)) {
        var loginForm = document.getElementById("loginForm");
        loginForm.hidden = true;
        var settings = document.getElementById("settings");
        settings.hidden = false;
        currentUser.setUsername(username);
    }
    else {
        alert("username or password not exists. Try again")
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

    document.getElementById("5points").value = "#" + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
    document.getElementById("15points").value = "#" + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
    document.getElementById("25points").value = "#" + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);

    document.getElementById("gameTime").value = Math.floor(Math.random() * (600000 - 60) + 60);

    document.getElementById("num_of_ghosts").value = Math.floor(Math.random() * (max_ghosts + 1 - min_ghosts) + min_ghosts);
}
$("#settingsForm").submit(function (e) {
    e.preventDefault();
    food_remain = parseInt(document.getElementById("range").value);
    food_remain_new = food_remain;
    var cs = document.getElementsByClassName("controls");
    for (var i = 0; i < cs.length; i++) {
        for (var j = i + 1; j < cs.length; j++) {
            if (cs[i].value == cs[j].value) {
                alert("controls must be different");
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
                alert("colors must be different");
                return;
            }
        }
    }
    gameTime = document.getElementById("gameTime").value
    gameTime_new = gameTime;
    color5points = document.getElementById("5points").value
    color15points = document.getElementById("15points").value
    color25points = document.getElementById("25points").value
    ghostsNum = document.getElementById("num_of_ghosts").value
    document.getElementById("settings").hidden = true;
    document.getElementById("game").hidden = false;
    Start();
});

function logout() {
    pressedOnce = false;
    eaten50Points = false;
    pacman_remain = 1
    direction = "right";
    currentUser.setUsername("");
    var loginForm = document.getElementById("loginForm");
    loginForm.hidden = false;
    var settings = document.getElementById("settings");
    settings.hidden = true;
    var game = document.getElementById("game");
    game.hidden = true;
    resetSettings();
    stopGame();
}

function stopGame() {
    window.clearInterval(interval);
    //audio.pause();
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
    setSetings();
    open_tab();
    currentUser.setUsername("a");
    document.getElementById("loginForm").hidden = true;
    document.getElementById("game").hidden = false;
}

// Object.prototype.clone = function () {
//     var i, newObj = (this instanceof Array) ? [] : {};
//     for (i in this) {
//         if (i === 'clone') {
//             continue;
//         }
//         if (this[i] && typeof this[i] === "object") {
//             newObj[i] = this[i].clone();
//         } else {
//             newObj[i] = this[i];
//         }
//     }
//     return newObj;
// };
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startNewGame() {
    pressedOnce = false;
    eaten50Points = false;
    direction = "right";
    food_remain = food_remain_new;
    gameTime = gameTime_new;
    pacman_remain = 1;
    stopGame();
    Start();
}
