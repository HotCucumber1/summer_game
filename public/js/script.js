let canvas = document.getElementById("canvasSnake");
let canvas2 = document.getElementById("canvasHex");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);

const lobby = document.getElementById("lobby");
const gameCont = document.getElementById("gameCont");
const strt = document.getElementById("start");
let st = false;
let d = -Math.PI / 2;


strt.addEventListener("click", () => {
    lobby.classList.remove("fade-in");
    lobby.classList.add("fade-out");
    lobby.style.display = "none";
    gameCont.style.display = "block";
    gameCont.classList.add("fade-in");
    start();
});

canvas.onmousemove = function (e) {
    cursor = ut.getMousePos(canvas, e);
}

function movement() {
    let a = ut.getAngle(game.snakes[0].arr[0], cursor);
    let delta = a - d;

    if (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    if (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }

    if (delta > 0) {
        d += Math.PI / 32;
    } else if (delta < 0) {
        d -= Math.PI / 32;
    }

    if (d > Math.PI) {
        d -= 2 * Math.PI
    }

    if (d < -Math.PI) {
        d += 2 * Math.PI
    }

    game.snakes[0].changeAngle(d);
}

canvas.onmousedown = function () {
    game.snakes[0].boost = true;
}

canvas.onmouseup = function () {
    game.snakes[0].boost = false;
}

canvas.onmouseout = function () {
    game.snakes[0].boost = false;
}

window.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        game.snakes[0].boost = true;
    }
});

window.addEventListener('keyup', function (event) {
    if (event.key === ' ') {
        game.snakes[0].boost = false;
    }
});

function canvasSize(snakeSize) {
    let scale = Math.log10(snakeSize);
    document.body.style.zoom = 1 / scale;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas2.width = window.innerWidth * scale;
    canvas2.height = window.innerHeight * scale;
    game.snakes[0].camera.width = window.innerWidth * scale;
    game.snakes[0].camera.height = window.innerHeight * scale;

    console.log(cursor);
    console.log(game.snakes[0].arr[0]);
}

// function endGame() {
//     if (game.snakes.length === 1)
//     {
//         fireworks.firework.start();
//     }
// }

function start() {
    game.init();
    update();
}


let updateId
let previousDelta = 0
let fpsLimit = 120;


function update(currentDelta) {
    // canvasSize(game.snakes[0].size);
    updateId = requestAnimationFrame(update);
    movement();
    // endGame();

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}
