let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let game = new Game(ctxSnake, ctxHex);
let snake = new Snake(ctxSnake, 0);
let WORLD_SIZE = new Point(40000, 20000);
let world = new Point(-20000, -10000);
let backgroundImage = new Image();
backgroundImage.src = "../public/images/background6.png";

function snakeInit()
{
    snake.changeAngle(0);

    snake.length = 40;
    for (let i = 0; i < 40; i++) {
        snake.arr.push(new Point(snake.pos.x, snake.pos.y));
        snake.headPath.push(new Point(snake.pos.x, snake.pos.y));
    }
    snake.defaultSpeed = 7;
}

function draw()
{
    ctxHex.drawImage(backgroundImage, world.x, world.y, WORLD_SIZE.x, WORLD_SIZE.y);

    world.x -= snake.velocity.x;
    world.y -= snake.velocity.y;

    if (snake.state === 0)
    {
        snake.move();
    }
}


function start() {
    snakeInit()
    update();
}


let updateId
let previousDelta = 0
let fpsLimit = 120;


function update(currentDelta) {
    updateId = requestAnimationFrame(update);

    let delta = currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit) return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    draw();
}

start();