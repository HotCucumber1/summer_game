class Camera 
{
    constructor(x, y, width, height) 
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    follow(point) 
    {
        this.x = point.x - this.width / 2;
        this.y = point.y - this.height / 2;
    }
}