class Food {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.pos = new Point(x, y);
        this.sizeMin = 5;
        this.sizeMax = 9;

        this.size = ut.random(this.sizeMin, this.sizeMax);

        this.mainColor = ut.randomColor();
    }

    draw(player) {

        this.pos.x -= player.velocity.x;
        this.pos.y -= player.velocity.y;

        this.ctx.fillStyle = this.mainColor;

        this.ctx.shadowBlur = 20; // радиус размытия тени
        this.ctx.shadowColor = this.mainColor; // цвет свечения
        this.ctx.shadowOffsetX = 0; // смещение тени по X
        this.ctx.shadowOffsetY = 0; // смещение тени по Y

        this.ctx.beginPath();
        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    }

    die() {
        let index = game.foods.indexOf(this);
        game.foods.splice(index, 1);
    }
}