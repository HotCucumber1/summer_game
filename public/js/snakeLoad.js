class Snake {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        this.speed = 8;
        this.boost = true;
        this.state = 0;

        this.position = new Point(game.world.x + game.WORLD_SIZE.x / 2 + game.SCREEN_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2 + game.SCREEN_SIZE.y / 2 + 80);

        this.pos = new Point(game.world.x + game.WORLD_SIZE.x / 2 + game.SCREEN_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2 + game.SCREEN_SIZE.y / 2);
        this.velocity = new Point(0, 0);
        this.angle = ut.random(0, Math.PI);

        this.length = 50;
        this.MAXSIZE = 80;
        this.MINSIZE = 15;
        this.size = 15;

        this.mainColor = ut.randomColor();
        this.midColor = ut.color(this.mainColor, 0.33);
        this.supportColor = ut.color(this.midColor, 0.33);

        this.arr = [];
        this.headPath = [];

        this.arr.push(new Point(this.pos.x, this.pos.y));
        this.headPath.push(new Point(this.pos.x, this.pos.y));
        for (let i = 1; i < this.length; i++) {
            this.arr.push(new Point(this.arr[i - 1].x, this.arr[i - 1].y));
            this.headPath.push(new Point(this.headPath[i - 1].x, this.headPath[i - 1].y));
        }

        this.counter = 0;
        this.intervalId = null;

        this.camera = new Camera(0, 0, game.SCREEN_SIZE.x, game.SCREEN_SIZE.y);

    }

    drawHead() {

        let x0 = this.arr[0].x;
        let y0 = this.arr[0].y;

        let grd = this.ctx.createRadialGradient(x0, y0, this.size * 0.1, x0, y0, 11);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, this.mainColor);


        this.ctx.fillStyle = grd;

        let flicker = Math.sin(Date.now() / 100) * 10 + 20;

        this.ctx.shadowBlur = flicker;
        this.ctx.shadowColor = this.mainColor;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.beginPath();
        this.ctx.arc(parseInt(x0), parseInt(y0), 11, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(parseInt(x0), parseInt(y0), 11, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(parseInt(x0), parseInt(y0), 11, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(parseInt(x0), parseInt(y0), 11, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(parseInt(x0), parseInt(y0), 11, 0, 2 * Math.PI);
        this.ctx.fill();

        let x = this.arr[1].x;
        let y = this.arr[1].y;

        //eye 1
        let d = this.size / 2;
        let p1 = new Point(x + d * Math.cos(this.angle), y + d * Math.sin(this.angle));
        p1 = ut.rotate(p1, this.arr[1], -20);
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
        let p2 = ut.rotate(p1, this.arr[1], 40);
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

    drawBody(x, y, index) {

        let baseColorValue = 255 - (index % 10) * 25;
        if (Math.floor(index / 10) % 2 === 1) {
            baseColorValue = 255 - baseColorValue;
        }

        let baseColor = `rgb(${baseColorValue}, ${baseColorValue}, ${baseColorValue})`;

        let grd = this.ctx.createRadialGradient(x, y, this.size * 0.1, x, y, this.size);
        grd.addColorStop(0, this.supportColor);
        grd.addColorStop(0.5, baseColor);
        grd.addColorStop(1, this.supportColor);

        let radius = this.size;

        if (radius < 0) {
            radius = 1;
        }

        let flicker = Math.sin(Date.now() / 50 - index / (this.size / 2)) * 10 + this.size;

        this.ctx.shadowBlur = flicker;
        this.ctx.shadowColor = this.supportColor;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;



        this.ctx.beginPath();
        this.ctx.fillStyle = grd;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    move() {

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.headPath.push({ x: this.pos.x, y: this.pos.y });

        if (this.headPath.length > this.length) {
            this.headPath.shift();
        }

        for (let i = this.length - 1; i > 0; i--) {
            this.arr[i].x = this.headPath[this.headPath.length - 1 - i].x - this.camera.x;
            this.arr[i].y = this.headPath[this.headPath.length - 1 - i].y - this.camera.y;
            this.drawBody(this.arr[i].x, this.arr[i].y, i);
        }

        this.drawHead();

        this.camera.follow(this.position);
    }

    changeAngle(angle) {
        this.angle = angle;
    }

}