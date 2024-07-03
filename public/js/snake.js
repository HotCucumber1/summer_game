class Snake {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        this.score = 0;
        this.speed = 4;
        this.boost = false;
        this.state = 0;


        this.pos = new Point(game.world.x + game.WORLD_SIZE.x, game.world.y + game.WORLD_SIZE.y);
        this.velocity = new Point(0, 0);
        this.angle = ut.random(0, Math.PI);

        this.length = 20;
        this.MAXSIZE = 40;
        this.size = 15;

        this.mainColor = ut.randomColor();
        this.midColor = ut.color(this.mainColor, 0.33);
        this.supportColor = ut.color(this.midColor, 0.33);

        this.arr = [];
        this.arr.push(new Point(game.SCREEN_SIZE.x / 2, game.SCREEN_SIZE.y / 2));
        for (let i = 1; i < this.length; i++) {
            this.arr.push(new Point(this.arr[i - 1].x, this.arr[i - 1].y));
        }

        this.counter = 0;
        this.intervalId = null;
    }

    drawHead() {

        let x = this.arr[0].x;
        let y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();


        //eye 1
        let d = this.size / 2;
        let p1 = new Point(x + d * Math.cos(this.angle), y + d * Math.sin(this.angle));
        p1 = ut.rotate(p1, this.arr[0], -20);
        //eye
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, this.size / 2 - 1, 0, 2 * Math.PI);
        this.ctx.fill();

        //retina
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p1.x + Math.cos(this.angle), p1.y + Math.sin(this.angle), this.size / 4, 0, 2 * Math.PI);
        this.ctx.fill();


        //eye2
        let p2 = ut.rotate(p1, this.arr[0], 40);
        //eye
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p2.x, p2.y, this.size / 2 - 1, 0, 2 * Math.PI);
        this.ctx.fill();

        //retina
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p2.x + Math.cos(this.angle), p2.y + Math.sin(this.angle), this.size / 4, 0, 2 * Math.PI);
        this.ctx.fill();

    }

    drawBody(x, y) {

        let grd = this.ctx.createRadialGradient(x, y, 2, x + 4, y + 4, 10);
        grd.addColorStop(0, this.supportColor);
        grd.addColorStop(1, this.midColor);

        let radius = this.size;
        if (radius < 0) radius = 1;

        this.ctx.beginPath();
        this.ctx.fillStyle = this.mainColor;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = grd;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

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
                this.length--
            }
        } else {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            this.speed = 4;
        }
    }

    move() {
        this.boostMove();

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        let d = this.size / 2;

        for (let i = this.length - 1; i >= 1; i--) {
            this.arr[i].x = this.arr[i - 1].x - d * Math.cos(this.angle);
            this.arr[i].y = this.arr[i - 1].y - d * Math.sin(this.angle);
            this.drawBody(this.arr[i].x, this.arr[i].y);
        }

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.drawHead();
        this.checkCollissionFood();
        this.checkCollissionBorder();
    }

    addScore() {
        this.score++;
        this.arr.push(new Point(-100, -100));
    }

    // addLength(size) {
    //     this.length += (size - 4);
    // }

    incSize() {
        this.length++;
        if (this.length % 10 === 0) this.size++;
        if (this.size > this.MAXSIZE) this.size = this.MAXSIZE;
    }

    checkCollissionFood() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;
        for (let i = 0; i < game.foods.length; i++) {
            if (ut.cirCollission(x, y, this.size + 3, game.foods[i].pos.x,
                game.foods[i].pos.y, game.foods[i].size)) {
                game.foods[i].die();
                this.addScore();
                // this.addLength(game.foods[i].size);
                this.incSize();
            }
        }
    }

    checkCollissionBorder() {
        let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

        if (ut.getDistance(this.arr[0], center) + this.size > game.ARENA_RADIUS)
            this.die();
    }

    changeAngle(angle) {
        this.angle = angle;
    }

    die() {
        this.state = 1;
        for (let i = 0; i < this.arr.length; i += 3)
        {
            game.foods.push(new Food(game.ctxFood,
                this.arr[i].x, this.arr[i].y));
            this.arr.splice(i, 1);
        }

        game.ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(updateId);
    }

}