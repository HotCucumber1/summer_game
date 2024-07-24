let canvas = document.getElementById("canvasSnake");
let canvasHex = document.getElementById("canvasHex");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);
let gameEnd = false;

let d = -Math.PI / 2;

window.addEventListener("load", function () {
    document.body.classList.add("fade-in");
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

function fireworksEffect (fireworksCanvas, victoryText) {
    let firework = JS_FIREWORKS.Fireworks({
        id: 'fireworks-canvas',
        hue: 120,
        particleCount: 70,
        delay: 0,
        minDelay: 20,
        maxDelay: 40,
        boundaries: {
            top: 50,
            bottom: 240,
            left: 50,
            right: 1550
        },
        fireworkSpeed: 2,
        fireworkAcceleration: 1.05,
        particleFriction: .95,
        particleGravity: 1.5
    });
    victoryText.style.display = "block";
    firework.start();
    setTimeout(() => {
        firework.stop();
        fireworksCanvas.style.opacity = '0';
        setTimeout(()=>{
            canvas.style.display = "none";
            victoryText.style.display = "none";
            fireworksCanvas.remove();
            window.location.href = "menu.html"
        }, 7000)
    }, 7000)
}

function victory() {
    gameEnd = true;
    game.globalCompositeOperation = "";
    game.ctxFillStyle = "green";
    canvas.style.transition = ".7s ease-out";
    canvas.style.opacity = "0";
    game.snakes[0].boost = false;

    const gameDiv = document.getElementById("game");
    const fireworksCanvas = document.createElement("canvas");
    const victoryText =  document.getElementById("victory-text");
    gameDiv.appendChild(fireworksCanvas);
    fireworksCanvas.classList.add("fireworks-canvas");
    fireworksCanvas.id = 'fireworks-canvas';
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    fireworksEffect(fireworksCanvas, victoryText);
}

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
    if ((game.snakes.length === 1) && (gameEnd === false))
    {
        victory();
    }

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}

start();