let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);

let d = -Math.PI / 2;

let counter = 0;


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

    if (delta >= 0)
    {
        d += Math.PI / 32;
    }
    else
    {
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


let previousDelta= 0;
let fpsLimit= 120;


conn.addEventListener("message", function (event) {
    let dataFromServer = JSON.parse(event.data);
    console.log(dataFromServer);

    // обновить информацию по точкам
    game.foods = [];
    for (let i= 0; i < dataFromServer.points.length; i++)
    {
        game.foods.push(
            new Food(
                ctxSnake,
                dataFromServer.points[i].x - game.snakes[0].pos.x + game.SCREEN_SIZE.x / 2,
                dataFromServer.points[i].y - game.snakes[0].pos.y + game.SCREEN_SIZE.y / 2,
                   dataFromServer.points[i].color
            )
        );
    }

    // новить информацию по зоне
    game.ARENA_RADIUS = dataFromServer.wall;

    // проверить, жива ли змея
    if (Object.keys(dataFromServer.snake).length === 0)
    {
        console.log('hy');
        game.snakes[0].die();
    }
    else
    {
        // обновить счет
        game.snakes[0].score = dataFromServer.snake.score;

        // движение
        movement();

        ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
        ctxHex.clearRect(0, 0, canvas.width, canvas.height);

        game.draw();

        // отправить обновленные данные на бэк
        if (counter % 2 === 0)
        {
            let data = {
                snake: {
                    id: 0,
                    x: game.snakes[0].pos.x,
                    y: game.snakes[0].pos.y,
                    radius: game.snakes[0].size,
                    score: game.snakes[0].score,
                    body: game.snakes[0].arr
                }
            };
            conn.send(JSON.stringify(data));
        }
        counter = (counter + 1) % 2;
    }
});


game.init();