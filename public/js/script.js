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
    function measurePing() {
        let start = Date.now();
        conn.send(JSON.stringify({ type: 'ping', timestamp: start }));
    }

    // Измеряем пинг каждые 2 секунды
    setInterval(measurePing, 2000);

    conn.addEventListener("message", function (event)
    {
        let dataFromServer = JSON.parse(event.data);

        if (dataFromServer.type === 'pong') {
            let end = Date.now();
            let ping = end - dataFromServer.timestamp;
            console.log(`Ping: ${ping}ms`);
        }

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

        // обновить информацию по зоне
        game.ARENA_RADIUS = dataFromServer.wall;

        // проверить, жива ли змея
        // обновить информацию по змеям
        let mySnake;
        let currentSnake;
        for (let i = 0; i < dataFromServer.users.length; i++)
        {
            currentSnake = dataFromServer.users[i];
            if (currentSnake.name === localStorage.getItem('nickname'))
            {
                mySnake = currentSnake;
                //break;
                // console.log('Me', game.snakeUser.arr[0]);
            }
            else
            {
                if (!(currentSnake.name in game.snakes))
                {
                    game.snakes[currentSnake.name] = new Snake(ctxSnake,
                                                               currentSnake.name,
                                                               currentSnake.x - game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2,
                                                               currentSnake.y - game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2,
                                                               currentSnake.score,
                                                               4,
                                                               currentSnake.radius,
                                                               currentSnake.color);
                }
                else
                {
                    game.snakes[currentSnake.name].arr[0].x = currentSnake.x - game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2;
                    game.snakes[currentSnake.name].arr[0].y = currentSnake.y - game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2;
                    game.snakes[currentSnake.name].score = currentSnake.score;
                    game.snakes[currentSnake.name].radius = currentSnake.radius;
                    game.snakes[currentSnake.name].mainColor = currentSnake.color;
                    // console.log('Other', game.snakes[currentSnake.name].arr[0]);
                }
            }
        }

        if (typeof mySnake === "undefined")
        {
            // console.log('death');
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
    });

    game.init();
}

setTimeout(start, 1000);
