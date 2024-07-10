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
        this.backgroundImage.src = 'images/background.png';
        this.foods = [];
    }

    init() {
        // this.generateFoods(1500);
        this.snakes[0] = new Snake(this.ctxSnake, 0);
        // боты
        // for(let i=1; i<11; i++)
        //     this.addSnake(i);
    }

    draw() {
        this.drawWorld();

        for (let i = 0; i < this.foods.length; i++) {
            this.foods[i].draw(this.snakes[0]);
        }

        if (this.snakes[0].state === 0)
            this.snakes[0].move();

        /*for(let i=1; i < this.snakes.length; i++)
            if(this.snakes[i].state === 0)
                this.snakes[i].move(this.snakes[0]);*/

        this.drawLength();
    }

    drawWorld() {
        // this.ctxHex.fillStyle = "white";
        // this.ctxHex.fillRect(this.world.x - 2, this.world.y - 2, this.WORLD_SIZE.x + 4, this.WORLD_SIZE.y + 4);
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
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS,0, 2*Math.PI);
        this.ctxHex.fill();
        this.ctxHex.stroke();

        this.world.x -= this.snakes[0].velocity.x;
        this.world.y -= this.snakes[0].velocity.y;
    }

    drawLength() {
        let start = new Point(20, 20);
        for (let i = 0; i < this.snakes.length; i++)
        {
            this.ctxSnake.fillStyle = this.snakes[i].mainColor;
            this.ctxSnake.font = "bold 12px Arial";
            this.ctxSnake.fillText("Your length: " + this.snakes[i].score, // счет
                start.x - 5, start.y + i * 15);
        }
    }

    addSnake(id){
        this.snakes.push(new SnakeBot(this.ctxSnake, id))
    }

    drawName() {
        let start = new Point(game.SCREEN_SIZE.x / 2 + 20, game.SCREEN_SIZE.y / 2);
        this.ctxSnake.fillStyle = this.snakes[0].mainColor;
        this.ctxSnake.font = "bold 24px Arial";
        let nickname = sessionStorage.getItem("Nickname");
        this.ctxSnake.fillText(nickname, start.x, start.y);
    }

    generateFoods(n) {
        for (let i = 0; i < n; i++)
        {
            let pos = ut.arcRandom(this.world.x + this.WORLD_SIZE.x / 2 - this.ARENA_RADIUS, this.world.x + this.WORLD_SIZE.x / 2 + this.ARENA_RADIUS, 0.9 * this.ARENA_RADIUS);
            this.foods.push(new Food(this.ctxSnake, pos.x, pos.y));
        }
    }
}