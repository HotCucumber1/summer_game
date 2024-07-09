let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxFood = document.getElementById("canvasFood").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxFood, ctxHex);

let d = -Math.PI / 2;


conn.onmessage = function (event) {
    let data = JSON.parse(event.data);
    let snake = data['snake'];
    let points = data['points'];
    console.log(snake);
}

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
    game.snakes[0].changeAngle(d);
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


let updateId
let previousDelta = 0
let fpsLimit = 120;

function update(currentDelta) {
    updateId = requestAnimationFrame(update);
    movement();

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit)
        return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxFood.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}

function start() {
    game.init();
    update();
}

start();