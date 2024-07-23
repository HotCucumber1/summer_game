class Food
{
    constructor(ctx, x, y, color)
    {
        this.ctx = ctx;
        this.pos = new Point(x, y);

        this.size = 5;
        this.mainColor = color;
        this.isEaten = false;
        this.realPos = new Point(x, y);
    }

    draw()
    {
        this.ctx.fillStyle = this.mainColor;

        this.ctx.shadowBlur = 20;               // радиус размытия тени
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