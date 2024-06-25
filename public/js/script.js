var canvas = document.getElementById("canvasSnake");
var ctxSnake = document.getElementById("canvasSnake").getContext("2d");
var ctxHex = document.getElementById("canvasHex").getContext("2d");
var ut = new Util();
var cursor = new Point(0, 0);
var game = new Game(ctxSnake, ctxHex);

canvas.onmousemove = function(e){
    cursor = ut.getMousePos(canvas, e);
    let ang = ut.getAngle(game.snakes[0].arr[0], cursor);
    game.snakes[0].changeAngle(ang);
}

canvas.onmousedown = function(e){
    game.snakes[0].boost = true;
}

canvas.onmouseup = function(e){
    game.snakes[0].boost = false;
    game.snakes[0].intervalId = null;
}

window.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        game.snakes[0].boost = true;
    }
});

window.addEventListener('keyup', function(event) {
    if (event.key === ' ') {
        game.snakes[0].boost = false;
    }
});

function start(){
    game.init();
    update();
}


var updateId,
    previousDelta = 0,
    fpsLimit = 20;
function update(currentDelta){
    updateId = requestAnimationFrame(update);
    var delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    //clear all
    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    //draw all
    game.draw();
}


start();