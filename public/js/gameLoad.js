class Game {
    constructor(ctxSnake, ctxHex) {
        this.ctxSnake = ctxSnake;
        this.ctxHex = ctxHex;
        this.WORLD_SIZE = new Point(40000, 20000);
        this.ARENA_RADIUS = 5000
        this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
        this.world = new Point(-20000, -10000);
        this.snakes = [];
    }

    init() {
        this.snakes[0] = new Snake(this.ctxSnake, 0);
    }

    draw() {
        this.drawWorld();

        if (this.snakes[0].state === 0) {
            this.snakes[0].move();
        }

    }

    drawWorld() {

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

        this.ctxHex.strokeStyle = 'red';
        this.ctxHex.lineWidth = 5;
        this.ctxHex.globalAlpha = 0.5;

        this.ctxHex.beginPath();
        this.ctxHex.arc(this.world.x + this.WORLD_SIZE.x / 2, this.world.y + this.WORLD_SIZE.y / 2, this.ARENA_RADIUS, 0, 2 * Math.PI);
        this.ctxHex.fill();
        this.ctxHex.stroke();

        this.world.x -= this.snakes[0].velocity.x;
        this.world.y -= this.snakes[0].velocity.y;

        this.ctxHex.restore();
    }
}