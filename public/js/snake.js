class Snake {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        this.defaultSpeed = 4;
        this.speed = this.defaultSpeed;
        this.boost = false;
        this.state = 0;
        this.dead = false;

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

        this.ora = new Audio("../public/audio/oraora.mp3");
        this.ora.volume = 1.0;
        this.ora.muted = false;
        this.ora.load();

        this.death = new Audio("../public/audio/minecraft-death-sound.mp3");
        this.death.volume = 1.0;
        this.death.muted = false;
        this.death.load();

    }

    drawRetina(p, angle) {
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p.x + Math.cos(angle), p.y + Math.sin(angle), 0.23 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawEye(p) {
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 0.42 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawHead(angle) {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.supportColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        let d = this.size / 2;

        //eye 1
        let p1 = new Point(x + d * Math.cos(angle), y + d * Math.sin(angle));
        p1 = ut.rotate(p1, this.arr[0], -20);
        this.drawEye(p1);
        this.drawRetina(p1, angle);

        //eye2
        let p2 = ut.rotate(p1, this.arr[0], 40);
        this.drawEye(p2)
        this.drawRetina(p2, angle);
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

        let flicker = Math.sin(Date.now() / 75 - index / (this.size / 2)) * 10 + this.size;

        if (radius > 30) {

            flicker = Math.sin(Date.now() / 75 - index / (radius / 2)) * 20 + 2 * radius / 4;

            if (index % 3 === 1) {

                this.ctx.shadowBlur = (this.boost && this.length > 10) ? flicker : 20;
                this.ctx.shadowColor = (this.boost && this.length > 10) ? this.supportColor : `rgb(0, 0, 0, 0.3)`;
                this.ctx.shadowOffsetX = (this.boost && this.length > 10) ? 0 : 3;
                this.ctx.shadowOffsetY = (this.boost && this.length > 10) ? 0 : 3;

            } else {

                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = `rgb(0, 0, 0, 0.3)`;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            }

        } else {

            this.ctx.shadowBlur = (this.boost && this.length > 10) ? flicker : 20;
            this.ctx.shadowColor = (this.boost && this.length > 10) ? this.supportColor : `rgb(0, 0, 0, 0.3)`;
            this.ctx.shadowOffsetX = (this.boost && this.length > 10) ? 0 : 3;
            this.ctx.shadowOffsetY = (this.boost && this.length > 10) ? 0 : 3;

        }

        if (this.dead) {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = `rgba(0, 0, 0, 0)`;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = grd;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    boostMove() {
        if (this.boost && this.length > 10) {
            this.speed = 8;

            this.ora.play();

            if (this.intervalId === null) {
                this.intervalId = setInterval(() => {
                    this.counter++;
                }, 1000);
            }

            if (this.counter >= 1) {

                this.counter = 0;
                game.foods.push(new Food(this.ctx, this.arr[this.length - 1].x, this.arr[this.length - 1].y));
                this.length--;
                this.arr.shift();
                this.headPath.shift();
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

        this.headPath.push({ x: this.pos.x, y: this.pos.y });

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

        if (this.dead) {
            this.die();
            this.speed = 0;
        } else {

            this.boostMove();

            this.moveCalc()
            this.camera.follow(this.pos);
            this.drawHead(this.angle);

            this.checkCollissionFood();
            this.checkCollissionBonus();
            this.checkCollissionDanger();
            this.checkCollissionSnake()
            this.checkCollissionBorder();
            this.setSize();
        }
    }

    setSize() {
        if (this.length % 5 === 0) this.size = (this.length / 5) / 2 + 13;
        if (this.size > this.MAXSIZE) this.size = this.MAXSIZE;
        if (this.size < this.MINSIZE) this.size = this.MINSIZE;
    }

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

    diminishLength(size) {
        if (this.length - size > 0) {
            this.length -= size;
        } else {
            this.length = 0;
        }

        for (let i = 0; i < size; i++) {
            this.arr.splice(i, 1);
            this.headPath.splice(i, 1);
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

    checkCollissionDanger() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        for (let i = 0; i < game.danger.length; i++) {
            if (ut.cirCollission(x, y, this.size + 3, game.danger[i].pos.x,
                game.danger[i].pos.y, game.danger[i].size)) {
                this.diminishLength(game.danger[i].size);
                game.danger[i].die();

                if (this === game.snakes[0]) {

                    let danger = new Audio("../public/audio/hit.mp3");
                    danger.volume = 1.0;
                    danger.muted = false;
                    danger.play();

                    break;
                }
            }
        }
    }

    checkCollissionBonus() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        for (let i = 0; i < game.moving.length; i++) {
            if (ut.cirCollission(x, y, this.size + 3, game.moving[i].pos.x,
                game.moving[i].pos.y, game.moving[i].size)) {
                this.addLength(game.moving[i].size);
                game.moving[i].die();

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
        if (window.innerWidth > 1920) {
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
                    this.dead = true;

                    break;
                }
        }
    }

    checkCollissionBorder() {
        let center = new Point(game.world.x + game.WORLD_SIZE.x / 2, game.world.y + game.WORLD_SIZE.y / 2);

        if (ut.getDistance(this.arr[0], center) + this.size > game.ARENA_RADIUS)
            this.dead = true;
    }

    changeAngle(angle) {
        this.angle = angle;
    }

    rgbaColor(color, alpha) {
        const hex = color.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    drawEffect(arr, angle) {
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

            },
            complete: () => {

                document.body.classList.remove("fade-in");
                document.body.classList.add("fade-out");

                setTimeout(function () {
                    window.location.href = "menu.html";
                }, 500)
            }
        });
    }

    die() {
        let last = this.length - 1;
        let arrayBody = [];

        for (let i = last; i > 0; i--) {
            game.foods.push(new Food(this.ctx, this.arr[i].x, this.arr[i].y));
            arrayBody.push({
                x: this.arr[i].x,
                y: this.arr[i].y,
            });
            this.arr.splice(i, 1);
        }

        this.death.play();

        this.drawEffect(arrayBody, this.angle);

        this.velocity = new Point(0, 0);
    }

}