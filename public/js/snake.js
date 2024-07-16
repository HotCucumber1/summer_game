class Snake
{
    constructor(ctx, id, x, y, score, speed, radius, color) {
        this.ctx = ctx;
        this.id = id;
        this.score = score;
        this.speed = speed;
        this.boost = false;
        this.state = 0;

        this.pos = new Point(x, y);
        this.velocity = new Point(0, 0);
        this.angle = ut.random(0, Math.PI);

        this.length = 20;// body.length + 1; // + head
        this.MAXSIZE = 50;
        this.MINSIZE = 15;
        this.size = radius;
        this.MAXLENGTH = 200;

        this.mainColor = color;
        this.midColor = ut.color(this.mainColor, 0.33);
        this.supportColor = ut.color(this.midColor, 0.33);

        this.arr = [];
        this.headPath = [];

        this.arr.push(new Point(this.pos.x,  this.pos.y));
        this.headPath.push(new Point(this.pos.x,  this.pos.y));

        for (let i = 1; i < this.length; i++)
        {
            this.arr.push(new Point(this.arr[i - 1].x, this.arr[i - 1].y));
            this.headPath.push(new Point(this.headPath[i - 1].x, this.headPath[i - 1].y));
        }

        this.counter = 0;
        this.intervalId = null;

        this.camera = new Camera(0, 0, game.SCREEN_SIZE.x, game.SCREEN_SIZE.y);
        this.death = new Audio("audio/minecraft-death-sound.mp3");
        this.death.volume = 0.6;
        this.death.muted = false;
        this.death.load();

        this.pop = new Audio("audio/pop.mp3");
        this.pop.volume = 1.0;
        this.pop.load();
        // this.pop.muted = false;
    }

    drawHead() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.supportColor;
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
        if (radius < 0)
            radius = 1;

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
        if (this.boost && this.length > 10)
        {
            this.ctx.shadowBlur = 20; // радиус размытия тени
            this.ctx.shadowColor = this.supportColor; // цвет свечения
            this.ctx.shadowOffsetX = 0; // смещение тени по X
            this.ctx.shadowOffsetY = 0;
            this.speed = 15;
            if (this.intervalId === null)
            {
                this.intervalId = setInterval(() => {
                    this.counter++;
                }, 1000);
            }
            if (this.counter >= 1)
            {
                this.length--;
                this.counter = 0;
            }
        }
        else
        {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            this.speed = 6;
        }
    }

    drawSnake()
    {
        this.drawHead();
        let x, y;
        for (let i = this.length - 1; i > 0; i--)
        {
            x = this.arr[i].x; //- game.snakeUser.pos.x + game.SCREEN_SIZE.x / 2;
            y = this.arr[i].y; //- game.snakeUser.pos.y + game.SCREEN_SIZE.y / 2;
            this.drawBody(x, y);
        }
        this.setSize();
    }

    move() {
        this.boostMove();

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.headPath.push({ x: this.pos.x, y: this.pos.y });

        if (this.headPath.length > this.length)
        {
            this.headPath.shift();
        }

        for (let i = this.length - 1; i > 0; i--)
        {
            this.arr[i].x = this.headPath[this.headPath.length - 1 - i].x - this.camera.x;
            this.arr[i].y = this.headPath[this.headPath.length - 1 - i].y - this.camera.y;
            this.drawBody(this.arr[i].x, this.arr[i].y);
        }

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.camera.follow(this.pos);
        this.drawHead();

        this.setSize();
        this.checkCollissionFood();
        //this.checkCollissionSnake()
        //this.checkCollissionBorder();
    }

    setSize() {
        if (this.length % 5 === 0)
           this.size = this.length / 5 + 13;
        if (this.size > this.MAXSIZE)
            this.size = this.MAXSIZE;
        if (this.size < this.MINSIZE)
            this.size = this.MINSIZE;
    }

    addLength() {
        if (this.arr.length < this.MAXLENGTH)
        {
            this.length++;
            this.arr.push(new Point(-100, -100));
        }
    }

    checkCollissionFood() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;
        for (let i = 0; i < game.foods.length; i++) {
            if (!game.foods[i].eaten &&
                ut.cirCollission(x, y, this.size + 3, game.foods[i].pos.x, game.foods[i].pos.y, game.foods[i].size))
            {
                this.addLength(game.foods[i].size);
                game.foods[i].die();

                if (this.id === 0)
                {
                    this.pop.pause();
                    this.pop = new Audio("audio/pop.mp3");
                    this.pop.volume = 1.0;
                    this.pop.play();
                }

                return;
            }
        }
    }

    checkCollissionSnake() {
        let x = this.arr[0].x;
        let y = this.arr[0].y;
        for (let i = 1; i < game.snakes.length; i++) {
            for (let j = 0; j < game.snakes[i].arr.length; j++)
            if (ut.cirCollission(x, y, this.size + 3, game.snakes[i].arr[j].x,
                game.snakes[i].arr[j].y, game.snakes[i].size)) {
                this.die();
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
            if (alpha > 0)
            {
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
            }
            else
            {
                this.ctx.globalAlpha = 0; // Устанавливаем окончательно, если alpha стал отрицательным
                let index = game.snakes.indexOf(this);
                game.snakes.splice(index, 1);

                document.body.classList.remove("fade-in");
                document.body.classList.add("fade-out");

                setTimeout(function () {
                    conn.close();
                    window.location.href = "/menu";
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

        for (let i= last; i >= 1; i--) {
            game.foods.push(new Food(game.ctxSnake, this.arr[i].x, this.arr[i].y));
            arrayBody.push({
                x: this.arr[i].x,
                y: this.arr[i].y,
                angle: this.angle
            });
            this.arr.splice(i, 1);
        }

        this.death.play();
        // cancelAnimationFrame(updateId);

        this.drawEffect(arrayBody);

        let index = game.snakes.indexOf(this);
        game.snakes.splice(index, 1);
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
}