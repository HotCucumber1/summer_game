class SnakeBot extends Snake 
{
    constructor(ctx, id) 
    {
        super(ctx, id);
        this.changeDirectionInterval = 1000;
        this.pos = ut.arcRandom(
            game.world.x + game.WORLD_SIZE.x / 2 - game.ARENA_RADIUS,
            game.world.x + game.WORLD_SIZE.x / 2 + game.ARENA_RADIUS,
            game.ARENA_RADIUS - 100);

        this.angle = 0;
        this.length = 10;
        this.avoidSnake = false;
        this.border = false;

        this.speed = 4;
        this.boost = false;
        this.directionSnake = -Math.PI;

        this.arr = [];
        this.arr.push(this.pos);
        for (let i = 1; i < this.length; i++) this.arr.push(new Point(this.arr[i - 1].x, this.arr[i - 1].y));

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

    turn(point1, point2) 
    {

        let direction = this.directionSnake;

        let angle = ut.getAngle(point1, point2);

        let delta = angle - direction;


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
            direction += Math.PI / 16;
        } else if (delta < 0) 
        {
            direction -= Math.PI / 16;
        }


        if (direction > Math.PI) 
        {
            direction -= 2 * Math.PI
        }

        if (direction < -Math.PI) 
        {
            direction += 2 * Math.PI
        }

        this.changeAngle(direction);
    }

    findFood() {

        if (this.avoidSnake) 
        {
            return;
        }

        if (this.border) 
        {
            return;
        }

        let min = Infinity;
        let minFood = null;

        for (let i = 0; i < game.foods.length; i++) 
        {
            let distance = ut.getDistance(game.foods[i].pos, this.arr[0]);
            if (distance < min) {
                min = distance;
                minFood = game.foods[i].pos;
            }
        }

        if (minFood) 
        {
            this.turn(this.arr[0], minFood);
        }

    }

    checkSnake() 
    {

        if (this.border) 
        {
            return;
        }

        let snakeInSight = false;

        for (let i = 0; i < game.snakes.length; i++) 
        {

            if (this != game.snakes[i]) 
            {

                let x = this.arr[0].x;
                let y = this.arr[0].y;

                let snake = game.snakes[i].arr[0];
                let snakeX = game.snakes[i].arr[0].x;
                let snakeY = game.snakes[i].arr[0].y;

                if (snakeX - 300 < x && snakeX + 300 > x &&
                    snakeY - 300 < y && snakeY + 300 > y) 
                {

                    this.turn(snake, this.arr[0]);

                    snakeInSight = true;
                    break;

                }
            }
        }

        this.avoidSnake = snakeInSight;

    }
    checkBorderInField() 
    {
        if (this != game.snakes[0]) 
        {

            let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

            let distanceToBorder = ut.getDistance(this.arr[0], center);

            const safeDistance = 300;
            const safeArena = game.ARENA_RADIUS - safeDistance;

            if (distanceToBorder >= safeArena) 
            {

                this.border = true;

                this.turn(this.arr[0], center);

            } else {
                this.border = false;
            }
        }
    }

    changeAngle(angle) 
    {
        this.angle = angle;
        this.directionSnake = angle;
    }

    boostMove() 
    {
        if (this.boost && this.length > 10) 
        {

            this.ctx.shadowBlur = 20; // радиус размытия тени
            this.ctx.shadowColor = this.supportColor; // цвет свечения
            this.ctx.shadowOffsetX = 0; // смещение тени по X
            this.ctx.shadowOffsetY = 0;
            this.speed = 8;

            if (this.intervalId === null) 
            {
                this.intervalId = setInterval(() => {
                    this.counter++;
                }, 1000);
            }
            if (this.counter >= 3) 
            {
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

    move(player) 
    {
        this.boostMove();

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        for (let i = this.length - 1; i >= 1; i--) 
        {
            this.arr[i].x = this.arr[i - 1].x;
            this.arr[i].y = this.arr[i - 1].y;

            //relative motion with player
            this.arr[i].x -= player.velocity.x;
            this.arr[i].y -= player.velocity.y;

            this.drawBody(this.arr[i].x, this.arr[i].y);
        }

        //move head
        this.arr[0].x += this.velocity.x;
        this.arr[0].y += this.velocity.y;

        //relative motion with player
        this.arr[0].x -= player.velocity.x;
        this.arr[0].y -= player.velocity.y;

        this.drawHead();

        super.setSize();
        super.checkCollissionFood();
        this.checkCollissionBot();
        this.checkCollissionBorder();

    }

    drawEffect(arr) 
    {

        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0; // радиус размытия тени
        this.ctx.shadowColor = this.supportColor; // цвет свечения
        this.ctx.shadowOffsetX = 0; // смещение тени по X
        this.ctx.shadowOffsetY = 0;

        let alpha = 1;
        const fadeStep = 0.01;
        const fadeDuration = 1000;
        const fadeInterval = fadeDuration / (1 / fadeStep);

        const fadeEffect = () => {
            if (alpha > 0) {
                alpha -= fadeStep;
                this.ctx.shadowBlur++;
                this.ctx.globalAlpha = alpha;

                // Очищаем канвас перед перерисовкой (если нужно)
                this.ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Рисуем эффект
                for (let i = arr.length - 1; i >= 0; i--) 
                {

                    let d = this.size / 2;

                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.mainColor;
                    this.ctx.arc(arr[i].x, arr[i].y - d, this.size, 0, 2 * Math.PI);
                    this.ctx.fill();
                }

                // Вызываем следующий кадр
                setTimeout(() => {
                    requestAnimationFrame(fadeEffect);
                }, fadeInterval);
            } else {
                this.ctx.globalAlpha = 0; // Устанавливаем окончательно, если alpha стал отрицательным
            }
        };

        fadeEffect();
    }

    checkCollissionBorder() 
    {
        let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

        if (ut.getDistance(this.arr[0], center) + this.size > game.ARENA_RADIUS) 
        {
            this.die();
        }
    }

    checkCollissionBot() 
    {

        let x = this.arr[0].x;
        let y = this.arr[0].y;

        for (let i = 0; i < game.snakes.length; i++) 
        {
            if (game.snakes[i].id != this.id) 
            {
                for (let j = 0; j < game.snakes[i].length; j++) 
                {
                    if (ut.cirCollission(x, y, this.size + 3, game.snakes[i].arr[j].x,
                        game.snakes[i].arr[j].y, game.snakes[i].size)) 
                    {

                        this.die();

                        return;
                    }
                }
            }
        }
    }

    die() 
    {
        let last = this.length - 1;
        let arrayBody = [];

        for (let i = last; i >= 1; i--) 
            {
            game.foods.push(new Food(game.ctxSnake, this.arr[i].x, this.arr[i].y));
            arrayBody.push(
            {
                x: this.arr[i].x,
                y: this.arr[i].y,
                angle: this.angle
            });
            this.arr.splice(i, 1);
        }

        // this.drawEffect(arrayBody);
        let index = game.snakes.indexOf(this);
        game.snakes.splice(index, 1);
    }
}

