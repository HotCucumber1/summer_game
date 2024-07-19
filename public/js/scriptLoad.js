// создаем подключение к ws серверу
const serverAdress = '10.250.104.40'; // нужно изменить на катуальный
const socketPort = 8080;  // при необходимости заменить
const wsConnect = new WebSocket('ws:/' + serverAdress + ':' + socketPort);

let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);

let directionSnake = 0;

window.addEventListener("load", () => document.body.classList.add("fade-in"));

function movement() {
    let angle = ut.getAngle(game.snakes[0].arr[0], cursor);
    let delta = angle - directionSnake;

    if (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    if (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }

    if (delta > 0) {
        directionSnake += Math.PI / 32;
    } else if (delta < 0) {
        directionSnake += Math.PI / 32;
    }

    if (directionSnake > Math.PI) {
        directionSnake -= 2 * Math.PI
    }

    if (directionSnake < -Math.PI) {
        directionSnake += 2 * Math.PI
    }

    game.snakes[0].changeAngle(directionSnake);
}

function start() {
    game.init();
    update();
}


let updateId;
let previousDelta = 0;
let fpsLimit = 120;


function update(currentDelta) {
    updateId = requestAnimationFrame(update);
    movement();

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}

start();