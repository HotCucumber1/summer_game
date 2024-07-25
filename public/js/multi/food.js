class Food
{
    constructor(ctx, x, y, color, isReal=true)
    {
        this.ctx = ctx;
        this.pos = new Point(x, y);

        this.size = 5;
        this.mainColor = color;
        this.isEaten = false;
        this.realPos = new Point(x, y);
        this.isReal = isReal;
    }

    draw()
    {
        let flicker = Math.sin(Date.now() / 100) * 10 + 20;

        this.ctx.fillStyle = this.mainColor;

        this.ctx.shadowBlur = flicker;          // радиус размытия тени
        this.ctx.shadowColor = this.mainColor;  // цвет свечения
        this.ctx.shadowOffsetX = 0;             // смещение тени по X
        this.ctx.shadowOffsetY = 0;             // смещение тени по Y

        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    }
}