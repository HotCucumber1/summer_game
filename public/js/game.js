class Game {
    constructor(ctxSnake, ctxFood, ctxHex) {
        this.ctxSnake = ctxSnake;
        this.ctxFood = ctxFood;
        this.ctxHex = ctxHex;
        this.WORLD_SIZE = new Point(4000, 2000);
        this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
        this.world = new Point(-1200, -600);
        this.snakes = [];
        this.backgroundImage = new Image();
        this.backgroundImage.src = '../public/images/background.png';
        this.foods = [];
    }

    init() {
        this.snakes[0] = new Snake(this.ctxSnake, 0);
        this.generateFoods(800);
    }

    draw() {
        this.drawWorld();

        if (this.snakes[0].state === 0)
            this.snakes[0].move();

        for (let i = 0; i < this.foods.length; i++) this.foods[i].draw(this.snakes[0]);

        this.drawScore();
        this.drawLength();
    }

    drawWorld() {

        this.ctxHex.fillStyle = "white";
        this.ctxHex.fillRect(this.world.x - 2, this.world.y - 2, this.WORLD_SIZE.x + 4, this.WORLD_SIZE.y + 4);

        this.ctxHex.drawImage(this.backgroundImage, this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        // this.ctxHex.strokeStyle = 'white';
        // this.ctxHex.globalAlpha = 0.5
        // this.ctxHex.beginPath();
        // this.ctxHex.arc(this.world.x, this.world.y, this.WORLD_SIZE.x ,0, 2*Math.PI);
        // this.ctxHex.fill();
        // this.ctxHex.stroke();

        this.world.x -= this.snakes[0].velocity.x;
        this.world.y -= this.snakes[0].velocity.y;
    }

    drawScore() {
        let start = new Point(20, 20);
        for (let i = 0; i < this.snakes.length; i++) {
            this.ctxSnake.fillStyle = this.snakes[i].mainColor;
            this.ctxSnake.font = "bold 12px Arial";
            this.ctxSnake.fillText("score: " + this.snakes[i].score,
                start.x - 5, start.y + i * 15);
        }
    }

    drawLength() {
        let start = new Point(20, 40);
        for (let i = 0; i < this.snakes.length; i++) {
            this.ctxSnake.fillStyle = this.snakes[i].mainColor;
            this.ctxSnake.font = "bold 12px Arial";
            this.ctxSnake.fillText("Your length: " + this.snakes[i].length,
                start.x - 5, start.y + i * 15);
        }
    }

    generateFoods(n) {
        for (let i = 0; i < n; i++) {
            this.foods.push(new Food(this.ctxFood, ut.random(-1200 + 50, 2800 - 50),
                ut.random(-600 + 50, 1400 - 50)));
        }
    }
}