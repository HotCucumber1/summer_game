class Snake {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        this.defaultSpeed = 4;
        this.speed = this.defaultSpeed;
        this.boost = false;
        this.state = 0;

        this.pos = new Point(game.world.x + game.WORLD_SIZE.x / 2 + game.SCREEN_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2 + game.SCREEN_SIZE.y / 2);
        this.velocity = new Point(0, 0);
        this.angle = ut.random(0, Math.PI);

        this.length = 10;
        this.MAXSIZE = 60;
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
        this.death = new Audio("../public/audio/minecraft-death-sound.mp3");
        this.death.volume = 1.0;
        this.death.muted = false;
        this.death.load();

    }

    drawRetina(p) {
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p.x + Math.cos(this.angle), p.y + Math.sin(this.angle), 0.23 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawEye(p) {
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 0.42 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawHead() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.supportColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        let d = this.size / 2;

        //eye 1
        let p1 = new Point(x + d * Math.cos(this.angle), y + d * Math.sin(this.angle));
        p1 = ut.rotate(p1, this.arr[0], -20);
        this.drawEye(p1);
        this.drawRetina(p1);

        //eye2
        let p2 = ut.rotate(p1, this.arr[0], 40);
        this.drawEye(p2)
        this.drawRetina(p2);
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

        let flicker = Math.sin(Date.now() / 50 - index / 5) * 10 + 20;

        this.ctx.shadowBlur = (this.boost && this.length > 10) ? flicker : 20; // радиус размытия тени
        this.ctx.shadowColor = (this.boost && this.length > 10) ? this.supportColor : `rgb(0, 0, 0, 0.3)`; // цвет свечения
        this.ctx.shadowOffsetX = (this.boost && this.length > 10) ? 0 : 3; // смещение тени по X
        this.ctx.shadowOffsetY = (this.boost && this.length > 10) ? 0 : 3;

        this.ctx.beginPath();
        this.ctx.fillStyle = grd;
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
            if (this.counter >= 1) {
                this.length--;
                this.arr.shift();
                this.headPath.shift();

                this.counter = 0;
            }
        } else {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            this.speed = this.defaultSpeed;
        }
    }

    moveCalc() {
        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.headPath.push({x: this.pos.x, y: this.pos.y});

        if (this.headPath.length > this.length) {
            this.headPath.shift();
        }

        for (let i = this.length - 1; i > 0; i--) {
            this.arr[i].x = this.headPath[this.headPath.length - 1 - i].x - this.camera.x;
            this.arr[i].y = this.headPath[this.headPath.length - 1 - i].y - this.camera.y;
            this.drawBody(this.arr[i].x, this.arr[i].y, i);
        }

        this.arr[0].x = this.pos.x - this.camera.x;
        this.arr[0].y = this.pos.y - this.camera.y;

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }

    move() {
        this.boostMove();

        this.moveCalc()
        this.camera.follow(this.pos);
        this.drawHead();

        this.checkCollissionFood();
        this.checkCollissionSnake()
        this.checkCollissionBorder();
        this.setSize();
    }

    setSize() {
        if (this.length % 5 === 0) this.size = (this.length / 5) / 2 + 13;
        if (this.size > this.MAXSIZE) this.size = this.MAXSIZE;
        if (this.size < this.MINSIZE) this.size = this.MINSIZE;
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    addLength(size) {
        if (this.size >= 20 && this.size < 30) {
            size -= 1;
        }

        if (this.size >= 30 && this.size < 40) {
            size -= 2;
        }

        if (this.size >= 40 && this.size < 50) {
            size -= 3;
        }

        if (this.size >= 50) {
            size -= 4;
        }

        this.length += (size - 4);

        for (let i = 0; i < (size - 4); i++) {
            this.arr.push(new Point(this.pos.x, this.pos.y));
            this.headPath.push(new Point(this.pos.x, this.pos.y));
        }
    }

    checkCollissionFood() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        for (let i = 0; i < game.foods.length; i++) {
            if (ut.cirCollission(x, y, this.size + 3, game.foods[i].pos.x,
                game.foods[i].pos.y, game.foods[i].size)) {
                this.addLength(game.foods[i].size);
                game.foods[i].die();
                if (this === game.snakes[0]) {

                    let pop = new Audio("../public/audio/pop.mp3");
                    pop.volume = 1.0;
                    pop.muted = false;
                    pop.play();

                    break;
                }
            }
        }
    }

    drawYourLength() {
        this.ctx.fillStyle = this.mainColor;
        if (window.innerWidth > 1920) 
        {
            this.ctx.font = "bold 24px Arial";
            this.ctx.fillText("Your length: " + this.length, 20, window.innerHeight - 20);
        } else {
            this.ctx.font = "bold 12px Arial";
            this.ctx.fillText("Your length: " + this.length, 20, window.innerHeight - 20);
        }
    }

    checkCollissionSnake() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        for (let i = 1; i < game.snakes.length; i++) {
            for (let j = 0; j < game.snakes[i].length; j++)
                if (ut.cirCollission(x, y, this.size, game.snakes[i].arr[j].x,
                    game.snakes[i].arr[j].y, game.snakes[i].size)) {
                    this.die();
                    break;
                }
        }
    }

    drawEffect(arr) {

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
                game.ctxSnake.clearRect(0, 0, canvas.width, canvas.height);

                // Рисуем эффект
                for (let i = arr.length - 1; i >= 0; i--) {

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
                let index = game.snakes.indexOf(this);
                game.snakes.splice(index, 1);

                document.body.classList.remove("fade-in");
                document.body.classList.add("fade-out");

                setTimeout(function () {
                    window.location.href = "menu.html";
                }, 500);
            }
        };

        fadeEffect();
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
        let last = this.length - 1;
        let arrayBody = [];

        for (let i = last; i >= 1; i--) {
            game.foods.push(new Food(game.ctxSnake, this.arr[i].x, this.arr[i].y));
            arrayBody.push({
                x: this.arr[i].x,
                y: this.arr[i].y,
                angle: this.angle
            })
            this.arr.splice(i, 1);
        }

        this.death.play();
        cancelAnimationFrame(updateId);

        this.drawEffect(arrayBody);

        let index = game.snakes.indexOf(this);
        game.snakes.splice(index, 1);
    }

}