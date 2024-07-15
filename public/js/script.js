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
    let a = ut.getAngle(game.snakeUser.arr[0], cursor);
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
    game.snakeUser.changeAngle(d);
}

canvas.onmousedown = function () {
    game.snakeUser.boost = true;
}

canvas.onmouseup = function () {
    game.snakeUser.boost = false;
}

window.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        game.snakeUser.boost = true;
    }
});

window.addEventListener('keyup', function (event) {
    if (event.key === ' ') {
        game.snakeUser.boost = false;
    }
});

function start()
{
    conn.addEventListener("message", function (event) {

        let dataFromServer = JSON.parse(event.data);
        console.log(JSON.stringify(dataFromServer.users[dataFromServer.users.length - 1], null, 4));

        // обновить информацию по точкам
        game.foods = [];
        for (let i= 0; i < dataFromServer.points.length; i++)
        {
            game.foods.push(
                new Food(
                    ctxSnake,
                    dataFromServer.points[i].x - game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2,
                    dataFromServer.points[i].y - game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2,
                    dataFromServer.points[i].color
                )
            );
        }

        // обновить информацию по змеям
        game.snakes = [];
        for (let i = 0; i < dataFromServer.users.length; i++)
        {

        }

        // обновить информацию по зоне
        game.ARENA_RADIUS = dataFromServer.wall;

        // проверить, жива ли змея
        let mySnake;
        for (let i = 0; i < dataFromServer.users.length; i++)
        {
            if (dataFromServer.users[i].name === localStorage.getItem('nickname'))
            {
                mySnake = dataFromServer.users[i];
                break;
            }
        }

        if (typeof mySnake === "undefined")
        {
            console.log('death');
            game.snakeUser.die();
        }
        else
        {
            // обновить счет
            game.snakeUser.score = mySnake.score;

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
                        x: game.snakeUser.pos.x,
                        y: game.snakeUser.pos.y,
                        radius: game.snakeUser.size,
                        score: game.snakeUser.score,
                        body: game.snakeUser.arr
                    }
                };
                conn.send(JSON.stringify(data));
            }
            counter = (counter + 1) % 2;
        }
    });

    game.init();
}

setTimeout(start, 500);
