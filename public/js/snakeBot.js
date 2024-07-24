class SnakeBot extends Snake {
    constructor(ctx, id) {
        super(ctx, id);
        this.changeDirectionInterval = 1000;
        this.pos = ut.arcRandom(
            game.world.x + game.WORLD_SIZE.x / 2 - game.ARENA_RADIUS,
            game.world.x + game.WORLD_SIZE.x / 2 + game.ARENA_RADIUS,
            game.ARENA_RADIUS - 1000);

        this.angle = 0;
        this.length = 10;
        this.avoidSnake = false;
        this.border = false;

        this.speed = 4;
        this.boost = false;
        this.d = -Math.PI;

        this.arr = [];
        this.headPath = [];

        this.arr.push(new Point(this.pos.x, this.pos.y));
        this.headPath.push(new Point(this.pos.x, this.pos.y));
        for (let i = 1; i < this.length; i++) {
            this.arr.push(new Point(this.arr[i - 1].x, this.arr[i - 1].y));
            this.headPath.push(new Point(this.headPath[i - 1].x, this.headPath[i - 1].y));
        }

        this.initBot();

    }

    initBot() {

        setInterval(() => {
            this.checkSnake();
        }, 100)

        setInterval(() => {
            this.findFood();
        }, 100)

        setInterval(() => {
            this.checkBorderInField();
        }, 100)

    }

    turn(p1, p2) {

        let angle = ut.getAngle(p1, p2);

        let delta = angle - this.d;

        if (delta > Math.PI) {
            delta -= 2 * Math.PI;
        }
        if (delta < -Math.PI) {
            delta += 2 * Math.PI;
        }

        if (delta > 0) {
            this.d += Math.PI / 16;
        } else if (delta < 0) {
            this.d -= Math.PI / 16;
        }


        if (this.d > Math.PI) {
            this.d -= 2 * Math.PI
        }
        if (this.d < -Math.PI) {
            this.d += 2 * Math.PI
        }

        this.changeAngle(this.d);
    }

    findFood() {

        if (this.avoidSnake) return;
        if (this.border) return

        let min = Infinity;
        let minFood = null;

        for (let i = 0; i < game.foods.length; i++) {
            let distance = ut.getDistance(game.foods[i].pos, this.arr[0]);
            if (distance < min) {
                min = distance;
                minFood = game.foods[i].pos;
            }
        }

        if (minFood) {
            this.turn(this.arr[0], minFood);
        }

    }

    checkSnake() {

        if (this.border) return;

        let snakeInSight = false;
        let snake;
        let snakeX;
        let snakeY;

        let x;
        let y;

        for (let i = 0; i < game.snakes.length; i++) {

            if (this != game.snakes[i]) {

                x = this.arr[0].x;
                y = this.arr[0].y;

                snake = game.snakes[i].arr[0];
                snakeX = game.snakes[i].arr[0].x;
                snakeY = game.snakes[i].arr[0].y;

                if (snakeX - 300 < x && snakeX + 300 > x &&
                    snakeY - 300 < y && snakeY + 300 > y) {

                    this.turn(snake, this.arr[0]);

                    snakeInSight = true;
                    break;

                }
            }
        }

        this.avoidSnake = snakeInSight;

    }

    checkBorderInField() {
        if (this != game.snakes[0]) {

            let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

            let distanceToBorder = ut.getDistance(this.arr[0], center);

            const safeDistance = 300;
            const safeArena = game.ARENA_RADIUS - safeDistance;

            if (distanceToBorder >= safeArena) {

                this.border = true;
                this.d += Math.PI / 24;
                this.changeAngle(this.d);

            } else {

                this.border = false
            }
        }
    }

    changeAngle(angle) {
        this.angle = angle;
        this.d = angle;
    }

    boostMove() {
        if (this.boost && this.length > 10) {
            this.ctx.shadowBlur = 20; // радиус размытия тени
            this.ctx.shadowColor = this.supportColor; // цвет свечения
            this.ctx.shadowOffsetX = 0; // смещение тени по X
            this.ctx.shadowOffsetY = 0;
            this.speed = 8;
            if (this.intervalId === null) {
                this.intervalId = setInterval(() => {
                    this.counter++;
                }, 1000);
            }
            if (this.counter >= 3) {
                this.counter = 0;
                this.length--;
                if (this.length % 8 === 0) this.size--;
            }
        } else {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            this.speed = 4;
        }
    }

    move(player) {
        this.boostMove();

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.headPath.push({ x: this.pos.x, y: this.pos.y });

        if (this.headPath.length > this.length) {
            this.headPath.shift();
        }

        for (let i = this.length - 1; i > 0; i--) {
            this.arr[i].x = this.headPath[this.headPath.length - 1 - i].x - player.pos.x;
            this.arr[i].y = this.headPath[this.headPath.length - 1 - i].y - player.pos.y;

            this.drawBody(this.arr[i].x, this.arr[i].y, i);
        }

        this.arr[0].x = this.pos.x - player.pos.x;
        this.arr[0].y = this.pos.y - player.pos.y;

        //move head
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.drawHead(this.angle);

        super.setSize();
        super.checkCollissionFood();
        super.checkCollissionBonus();
        super.checkCollissionDanger();
        this.checkCollissionBot();
        this.checkCollissionBorder();

    }

    checkCollissionBorder() {
        let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

        if (ut.getDistance(this.arr[0], center) + this.size > game.ARENA_RADIUS)
            this.die();
    }

    checkCollissionBot() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;
        for (let i = 0; i < game.snakes.length; i++) {
            if (game.snakes[i].id != this.id) {
                for (let j = 0; j < game.snakes[i].length; j++) {
                    if (ut.cirCollission(x, y, this.size + 3, game.snakes[i].arr[j].x,
                        game.snakes[i].arr[j].y, game.snakes[i].size)) {

                        this.die();
                        break;
                    }
                }
            }
        }
    }

    rgbaColor(color, alpha) {
        const hex = color.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    drawEffect(arr, angle, player) {
        anime({
            targets: { alpha: 1 },
            alpha: 0,
            duration: 1000,
            easing: 'linear',
            update: (anim) => {
                const alphaValue = anim.animations[0].currentValue;
                this.ctx.shadowBlur = 0;

                // Создаем область отсечения
                this.ctx.save();
                this.ctx.beginPath();
                arr.forEach(point => {
                    this.ctx.arc(point.x, point.y, this.size * 1.7, 0, 2 * Math.PI);
                });
                this.ctx.clip();

                // Восстанавливаем контекст
                this.ctx.restore();

                let d = this.size / 2;

                for (let i = arr.length - 1; i >= 0; i--) {
                    arr[i].x -= player.velocity.x;
                    arr[i].y -= player.velocity.y;
                }

                for (let i = arr.length - 1; i >= 0; i--) {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.rgbaColor(this.mainColor, alphaValue);
                    this.ctx.arc(arr[i].x, arr[i].y - d, this.size, 0, 2 * Math.PI);
                    this.ctx.fill();
                }

                let x = arr[arr.length - 1].x;
                let y = arr[arr.length - 1].y;

                this.ctx.fillStyle = this.rgbaColor(this.mainColor, alphaValue);
                this.ctx.beginPath();
                this.ctx.arc(x, y - d, this.size, 0, 2 * Math.PI);
                this.ctx.fill();

                //eye 1
                let p1 = new Point(x + d * Math.cos(angle), y + d * Math.sin(angle));
                p1 = ut.rotate(p1, arr[arr.length - 1], -20);

                this.ctx.fillStyle = this.rgbaColor("whitesmoke", alphaValue);
                this.ctx.beginPath();
                this.ctx.arc(p1.x, p1.y - d, 0.42 * this.size, 0, 2 * Math.PI);
                this.ctx.fill();

                this.ctx.fillStyle = this.rgbaColor("black", alphaValue);
                this.ctx.beginPath();
                this.ctx.arc(p1.x + Math.cos(angle), p1.y + Math.sin(angle) - d, 0.23 * this.size, 0, 2 * Math.PI);
                this.ctx.fill();

                //eye2
                let p2 = ut.rotate(p1, arr[arr.length - 1], 40);

                this.ctx.fillStyle = this.rgbaColor("whitesmoke", alphaValue);
                this.ctx.beginPath();
                this.ctx.arc(p2.x, p2.y - d, 0.42 * this.size, 0, 2 * Math.PI);
                this.ctx.fill();

                this.ctx.fillStyle = this.rgbaColor("black", alphaValue);
                this.ctx.beginPath();
                this.ctx.arc(p2.x + Math.cos(angle), p2.y + Math.sin(angle) - d, 0.23 * this.size, 0, 2 * Math.PI);
                this.ctx.fill();

            }
        });
    }

    die() {
        let last = this.length - 1;
        let arrayBody = [];

        for (let i = last; i > 0; i--) {
            if (i % 3 === 0) {
                game.foods.push(new Food(game.ctxSnake, this.arr[i].x, this.arr[i].y));
            }
            arrayBody.push({
                x: this.arr[i].x,
                y: this.arr[i].y,
            });
            this.arr.splice(i, 1);
        }

        this.drawEffect(arrayBody, this.angle, game.snakes[0]);

        let index = game.snakes.indexOf(this);
        if (index !== -1) game.snakes.splice(index, 1);
    }
}