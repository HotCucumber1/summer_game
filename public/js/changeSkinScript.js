const snakeColors = ["#C0392B", "#E74C3C", "#9B59B6", "#8E44AD", "#2980B9",
    "#3498DB", "#17A589", "#138D75", "#229954", "#28B463", "#D4AC0D",
    "#D68910", "#CA6F1E", "#BA4A00"];
const showPrevSkin = document.getElementById("prevSkin");
const showNextSkin = document.getElementById("nextSkin");
const saveSkinButton = document.getElementById("save");
let colorOrder = 0;

let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let game = new Game(ctxSnake, ctxHex);
let snake = new Snake(ctxSnake, 0);
snake.changeColor(snakeColors[colorOrder]);
let WORLD_SIZE = new Point(40000, 20000);
let world = new Point(-20000, -10000);
let backgroundImage = new Image();
backgroundImage.src = "../public/images/background6.png";

function changeColor()
{
    if (this === showNextSkin)
    {
        colorOrder++;
        if (colorOrder === snakeColors.length)
            colorOrder = 0
    }

    if (this === showPrevSkin)
    {
        colorOrder--;
        if (colorOrder === -1)
            colorOrder = snakeColors.length - 1
    }
    snake.changeColor(snakeColors[colorOrder]);
}

function hangleButtonClick(targetURL) {
    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");

    setTimeout(function () {
        window.location.href = targetURL;
    }, 2000);
}

function saveSkin()
{
    localStorage.setItem("mainColor", snakeColors[colorOrder]);
    console.log(localStorage.getItem("mainColor"));
    hangleButtonClick("../pages/menu.html");
}

showPrevSkin.addEventListener('mousedown', changeColor);
showNextSkin.addEventListener('mousedown', changeColor);
saveSkinButton.addEventListener('mousedown', saveSkin);

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
    ctxHex.save();

    ctxHex.fillStyle = "red";
    ctxHex.fillRect(world.x, world.y, WORLD_SIZE.x, WORLD_SIZE.y);

    ctxHex.globalCompositeOperation = "destination-out";
    ctxHex.fillRect(world.x, world.y, WORLD_SIZE.x, WORLD_SIZE.y);

    ctxHex.restore();

    ctxHex.drawImage(backgroundImage, world.x, world.y, WORLD_SIZE.x, WORLD_SIZE.y);

    ctxHex.globalAlpha = 0.5;
    ctxHex.fillRect(world.x, world.y, WORLD_SIZE.x, WORLD_SIZE.y);


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