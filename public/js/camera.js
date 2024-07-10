class Camera {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = 1;
    }

    follow(point) {
        this.x = point.x - this.width / 2 / this.scale;
        this.y = point.y - this.height / 2 / this.scale;
    }

    setScale(scale) {
        this.scale = scale;
    }

    applyTransform(ctx) {
        ctx.setTransform(this.scale, 0, 0, this.scale, -this.x * this.scale, -this.y * this.scale);
    }
}