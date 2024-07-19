class Danger {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.pos = new Point(x, y);

        this.size = 15;

        this.mainColor = ut.randomColor();
    }

    draw(player) {
        this.pos.x -= player.velocity.x;
        this.pos.y -= player.velocity.y;

        let grd = this.ctx.createRadialGradient(this.pos.x, this.pos.y, this.size * 0.1, this.pos.x, this.pos.y, this.size);
        grd.addColorStop(0, 'rgb(255, 192, 191)');
        grd.addColorStop(1, 'rgb(194, 5, 5)');


        this.ctx.fillStyle = grd;

        let flicker = Math.sin(Date.now() / 200) * 20 + 30;
        this.ctx.shadowBlur = flicker;
        this.ctx.shadowColor = 'red';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.beginPath();
        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    die() {
        let index = game.danger.indexOf(this);
        game.danger.splice(index, 1);
    }
}