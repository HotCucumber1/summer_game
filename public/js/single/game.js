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
        this.snakes = [];
        this.backgroundImage = new Image();
        this.backgroundImage.src = "images/background6.png";
        this.foods = [];
        this.bonus = [];
    }

    init()
    {
        this.generateFoods(2000);
        this.generateBonus(100);
        this.snakes[0] = new Snake(this.ctxSnake, localStorage.getItem("nickname"));
        for (let i = 1; i <= 30; i++)
            this.addSnake(i);
    }

    draw()
    {
        this.drawWorld();

        for (let i = 0; i < this.foods.length; i++)
        {
            this.foods[i].draw(this.snakes[0]);
        }
        for (let i = 0; i < this.bonus.length; i++)
        {
            this.bonus[i].move(this.snakes[0]);
        }
        if (this.snakes[0].state === 0)
        {
            this.snakes[0].move();
        }

        for (let i = 1; i < this.snakes.length; i++)
        {
            if (this.snakes[i].state === 0)
            {
                this.snakes[i].move(this.snakes[0]);
            }
        }

        this.snakes[0].drawYourLength();
        this.drawLength();
        // this.drawSize();
        this.drawName();
    }

    drawWorld()
    {
        this.ctxHex.save();

        this.ctxHex.fillStyle = "red";
        this.ctxHex.fillRect(this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.ctxHex.beginPath();
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS, 0, 2 * Math.PI);
        this.ctxHex.closePath();

        this.ctxHex.globalCompositeOperation = "destination-out";
        this.ctxHex.fill();

        this.ctxHex.restore();

        this.ctxHex.drawImage(this.backgroundImage, this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.ctxHex.strokeStyle = "red";
        this.ctxHex.lineWidth = 5;
        this.ctxHex.globalAlpha = 0.5;

        this.ctxHex.beginPath();
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS, 0, 2 * Math.PI);
        this.ctxHex.fill();
        this.ctxHex.stroke();

        this.world.x -= this.snakes[0].velocity.x;
        this.world.y -= this.snakes[0].velocity.y;
    }

    drawLength()
    {
        let start = new Point(20, 20);
        const maxInTop = 10;
        let leaderBoard = [];
        for (let i = 0; i < this.snakes.length; i++)
        {
            leaderBoard.push(this.snakes[i])
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

    drawSize()
    {
        let start = new Point(120, 20);
        for (let i = 0; i < this.snakes.length; i++)
        {
            this.ctxSnake.fillStyle = this.snakes[i].mainColor;
            this.ctxSnake.font = "bold 12px Arial";
            this.ctxSnake.fillText("Your size: " + this.snakes[i].size,
                start.x - 5, start.y + i * 15);
        }
    }

    addSnake(id)
    {
        this.snakes.push(new SnakeBot(this.ctxSnake, "Bot" + id))
    }

    drawName()
    {
        let start = new Point(game.snakes[0].arr[0].x + 20, game.snakes[0].arr[0].y);
        this.ctxSnake.fillStyle = this.snakes[0].mainColor;
        this.ctxSnake.font = "bold 24px Arial";
        let nickname = localStorage.getItem("nickname");
        this.ctxSnake.fillText(nickname, start.x, start.y);
    }

    generateFoods(n)
    {
        for (let i = 0; i < n; i++)
        {
            let pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.foods.push(new Food(this.ctxSnake, pos.x, pos.y));
        }

    }

    generateBonus(n)
    {
        for (let i = 0; i < n; i++)
        {
            let pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.bonus.push(new Bonus(this.ctxSnake, pos.x, pos.y));
        }
    }
}