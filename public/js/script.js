let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);

let d = -Math.PI / 2;


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

canvas.onmousedown = function () {
    game.snakes[0].boost = true;
}

canvas.onmouseup = function () {
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

function start() {
    game.init();
    update();
}


let updateId;
let previousDelta = 0
let fpsLimit = 120;


function update(currentDelta) {
    movement();
    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit)
        return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
    updateId = requestAnimationFrame(update);
}


conn.addEventListener("message", function (event) {
    let dataFromServer = JSON.parse(event.data);

    game.foods = [];
    for (let i= 0; i < dataFromServer.points.length; i++)
    {
        game.foods.push(
            new Food(
                ctxSnake,
                dataFromServer.points[i].x - game.snakes[0].pos.x,
                dataFromServer.points[i].y - game.snakes[0].pos.y,
                dataFromServer.points[i].color
            )
        );
    }
    update();
});


start();