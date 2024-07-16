class Bonus {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.pos = new Point(x, y);
        this.sizeMin = 10;
        this.sizeMax = 15;

        this.size = ut.random(this.sizeMin, this.sizeMax);

        this.mainColor = ut.randomColor();

        this.border = false;
        this.avoidSnake = false;
        this.speed = 4;
        this.angle = ut.random(0, Math.PI);

        this.velocity = new Point(0, 0);
        this.directionBonus = 0;

        this.initBonus();
    }

    initBonus() {

        setInterval(() => {
            this.checkSnake();
        }, 100);

        setInterval(() => {
            this.checkBorderInField();
        }, 100);

        setInterval(() => {
            let fieldPoint = new Point(ut.random(this.pos.x - 100, this.pos.x + 100), ut.random(this.pos.y - 100, this.pos.y + 100));
            this.turn(fieldPoint, this.pos);
        }, 100);

    }

    draw() {

        let grd = this.ctx.createRadialGradient(this.pos.x, this.pos.y, this.size * 0.1, this.pos.x, this.pos.y, this.size);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, this.mainColor);

        this.ctx.fillStyle = grd;

        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = this.mainColor;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.beginPath();
        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

    }

    die() {
        let index = game.bonus.indexOf(this);
        game.bonus.splice(index, 1);
    }

    changeAngle(angle) {
        this.angle = angle;
        this.directionBonus = angle;
    }

    move(player) {

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.pos.x -= player.velocity.x;
        this.pos.y -= player.velocity.y;

        this.draw();
    }

    turn(point1, point2) {

        let direction = this.directionBonus;

        let angle = ut.getAngle(point1, point2);

        let delta = angle - direction;


        if (delta > Math.PI) {
            delta -= 2 * Math.PI;
        }

        if (delta < -Math.PI) {
            delta += 2 * Math.PI;
        }


        if (delta > 0) {
            direction += Math.PI / 16;
        } else if (delta < 0) {
            direction -= Math.PI / 16;
        }


        if (direction > Math.PI) {
            direction -= 2 * Math.PI
        }

        if (direction < -Math.PI) {
            direction += 2 * Math.PI
        }

        this.changeAngle(direction);
    }

    checkSnake() {

        if (this.border) {
            return;
        }

        let snakeInSight = false;

        let x = this.pos.x;
        let y = this.pos.y;

        for (let i = 0; i < game.snakes.length; i++) {

            let snake = game.snakes[i].arr[0];
            let snakeX = game.snakes[i].arr[0].x;
            let snakeY = game.snakes[i].arr[0].y;

            if (snakeX - 300 < x && snakeX + 300 > x &&
                snakeY - 300 < y && snakeY + 300 > y) {

                this.turn(snake, this.pos);

                snakeInSight = true;

                this.speed = 6;

            }
        }

        this.avoidSnake = snakeInSight;

        if (!snakeInSight) {
            this.speed = 4;
        }

    }

    checkBorderInField() {

        let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

        let distanceToBorder = ut.getDistance(this.pos, center);

        const safeDistance = 300;
        const safeArena = game.ARENA_RADIUS - safeDistance;

        if (distanceToBorder >= safeArena) {

            this.border = true;

            this.speed = 6;

            this.turn(this.pos, center);

        } else {

            this.border = false;

            if (!this.avoidSnake) {
                this.speed = 4;
            }

        }
    }
}