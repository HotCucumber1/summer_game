class Snake
{
    constructor(ctx, id, x, y, score, speed, radius, color)
    {
        this.camera = new Camera(
            -game.SCREEN_SIZE.x, -game.SCREEN_SIZE.y,
            game.SCREEN_SIZE.x, game.SCREEN_SIZE.y
        );

        this.ctx = ctx;
        this.id = id;
        this.score = score;
        this.speed = speed;
        this.boost = false;
        this.state = 0;
        this.isWon = false;

        this.pos = new Point(x, y);
        this.velocity = new Point(0, 0);
        this.angle = Math.PI / 2; // ut.random(0, Math.PI);

        this.length = 20; // body.length + 1; // + head
        this.MAXSIZE = 50;
        this.MINSIZE = 15;
        this.size = radius;
        this.MAXLENGTH = 200;

        this.mainColor = color;

        this.arr = [];
        this.headPath = [];

        this.arr.push(
            new Point(
                this.pos.x,
                this.pos.y
            )
        );
        this.headPath.push(
            new Point(
                this.pos.x,
                this.pos.y
            )
        );

        for (let i = 1; i < this.length; i++)
        {
            this.arr.push(
                new Point(
                    this.arr[i - 1].x,
                    this.arr[i - 1].y
                )
            );
            this.headPath.push(
                new Point(
                    this.headPath[i - 1].x,
                    this.headPath[i - 1].y
                )
            );
        }

        this.counter = 0;
        this.intervalId = null;
        this.death = new Audio("audio/minecraft-death-sound.mp3");
        this.death.volume = 0.6;
        this.death.muted = false;
        this.death.load();
        this.soundPlayed = false;
    }

    drawRetina(p)
    {
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p.x + Math.cos(this.angle), p.y + Math.sin(this.angle), 0.23 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawEye(p)
    {
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 0.42 * this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawHead()
    {
        let x = this.arr[0].x;
        let y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.mainColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        let d = this.size / 2;
        //eye 1
        let p1 = new Point(
            x + d * Math.cos(this.angle),
            y + d * Math.sin(this.angle)
        );
        p1 = ut.rotate(p1, this.arr[0], -20);
        this.drawEye(p1);
        this.drawRetina(p1);

        //eye2
        let p2 = ut.rotate(p1, this.arr[0], 40);
        this.drawEye(p2)
        this.drawRetina(p2);

        //name
        game.ctxSnake.fillStyle = this.mainColor;
        game.ctxSnake.font = "bold 24px Arial";
        let nickname = this.id;
        game.ctxSnake.fillText(nickname, x + 20, y);
    }

    drawBlur(flicker)
    {
        this.ctx.shadowBlur = (this.boost && this.length > 10) ? flicker : 20;
        this.ctx.shadowColor = (this.boost && this.length > 10) ? this.mainColor : `rgb(0, 0, 0, 0.3)`;
        this.ctx.shadowOffsetX = (this.boost && this.length > 10) ? 0 : 3;
        this.ctx.shadowOffsetY = (this.boost && this.length > 10) ? 0 : 3;
    }

    drawBody(x, y, index)
    {
        let baseColorValue = 255 - (index % 10) * 25;
        if (Math.floor(index / 10) % 2 === 1)
        {
            baseColorValue = 255 - baseColorValue;
        }

        let baseColor = `rgb(${baseColorValue}, ${baseColorValue}, ${baseColorValue})`;

        let grd = this.ctx.createRadialGradient(x, y, this.size * 0.1, x, y, this.size);
        grd.addColorStop(0, this.mainColor);
        grd.addColorStop(0.5, baseColor);
        grd.addColorStop(1, this.mainColor);

        let radius = this.size;
        if (radius < 0)
        {
            radius = 1;
        }

        let flicker = Math.sin(Date.now() / 75 - index / (this.size / 2)) * 10 + this.size;
        if (radius > 30)
        {
            flicker = Math.sin(Date.now() / 50 - index / (radius / 2)) * 20 + 2 * radius / 3;
            if (index % 3 === 1)
            {
                this.drawBlur(flicker);
            }
            else
            {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = `rgb(0, 0, 0, 0.3)`;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            }
        }
        else
        {
            this.drawBlur(flicker);
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = grd;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    boostMove()
    {
        if (this.boost && this.length > 10)
        {
            this.speed = 15;
            if (this.intervalId === null)
            {
                this.intervalId = setInterval(() => this.counter++, 1000);
            }
            if (this.counter >= 1)
            {
                this.arr.pop();
                this.length--;
                this.counter = 0;
            }
        }
        else
        {
            this.speed = 6;
        }
    }

    drawSnake()
    {
        for (let i = this.length - 1; i > 0; i--)
        {
            this.drawBody(this.arr[i].x, this.arr[i].y, i);
        }
        this.drawHead();
        this.setSize();
    }

    move()
    {
        this.boostMove();

        this.velocity.x = this.speed * Math.cos(this.angle);
        this.velocity.y = this.speed * Math.sin(this.angle);

        this.headPath.push({
            x: this.pos.x,
            y: this.pos.y
        });

        if (this.headPath.length > this.length)
        {
            this.headPath.shift();
        }

        for (let i = this.arr.length - 1; i > 0; i--)
        {
            if (this.headPath[this.headPath.length - 1 - i])
            {
                this.arr[i].x = this.headPath[this.headPath.length - 1 - i].x - this.camera.x;
                this.arr[i].y = this.headPath[this.headPath.length - 1 - i].y - this.camera.y;
                this.drawBody(this.arr[i].x, this.arr[i].y, i);
            }
        }

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.camera.follow(this.pos);
        this.drawHead();

        this.setSize();
        if (!this.isWon)
        {
            this.checkCollisionFood();
        }
    }

    setSize()
    {
        if (this.length % 5 === 0)
        {
            this.size = this.length / 5 + 13;
        }
        if (this.size > this.MAXSIZE)
        {
            this.size = this.MAXSIZE;
        }
        if (this.size < this.MINSIZE)
        {
            this.size = this.MINSIZE;
        }
    }

    addLength()
    {
        if (this.arr.length < this.MAXLENGTH)
        {
            this.length++;
            this.arr.push(new Point(-100, -100));
        }
    }

    decreaseFiveLength()
    {
        if ((this.arr.length - 5) >= this.MINSIZE)
        {
            for (let i = 0; i < 5; i++)
            {
                this.arr.pop();
                this.length--;
            }
        }
    }

    addFiveLength()
    {
        if ((this.arr.length + 5) < this.MAXLENGTH)
        {
            for (let i = 0; i < 5; i++)
            {
                this.arr.push(new Point(-100, -100));
                this.length++;
            }
        }
    }

    checkCollisionFood()
    {
        let x = this.arr[0].x;
        let y = this.arr[0].y;
        for (let i = game.foods.length - 1; i >= 0; i--)
        {
            if (!game.foods[i].isEaten &&
                ut.cirCollision(x, y, this.size + 3, game.foods[i].pos.x, game.foods[i].pos.y, game.foods[i].size))
            {
                if (game.foods[i] instanceof DangerFood)
                {
                    if (Math.random() >= 0.5)
                    {
                        this.decreaseFiveLength();
                    }
                    else
                    {
                        this.addFiveLength();
                    }
                }
                else
                {
                    this.addLength();
                }
                game.foods.splice(i, 1);
                // game.foods[i].isEaten = true;

                if (this.id === localStorage.getItem('nickname'))
                {
                    this.pop = new Audio("audio/pop.mp3");
                    this.pop.volume = 0.6;
                    if (!this.soundPlayed)
                    {
                        this.pop.play();
                        this.soundPlayed = true;
                        setTimeout(() =>
                        {
                            this.soundPlayed = false
                        }, 100);
                    }
                }
                break;
            }
        }
    }

    rgbaColor(color, alpha)
    {
        const hex = color.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    drawEffect(arr)
    {
        this.ctx.shadowBlur = 0; // радиус размытия тени
        this.ctx.shadowColor = this.mainColor; // цвет свечения
        this.ctx.shadowOffsetX = 0; // смещение тени по X
        this.ctx.shadowOffsetY = 0;

        let alpha = 1;
        const fadeStep = 0.01;
        const fadeDuration = 1000;
        const fadeInterval = fadeDuration * fadeStep;

        const fadeEffect = () =>
        {
            let rgbaColor = this.rgbaColor(this.mainColor, alpha);
            if (alpha > 0)
            {
                alpha -= fadeStep;
                this.ctx.shadowBlur++;

                // Очищаем канвас перед перерисовкой (если нужно)
                if (this.id === localStorage.getItem('nickname'))
                {
                    game.ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
                }

                // Рисуем эффект
                for (let i = arr.length - 1; i >= 0; i--)
                {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = rgbaColor;

                    this.ctx.arc(arr[i].x, arr[i].y, this.size, 0, 2 * Math.PI);
                    this.ctx.fill();
                }

                // Вызываем следующий кадр
                setTimeout(() => requestAnimationFrame(fadeEffect), fadeInterval);
            }
            else
            {
                // this.ctx.globalAlpha = 0; // Устанавливаем окончательно, если alpha стал отрицательным
                if (this.id === localStorage.getItem('nickname'))
                {
                    document.body.classList.remove("fade-in");
                    document.body.classList.add("fade-out");
                    setTimeout(() =>
                    {
                        conn.close();
                    }, 500);
                }
            }
        }
        fadeEffect();
    }

    changeAngle(angle)
    {
        this.angle = angle;
    }

    die()
    {
        let arrayBody = [];
        for (let i = this.arr.length - 1; i >= 1; i--)
        {
            game.foods.push(
                new Food(
                    game.ctxSnake,
                    this.arr[i].x,
                    this.arr[i].y,
                    this.mainColor,
                )
            );

            arrayBody.push({
                x: this.arr[i].x,
                y: this.arr[i].y,
            });
            this.arr.splice(i, 1);
        }

        if (this.id === localStorage.getItem('nickname'))
        {
            this.death.play();
        }

        if (this.id === localStorage.getItem('nickname'))
        {
            this.drawEffect(arrayBody);
        }
        delete game.snakes[this.id];
    }

    drawYourLength()
    {
        this.ctx.fillStyle = this.mainColor;
        if (window.innerWidth > 1920)
        {
            this.ctx.font = "bold 24px Arial";
        }
        else
        {
            this.ctx.font = "bold 12px Arial";
        }
        this.ctx.fillText("Your length: " + this.length, 20, window.innerHeight - 20);
    }

    getBodyData()
    {
        let body = [];
        for (let i = 0; i < this.arr.length; i++)
        {
            body.push(
                new Point(
                    Math.round(this.arr[i].x + this.camera.x),
                    Math.round(this.arr[i].y + this.camera.y),
                )
            );
        }
        return body;
    }
}