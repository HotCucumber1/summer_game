let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);

let d = -Math.PI / 2;

canvas.onmousemove = function (e)
{
    cursor = ut.getMousePos(canvas, e);
}

function movement()
{
    let a = ut.getAngle(game.snakeUser.arr[0], cursor);
    let delta = a - d;

    if (delta > Math.PI)
    {
        delta -= 2 * Math.PI;
    }
    if (delta < -Math.PI)
    {
        delta += 2 * Math.PI;
    }
    if (delta > 0)
    {
        d += Math.PI / 32;
    }
    else if (delta < 0)
    {
        d -= Math.PI / 32;
    }
    if (d > Math.PI)
    {
        d -= 2 * Math.PI;
    }
    if (d < -Math.PI)
    {
        d += 2 * Math.PI;
    }
    game.snakeUser.changeAngle(d);
}

canvas.onmousedown = function ()
{
    game.snakeUser.boost = true;
}

canvas.onmouseup = function ()
{
    game.snakeUser.boost = false;
}

window.addEventListener('keydown', function (event)
{
    if (event.key === ' ')
    {
        game.snakeUser.boost = true;
    }
});

window.addEventListener('keyup', function (event)
{
    if (event.key === ' ')
    {
        game.snakeUser.boost = false;
    }
});

function start()
{
    function measurePing()
    {
        let start = Date.now();
        conn.send(JSON.stringify(
            {
                type: 'ping',
                timestamp: start,
            }
        ));
    }

    // Измеряем пинг каждые 2 секунды
    setInterval(measurePing, 2000);

    conn.addEventListener("message", function (event)
    {
        let dataFromServer = JSON.parse(event.data);

        if (dataFromServer.type === 'pong')
        {
            let end = Date.now();
            let ping = end - dataFromServer.timestamp;
            console.log(`Ping: ${ping}ms`);
        }

        // обновить информацию по точкам
        game.foods = [];
        for (let i = 0; i < dataFromServer.points.length; i++)
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
        for (let snake in game.snakes)
        {
            if (!(snake in dataFromServer.users))
            {
                game.snakes[snake].die();
            }
        }

        let mySnake;
        let currentSnake;
        for (let user in dataFromServer.users)
        {
            currentSnake = dataFromServer.users[user];
            if (currentSnake.name === localStorage.getItem('nickname'))
            {
                mySnake = currentSnake;
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
                    game.snakes[currentSnake.name].pos.x = currentSnake.x;
                    game.snakes[currentSnake.name].pos.y = currentSnake.y;

                    game.snakes[currentSnake.name].arr = [];
                    game.snakes[currentSnake.name].arr.push(
                        new Point(
                            currentSnake.x - game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2,
                            currentSnake.y - game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2
                        )
                    );
                    game.snakes[currentSnake.name].score = currentSnake.score;
                    game.snakes[currentSnake.name].size = currentSnake.radius;
                    game.snakes[currentSnake.name].mainColor = currentSnake.color;
                    game.snakes[currentSnake.name].length = currentSnake.body.length;

                    for (let i = 0; i < currentSnake.body.length; i++)
                    {
                        game.snakes[currentSnake.name].arr.push(
                            new Point(
                                currentSnake.body[i].x - game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2,
                                currentSnake.body[i].y - game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2
                            )
                        );
                    }
                }
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

            // body
            let body = [];
            for (let i = 0; i < game.snakeUser.arr.length; i++)
            {
                body.push(
                    new Point(
                        game.snakeUser.arr[i].x + game.snakeUser.camera.x,
                        game.snakeUser.arr[i].y + game.snakeUser.camera.y,
                    )
                );
            }

            // отправить обновленные данные на бэк
            let data = {
                snake: {
                    x: game.snakeUser.pos.x,
                    y: game.snakeUser.pos.y,
                    radius: game.snakeUser.size,
                    score: game.snakeUser.score,
                    body: body,
                    color: game.snakeUser.mainColor
                }
            };
            conn.send(JSON.stringify(data));
        }
        ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
        ctxHex.clearRect(0, 0, canvas.width, canvas.height);

        game.draw();
    });
    game.init();
}


if (localStorage.getItem('nickname') === null)
{
    window.location.href = '/';
    conn.close();
}
setTimeout(start, 1000);
