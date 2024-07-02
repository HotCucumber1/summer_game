class Snake {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        this.score = 0;
        this.speed = 9;
        this.boost = false;
        this.state = 0;


        this.pos = new Point(game.SCREEN_SIZE.x / 2, game.SCREEN_SIZE.y / 2);
        this.velocity = new Point(0, 0); //arbitary point
        this.angle = ut.random(0, Math.PI);

        this.length = 20;
        this.MAXSIZE = 22;
        this.size = 15;
        this.radius = 10;

        // color
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

    move() {
        if (this.boost && this.length > 10) {
            this.speed = 16;
            if (this.intervalId === null) {
                this.intervalId = setInterval(() => {
                    this.counter++;
                }, 1000);
            }
            if (this.counter >= 2) {
                this.counter = 0;
                this.length--
            }
        } else
            this.speed = 9;

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        //magic
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
    }

    addScore() {
        this.length++;
        this.score++;
        this.arr.push(new Point(-100, -100));
    }

    incSize() {
        if (this.length % 20 == 0) this.size++;
        if (this.size > this.MAXSIZE) this.size = this.MAXSIZE;
    }

    checkCollissionFood() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        // for (let i = 0; i < game.foods.length; i++)
        // {
        //     console.log( game.foods[i].array[1])
        // }


        for (let i = 0; i < game.foods.length; i++) {
            if (ut.cirCollission(x, y, this.size + 3, game.foods[i].array.x,
                game.foods[i].array.y, game.foods[i].size)) {
                console.log("collission");
                game.foods[i].die(i);
                this.addScore();
                this.incSize();
            }
        }
    }

    changeAngle(angle) {
        this.angle = angle;
    }
}