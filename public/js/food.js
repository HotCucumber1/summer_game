class Food {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.pos = new Point(x, y);
        this.sizeMin = 5;
        this.sizeMax = 9;

        this.size = 7;//ut.random(this.sizeMin, this.sizeMax);

        this.mainColor = color;//ut.randomColor();
    }

    draw(player) {
        this.ctx.fillStyle = this.mainColor;

        this.ctx.shadowBlur = 20;               // радиус размытия тени
        this.ctx.shadowColor = this.mainColor;  // цвет свечения
        this.ctx.shadowOffsetX = 0;             // смещение тени по X
        this.ctx.shadowOffsetY = 0;             // смещение тени по Y

        this.ctx.beginPath();
        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2*Math.PI);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    }

    die() {
        let index = game.foods.indexOf(this);
        game.foods.splice(index, 1);
    }
}