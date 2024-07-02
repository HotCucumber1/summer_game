class Food {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.ctxCanvas = document.getElementById("canvasFood")
        this.pos = new Point(x, y);
        this.sizeMin = 2;
        this.sizeMax = 6;
        this.mainColor = ut.randomColor();
        this.supportColor = ut.color(this.mainColor, 0.5);

        this.size = ut.random(this.sizeMin, this.sizeMax);

        this.foodImage = new Image();
        this.foodImage.src = "../public/images/point1.png";

        this.max = 50;
        this.array = [];
        this.radius = 15;
    }

    draw(player) {

        this.pos.x -= player.velocity.x;
        this.pos.y -= player.velocity.y;


        for (let a = 0; a < this.array.length; a++) {
            if (this.array[a].status === 1) {
                this.ctx.drawImage(this.foodImage, parseInt(this.pos.x), parseInt(this.pos.y), this.radius, this.radius);
            } else {
                this.array.splice(a, 1);
                a--;
            }
        }

        this.array.push({
            x: Math.random() * parseInt(this.pos.x),
            y: Math.random() * parseInt(this.pos.y),
            status: 1,
            score: 1
        });

        // for (let a = 0; a < this.array.length; a++) {
        //     if (player.x + player.radius > this.array[a].x &&
        //         player.x - player.radius < this.array[a].x + this.radius &&
        //         player.y + player.radius > this.array[a].y &&
        //         player.y - player.radius < this.array[a].y + this.radius) {
        //
        //         this.array[a].status = 0;
        //         player.score += this.array[a].score;
        //     }
        // }

        // this.ctx.fillStyle = this.mainColor;
        // this.ctx.beginPath();
        // this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size, 0, 2*Math.PI);
        // this.ctx.fill();
        //
        // this.ctx.fillStyle = this.supportColor;
        // this.ctx.beginPath();
        // this.ctx.arc(parseInt(this.pos.x), parseInt(this.pos.y), this.size/2, 0, 2*Math.PI);
        // this.ctx.fill();

        // this.ctx.fillStyle = "whitesmoke";
        // this.ctx.font="10px Arial";
        // this.ctx.fillText(parseInt(this.pos.x) + "," + parseInt(this.pos.y) , this.pos.x, this.pos.y-10);

    }

    die(a) {
        this.array[a].status = 0;
        let index = game.foods.indexOf(this);
        game.foods.splice(index, 1);
    }


}