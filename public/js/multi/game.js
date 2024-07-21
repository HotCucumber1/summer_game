class Game
{
    constructor(ctxSnake, ctxHex)
    {
        this.ctxSnake = ctxSnake;
        this.ctxHex = ctxHex;
        this.WORLD_SIZE = new Point(40000, 20000);
        this.ARENA_RADIUS = 5000;
        this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
        this.world = new Point(-20000, -10000);
        this.snakes = {};
        this.backgroundImage = new Image();
        this.backgroundImage.src = "images/bg2.jpg";
        this.foods = [];
    }

    init()
    {
        // TODO: протестить
        let spawn = ut.arcRandom(
            -this.ARENA_RADIUS,
            this.ARENA_RADIUS,
            this.ARENA_RADIUS * 0.8
        );

        this.snakeUser = new Snake(this.ctxSnake,
                                   localStorage.getItem('nickname'),
                                   this.world.x + this.WORLD_SIZE.x / 2 + this.SCREEN_SIZE.x / 2,
                                   this.world.y + this.WORLD_SIZE.y / 2 + this.SCREEN_SIZE.y / 2,
                                   0,
                                   4,
                                   15,
                                   ut.color(ut.randomColor(), 0.33));
    }

    addSnakeFromData(snakeData)
    {
        this.snakes[snakeData.name] = new Snake(ctxSnake,
            snakeData.name,
            snakeData.x - this.snakeUser.pos.x + this.SCREEN_SIZE.x / 2,
            snakeData.y - this.snakeUser.pos.y + this.SCREEN_SIZE.y / 2,
            snakeData.score,
            4,
            snakeData.radius,
            snakeData.color);
    }

    updateSnakeData(snakeData)
    {
        this.snakes[snakeData.name].pos.x = snakeData.x;
        this.snakes[snakeData.name].pos.y = snakeData.y;

        this.snakes[snakeData.name].arr = [];
        this.snakes[snakeData.name].arr.push(
            new Point(
                snakeData.x - this.snakeUser.pos.x + this.SCREEN_SIZE.x / 2,
                snakeData.y - this.snakeUser.pos.y + this.SCREEN_SIZE.y / 2
            )
        );
        this.snakes[snakeData.name].score = snakeData.score;
        this.snakes[snakeData.name].size = snakeData.radius;
        this.snakes[snakeData.name].mainColor = snakeData.color;
        this.snakes[snakeData.name].length = snakeData.body.length;

        for (let i = 0; i < snakeData.body.length; i++)
        {
            this.snakes[snakeData.name].arr.push(
                new Point(
                    snakeData.body[i].x - this.snakeUser.pos.x + this.SCREEN_SIZE.x / 2,
                    snakeData.body[i].y - this.snakeUser.pos.y + this.SCREEN_SIZE.y / 2
                )
            );
        }
    }

    draw()
    {
        this.drawWorld();

        for (let i = 0; i < this.foods.length; i++)
        {
            this.foods[i].draw(this.snakeUser);
        }
        if (this.snakeUser.state === 0)
        {
            this.snakeUser.move();
        }

        for (let snake in this.snakes)
        {
            this.snakes[snake].drawSnake();
        }

        this.snakeUser.drawYourLength();
        // this.drawLength();
        // this.drawSize();
        this.drawName();
    }

    drawWorld()
    {
        this.ctxHex.save();

        // Заполнение области за пределами круга красным цветом
        this.ctxHex.fillStyle = 'red';
        this.ctxHex.fillRect(this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.ctxHex.beginPath();
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS, 0, 2 * Math.PI);
        this.ctxHex.closePath();

        this.ctxHex.globalCompositeOperation = 'destination-out';
        this.ctxHex.fill();

        this.ctxHex.restore();

        this.ctxHex.drawImage(this.backgroundImage, this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.ctxHex.strokeStyle = 'red';
        this.ctxHex.lineWidth = 5;
        this.ctxHex.globalAlpha = 0.5;

        this.ctxHex.beginPath();
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS, 0, 2 * Math.PI);
        this.ctxHex.fill();
        this.ctxHex.stroke();

        this.world.x -= this.snakeUser.velocity.x;
        this.world.y -= this.snakeUser.velocity.y;
    }

    drawLength()
    {
        let start = new Point(20, 20);
        const maxInTop = 10;
        let leaderBoard = [];
        for (let i = 0; i < this.snakes.length; i++)
        {
            leaderBoard.push(this.snakes[i]);
        }

        leaderBoard.sort(function (a, b)
        {
            return b.arr.length - a.arr.length;
        });

        for (let i = 0; i < maxInTop; i++)
        {
            this.ctxSnake.fillStyle = leaderBoard[i].mainColor;
            if (window.innerWidth > 1920)
            {
                this.ctxSnake.font = "bold 24px Arial";
                this.ctxSnake.fillText("#" + (i + 1) + " " + leaderBoard[i].id + " length: " + leaderBoard[i].length,
                    start.x - 5, start.y + i * 30);
            }
            else
            {
                this.ctxSnake.font = "bold 12px Arial";
                this.ctxSnake.fillText("#" + (i + 1) + " " + leaderBoard[i].id + " length: " + leaderBoard[i].length,
                    start.x - 5, start.y + i * 15);
            }
        }
    }

    drawName()
    {
        let start = new Point(game.SCREEN_SIZE.x / 2 + 20, game.SCREEN_SIZE.y / 2);
        this.ctxSnake.fillStyle = this.snakeUser.mainColor;
        this.ctxSnake.font = "bold 24px Arial";
        let nickname = localStorage.getItem('nickname');
        if (typeof nickname === 'undefined')
        {
            nickname = 'Player';
        }
        this.ctxSnake.fillText(nickname, start.x, start.y);
    }

    updatePoints()
    {
        for (let i = 0; i < this.foods.length; i++)
        {
            this.foods[i].pos.x -= this.snakeUser.velocity.x;
            this.foods[i].pos.y -= this.snakeUser.velocity.y;
        }
    }
}
