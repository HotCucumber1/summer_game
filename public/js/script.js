let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxFood = document.getElementById("canvasFood").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxFood, ctxHex);

let d = -Math.PI / 2;
canvas.onmousemove = function (e) {
    cursor = ut.getMousePos(canvas, e);
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

    game.snakes[0].changeAngle(d);
}

canvas.onmousedown = function () {
    game.snakes[0].boost = true;
}

canvas.onmouseup = function () {
    game.snakes[0].boost = false;
    game.snakes[0].intervalId = null;
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

function start() {
    game.init();
    update();
}


let updateId,
    previousDelta = 0,
    fpsLimit = 38;


function update(currentDelta) {
    updateId = requestAnimationFrame(update);
    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    //clear all
    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxFood.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    //draw all
    game.draw();
}


start();