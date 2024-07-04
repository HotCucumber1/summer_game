// создаем подключение к ws серверу
const serverAdress = '10.250.104.40'; // нужно изменить на катуальный 
const socketPort = 8080;  // при необходимости заменить
const wsConnect = new WebSocket('ws:/' + serverAdress + ':' + socketPort);

let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxFood = document.getElementById("canvasFood").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxFood, ctxHex);

let d = -Math.PI / 2;

// события WebSocket
wsConnect.onopen = function () {
    console.log('подключился к серверу');   // для отладки, потом можно убрать
}

wsConnect.onerror = function (e) {          // ошибка
    console.log('Websocket error:', e);
}

canvas.onmousemove = function (e) {
    cursor = ut.getMousePos(canvas, e);
}

const sendMouseMove = setInterval(function () {
    console.log(JSON.stringify({        // для отладки, нужно будет удалить
        Snake: {
            mouseX: cursor.x,
            mouseY: cursor.y,
            up: false,
            down: false,
            left: false,
            right: false,
            boost:  game.snakes[0].boost
        },
        winProp: {
            windowH: canvas.height,
            windowW: canvas.width
        }
    }));

    // === для отладки

    // console.log(JSON.parse(JSON.stringify({
    //     Snake: {
    //         mouseX: cursor.x,
    //         mouseY: cursor.y,
    //         up: false,
    //         down: false,
    //         left: false,
    //         right: false,
    //         boost:  game.snakes[0].boost
    //     },
    //     winProp: {
    //         windowH: canvas.height,
    //         windowW: canvas.width
    //     }
    // })));

    // let dataFromServer = JSON.parse(JSON.stringify({
    //     Snake: {
    //         mouseX: cursor.x,
    //         mouseY: cursor.y,
    //         up: false,
    //         down: false,
    //         left: false,
    //         right: false,
    //         boost:  game.snakes[0].boost
    //     },
    //     winProp: {
    //         windowH: canvas.height,
    //         windowW: canvas.width
    //     }
    // }));

    // console.log('new Data:', dataFromServer.Snake);

    // ===

    // отправка на wsServer
    // wsConnect.send(JSON.stringify({
    //     Snake: {
    //         mouseX: cursor.x,
    //         mouseY: cursor.y,
    //         up: false,
    //         down: false,
    //         left: false,
    //         right: false,
    //         boost: false
    //     },
    //     winProp: {
    //         windowH: canvas.height,
    //         windowW: canvas.width
    //     }
    // }));

}, 1000);

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
    console.log(JSON.stringify({        // для отладки, нужно будет удалить
        Snake: {
            mouseX: cursor.x,
            mouseY: cursor.y,
            up: false,
            down: false,
            left: false,
            right: false,
            boost: game.snakes[0].boost
        },
        winProp: {
            windowH: canvas.height,
            windowW: canvas.width
        }
    }));
    // wsConnect.send(JSON.stringify({
    //     Snake: {
    //         mouseX: cursor.x,
    //         mouseY: cursor.y,
    //         up: false,
    //         down: false,
    //         left: false,
    //         right: false,
    //         boost: game.snakes[0].boost
    //     },
    //     winProp: {
    //         windowH: canvas.height,
    //         windowW: canvas.width
    //     }
    // }));
}

canvas.onmouseup = function () {
    game.snakes[0].boost = false;
    game.snakes[0].intervalId = null;
    console.log(JSON.stringify({        // для отладки, нужно будет удалить
        Snake: {
            mouseX: cursor.x,
            mouseY: cursor.y,
            up: false,
            down: false,
            left: false,
            right: false,
            boost: game.snakes[0].boost
        },
        winProp: {
            windowH: canvas.height,
            windowW: canvas.width
        }
    }));
    // wsConnect.send(JSON.stringify({
    //     Snake: {
    //         mouseX: cursor.x,
    //         mouseY: cursor.y,
    //         up: false,
    //         down: false,
    //         left: false,
    //         right: false,
    //         boost: game.snakes[0].boost
    //     },
    //     winProp: {
    //         windowH: canvas.height,
    //         windowW: canvas.width
    //     }
    // }));
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


let updateId
let previousDelta = 0
let fpsLimit = 120;


function update(currentDelta) {
    updateId = requestAnimationFrame(update);
    movement();

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxFood.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}

wsConnect.addEventListener("message", function (event) {
    console.log('message from server:');            // для отладки, нужно будет удалить
    console.log(JSON.parse(event.data));            // для отладки, нужно будет удалить
    let dataFromServer = JSON.parse(event.data);
    // здесь нужно будет присваивать значения полученные с сервера

    update();
});


start();