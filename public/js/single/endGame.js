class FireworksDisplay
{
    constructor()
    {
        this.createCanvas();
        this.firework = new JS_FIREWORKS.Fireworks({
            id: 'fireworks-canvas',
            hue: 120,
            particleCount: 350,
            delay: 0,
            minDelay: 2.5,
            maxDelay: 7.5,
            boundaries: {
                top: 50,
                bottom: 240,
                left: 50,
                right: 1700
            },
            fireworkSpeed: 2,
            fireworkAcceleration: 1.05,
            particleFriction: .965,
            particleGravity: 1.5
        });
        this.firework.start();
    }

    createCanvas()
    {
        let cs = document.createElement('canvas');
        cs.id = "fireworks-canvas";
        cs.width = 1920;
        cs.height = 1080;
        document.body.append(cs);
    }

}

// Create an instance of the FireworksDisplay class to start the show
new FireworksDisplay();

class JS_FIREWORKS
{
    static Fireworks = class
    {
        constructor(options)
        {
            'use strict';
            options = options || {};
            this.canvas = document.getElementById(options.id || 'fireworks-canvas');
            this.ctx = this.canvas.getContext ? this.canvas.getContext('2d') : null;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.hue = options.hue || 120;
            this.isRunning = false;
            this.fireworks = [];
            this.particles = [];
            this.particleCount = options.particleCount || 50;
            this.tick = 0;
            this.delay = options.delay || 30;
            this.minDelay = options.minDelay || 30;
            this.maxDelay = options.maxDelay || 90;
            this.boundaries = options.boundaries || {
                top: 50,
                bottom: this.height * .5,
                left: 50,
                right: this.width - 50
            };
            this.loop = JS_FIREWORKS.getRenderLoop();
            this.randRange = JS_FIREWORKS.randomRange;
            this.randIntRange = JS_FIREWORKS.randomIntRange;
            this.Firework = JS_FIREWORKS.Firework;
            this.Particle = JS_FIREWORKS.Particle;

            JS_FIREWORKS.Fireworks.settings = {
                fireworkSpeed: options.fireworkSpeed || 2,
                fireworkAcceleration: options.fireworkAcceleration || 1.05,
                particleFriction: options.particleFriction || .95,
                particleGravity: options.particleGravity || 1.5
            };

            JS_FIREWORKS.Fireworks.version = '1.0.2';
        }

        start()
        {
            this.isRunning = true;
            this.fireworks = [];
            this.particles = [];
            this.render();
        }

        stop()
        {
            this.isRunning = false;
            this.clear();
        }

        clear()
        {
            if (!this.ctx) return;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        render()
        {
            if (!this.ctx || !this.isRunning) return;
            let tmp, count;
            this.loop(() => this.render());
            this.hue += 0.5;
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalCompositeOperation = 'lighter';
            tmp = this.fireworks.length;
            while (tmp--)
            {
                this.fireworks[tmp].draw();
                this.fireworks[tmp].update((x, y, hue) =>
                {
                    count = this.particleCount;
                    while (count--)
                    {
                        this.particles.push(new this.Particle(x, y, this.ctx, hue));
                    }
                    this.fireworks.splice(tmp, 1);
                });
            }
            tmp = this.particles.length;
            while (tmp--)
            {
                this.particles[tmp].draw();
                this.particles[tmp].update(() =>
                {
                    this.particles.splice(tmp, 1);
                });
            }
            if (this.tick === this.delay)
            {
                this.fireworks.push(new this.Firework(
                    this.width * .5,
                    this.height,
                    this.randIntRange(this.boundaries.left, this.boundaries.right),
                    this.randIntRange(this.boundaries.top, this.boundaries.bottom),
                    this.ctx,
                    this.hue
                ));
                this.delay = this.randIntRange(this.minDelay, this.maxDelay);
                this.tick = 0;
            }
            this.tick++;
        }
    }

    static Firework = class
    {
        constructor(x1, y1, x2, y2, context, hue)
        {
            'use strict';
            this.x = x1;
            this.y = y1;
            this.sx = x1;
            this.sy = y1;
            this.dx = x2;
            this.dy = y2;
            this.ctx = context;
            this.totalDistance = 0;
            this.currentDistance = 0;
            this.coordinates = [];
            this.coordinateCount = 3;
            this.angle = 0;
            this.speed = JS_FIREWORKS.Fireworks.settings.fireworkSpeed;
            this.acceleration = JS_FIREWORKS.Fireworks.settings.fireworkAcceleration;
            this.hue = hue;
            this.brightness = 0;
            this.randIntRange = JS_FIREWORKS.randomIntRange;
            this.distance = JS_FIREWORKS.distance;
            this.sin = Math.sin;
            this.cos = Math.cos;

            this.totalDistance = this.distance(this.sx, this.sy, this.dx, this.dy);
            while (this.coordinateCount--)
            {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(this.dy - this.sy, this.dx - this.sx);
            this.brightness = this.randIntRange(50, 70);
        }

        update(callback)
        {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.acceleration;
            const vx = this.cos(this.angle) * this.speed;
            const vy = this.sin(this.angle) * this.speed;
            this.currentDistance = this.distance(this.sx, this.sy, this.x + vx, this.y + vy);
            if (this.currentDistance >= this.totalDistance)
            {
                callback(this.dx, this.dy, this.hue);
            }
            else
            {
                this.x += vx;
                this.y += vy;
            }
        }

        draw()
        {
            const last = this.coordinates.length - 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.coordinates[last][0], this.coordinates[last][1]);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
            this.ctx.stroke();
        }
    }

    static Particle = class
    {
        constructor(x, y, context, hue)
        {
            'use strict';
            this.x = x;
            this.y = y;
            this.ctx = context;
            this.coordinates = [];
            this.coordinateCount = 5;
            this.angle = 0;
            this.speed = 0;
            this.friction = JS_FIREWORKS.Fireworks.settings.particleFriction;
            this.gravity = JS_FIREWORKS.Fireworks.settings.particleGravity;
            this.hue = hue;
            this.brightness = 0;
            this.alpha = 1;
            this.decay = 0;
            this.randRange = JS_FIREWORKS.randomRange;
            this.randIntRange = JS_FIREWORKS.randomIntRange;
            this._2PI = Math.PI * 2;
            this.sin = Math.sin;
            this.cos = Math.cos;

            while (this.coordinateCount--)
            {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = this.randRange(0, this._2PI);
            this.speed = this.randIntRange(1, 10);
            this.hue = this.randIntRange(this.hue - 20, this.hue + 20);
            this.brightness = this.randIntRange(50, 80);
            this.decay = this.randRange(.015, .03);
        }

        update(callback)
        {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += this.cos(this.angle) * this.speed;
            this.y += this.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            if (this.alpha <= this.decay)
            {
                callback();
            }
        }

        draw()
        {
            const last = this.coordinates.length - 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.coordinates[last][0], this.coordinates[last][1]);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
            this.ctx.stroke();
        }
    }

    static randomRange(min, max)
    {
        return (Math.random() * (max - min) + min);
    }

    static randomIntRange(min, max)
    {
        return JS_FIREWORKS.randomRange(min, max) | 0;
    }

    static distance(x1, y1, x2, y2)
    {
        const pow = Math.pow;
        return Math.sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    }

    static getRenderLoop()
    {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback)
            {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }
}
