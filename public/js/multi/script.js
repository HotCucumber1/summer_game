let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxHex);
let isStarted = false;
let d = -Math.PI / 2;
let isDie = false;


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


if (localStorage.getItem('nickname') === null)
{
    window.location.href = '/';
    conn.close();
}

canvas.onmousemove = (event)=> cursor = ut.getMousePos(canvas, event);
canvas.onmousedown = () => game.snakeUser.boost = true;
canvas.onmouseup = () => game.snakeUser.boost = false;

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


document.addEventListener('startEvent', function()
{
    game.init();
    setTimeout(() => isStarted = true, 1000);

    conn.addEventListener("message", function (event)
    {
        if (!isStarted || isDie)
        {
            return;
        }
        const dataFromServer = JSON.parse(event.data);
        if (dataFromServer.type === 'pong')
        {
            return;
        }

        // получить информацию по точкам
        if (dataFromServer.points)
        {
            game.foods = [];
            for (let i = 0; i < dataFromServer.points.length; i++)
            {
                game.foods.push(
                    new Food(
                        ctxSnake,
                        dataFromServer.points[i].x + game.SCREEN_SIZE.x / 2,
                        dataFromServer.points[i].y + game.SCREEN_SIZE.y / 2,
                        dataFromServer.points[i].color
                    )
                );
            }
            conn.send(
                JSON.stringify({
                    points: true
                })
            );
        }
        // обновить позицию точек
        game.updatePoints();

        // обновить информацию по зоне
        game.ARENA_RADIUS = dataFromServer.wall;

        // обновить информацию по змеям
        for (let snake in game.snakes)
        {
            if (!(snake in dataFromServer.users))
            {
                game.snakes[snake].die();
            }
        }

        // проверить, жива ли змея и обновить ее данные
        let mySnake;
        for (let user in dataFromServer.users)
        {
            let currentSnake = dataFromServer.users[user];
            if (currentSnake.name === localStorage.getItem('nickname'))
            {
                mySnake = currentSnake;
                continue;
            }

            if (!(currentSnake.name in game.snakes))
            {
                game.addSnakeFromData(currentSnake);
                continue;
            }
            game.updateSnakeData(currentSnake);
        }

        if (typeof mySnake === "undefined")
        {
            console.log('death');
            game.snakeUser.die();
            isDie = true;
            return;
        }
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
                body: game.snakeUser.getBodyData(),
                color: game.snakeUser.mainColor
            }
        };
        conn.send(JSON.stringify(data));
    });
});
