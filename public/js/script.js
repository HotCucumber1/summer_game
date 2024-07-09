let canvas = document.getElementById("canvasSnake");
let ctxSnake = document.getElementById("canvasSnake").getContext("2d");
let ctxFood = document.getElementById("canvasFood").getContext("2d");
let ctxHex = document.getElementById("canvasHex").getContext("2d");
let ut = new Util();
let cursor = new Point(0, 0);
let game = new Game(ctxSnake, ctxFood, ctxHex);

// ошибка
conn.onerror = function (e) {
    alert(`Websocket error: ${e}`);
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


let updateId;
let previousDelta = 0;
let fpsLimit = 120;


function update(currentDelta) {
    updateId = requestAnimationFrame(update);

    let delta= currentDelta - previousDelta;
    if (fpsLimit && delta < 1000 / fpsLimit)
        return;
    previousDelta = currentDelta;

    ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
    ctxFood.clearRect(0, 0, canvas.width, canvas.height);
    ctxHex.clearRect(0, 0, canvas.width, canvas.height);

    game.draw();
}

conn.addEventListener("message", function (event) {
    let dataFromServer = JSON.parse(event.data);
    /*
    {
  "snake": [
    {
      "x": 0,
      "y": 0,
      "body": [

      ],
      "radius": 10,
      "score": 100
    },
    {},
    {}
  ],

  "points": [
    {
      "x": 10,
      "y": 10,
      "color": "#AAA"
    },
    {
      "x": 15,
      "y": 15,
      "color": "#BBB"
    },
    {
      "x": 10,
      "y": -10,
      "color": "#CCC"
    }
  ]
}
     */

    game.snakes[0].pos.x = dataFromServer.snake.x;  // координата X головы змеи с сервера
    game.snakes[0].pos.y = dataFromServer.snake.y;  // координата Y головы змеи с сервера

    game.snakes[0].velocity.x = dataFromServer.snake.velocityX;
    game.snakes[0].velocity.y = dataFromServer.snake.velocityY;

    game.snakes[0].size = dataFromServer.snake.radius;

    for (let i = 0; i < dataFromServer.snake.body.length; i++)
    {
        game.snakes[0].arr.push(new Point(dataFromServer.snake.body[i].x,
                                      dataFromServer.snake.body[i].y));
    }

    game.ARENA_RADIUS = dataFromServer.wall;         // радиус арены с сервера
    if (game.foods.length !== dataFromServer.points.length)
    {
        game.foods = [];
        for (let i = 0; i < dataFromServer.points.length; i++)
        {
            game.foods.push(
                new Food(
                    game.ctxFood, dataFromServer.points[i].x, dataFromServer.points[i].y
                )
            );
        }
    }
    console.log(game.foods);
    update();
});

start();