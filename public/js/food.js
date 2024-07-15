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

        let grd = this.ctx.createRadialGradient(this.pos.x, this.pos.y, this.size * 0.1, this.pos.x, this.pos.y, this.size);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, this.mainColor);


        this.ctx.fillStyle = grd;

        let flicker = Math.sin(Date.now() / 100) * 10 + 20;
        this.ctx.shadowBlur = flicker;
        this.ctx.shadowColor = 'white';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.beginPath();
        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    die() {
        let index = game.foods.indexOf(this);
        game.foods.splice(index, 1);
    }
}