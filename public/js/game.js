class Game {
    constructor(ctxSnake, ctxHex) {
        this.ctxSnake = ctxSnake;
        this.ctxHex = ctxHex;
        this.WORLD_SIZE = new Point(40000, 20000);
        this.ARENA_RADIUS = 5000;
        this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
        this.world = new Point(-20000, -10000);
        this.snakes = [];
        this.backgroundImage = new Image();
        this.backgroundImage.src = "../public/images/background6.png";
        this.foods = [];
        this.moving = [];
        this.danger = [];
    }

    init() {
        this.generateFoods(2000);
        this.generateMoving(100);
        this.generateDanger(50);
        this.snakes[0] = new Snake(this.ctxSnake, localStorage.getItem("nickname"));
        for (let i = 1; i <= 1; i++)
            this.addSnake(i);
    }

    draw() {
        this.drawWorld();

        for (let i = 0; i < this.foods.length; i++) {
            this.foods[i].draw(this.snakes[0]);
        }


        for (let i = 0; i < this.moving.length; i++) {
            this.moving[i].move(this.snakes[0]);
        }

        for (let i = 0; i < this.danger.length; i++) {
            this.danger[i].draw(this.snakes[0]);
        }


        if (this.snakes[0].state === 0) {
            this.snakes[0].move();
        }

        for (let i = 1; i < this.snakes.length; i++) {
            if (this.snakes[i].state === 0) {
                this.snakes[i].move(this.snakes[0]);
            }
        }

        this.snakes[0].drawYourLength();
        this.drawLength();
        // this.drawSize();
        this.drawName();
    }

    drawWorld() {
        this.ctxHex.save();

        // Заполнение области за пределами круга красным цветом
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

    drawLength() {
        let start = new Point(20, 20);
        const maxInTop = 10;
        let leaderBoard = [];
        for (let i = 0; i < this.snakes.length; i++) {
            leaderBoard.push(this.snakes[i])
        }

        leaderBoard.sort(function (a, b) {
            return b.length - a.length;
        });

        for (let i = 0; i < maxInTop; i++) {
            this.ctxSnake.fillStyle = leaderBoard[i].mainColor;
            if (window.innerWidth > 1920) {
                this.ctxSnake.font = "bold 24px Arial";
                this.ctxSnake.fillText("#" + (i + 1) + " " + leaderBoard[i].id + ": " + leaderBoard[i].length,
                    start.x - 5, start.y + i * 30);
            } else {
                this.ctxSnake.font = "bold 12px Arial";
                this.ctxSnake.fillText("#" + (i + 1) + " " + leaderBoard[i].id + ": " + leaderBoard[i].length,
                    start.x - 5, start.y + i * 15);
            }
        }
    }

    drawSize() {
        let start = new Point(120, 20);
        for (let i = 0; i < this.snakes.length; i++) {
            this.ctxSnake.fillStyle = this.snakes[i].mainColor;
            this.ctxSnake.font = "bold 12px Arial";
            this.ctxSnake.fillText("Your size: " + this.snakes[i].size,
                start.x - 5, start.y + i * 15);
        }
    }

    addSnake(id) {
        this.snakes.push(new SnakeBot(this.ctxSnake, "Bot" + id))
    }

    drawName() {
        let start = new Point(game.snakes[0].arr[0].x + 20, game.snakes[0].arr[0].y);
        this.ctxSnake.fillStyle = this.snakes[0].mainColor;
        this.ctxSnake.font = "bold 24px Arial";
        let nickname = localStorage.getItem("nickname");
        this.ctxSnake.fillText(nickname, start.x, start.y);
    }

    generateFoods(n) {
        let pos; 
        
        for (let i = 0; i < n; i++) {
            pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.foods.push(new Food(this.ctxSnake, pos.x, pos.y));
        }

    }

    generateMoving(n) {
        let pos;

        for (let i = 0; i < n; i++) {
            pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.moving.push(new Moving(this.ctxSnake, pos.x, pos.y));
        }
    }

    generateDanger(n) {
        let pos;

        for (let i = 0; i < n; i++) {
            pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.danger.push(new Danger(this.ctxSnake, pos.x, pos.y));
        }
    }
}