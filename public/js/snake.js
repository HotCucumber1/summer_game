class Snake{
    constructor(ctx, id){
        this.ctx = ctx;
        this.id = id;
        this.score = 0;
        this.speed =  5;
        this.boost = false;
        this.state = 0;

        this.counter = 0;
        this.intervalId = null;


        this.pos = new Point(game.SCREEN_SIZE.x/2, game.SCREEN_SIZE.y/2);
        this.velocity = new Point(0, 0); //arbitary point
        this.angle = ut.random(0, Math.PI);

        this.length = 20;
        this.MAXSIZE = 22;
        this.size = 13;

        // color
        this.mainColor = ut.randomColor();
        this.midColor = ut.color(this.mainColor, 0.33);
        this.supportColor = ut.color(this.midColor, 0.33);

        this.arr = [];
        this.arr.push(new Point(game.SCREEN_SIZE.x/2, game.SCREEN_SIZE.y/2));
        for(var i=1; i<this.length; i++){
            this.arr.push(new Point(this.arr[i-1].x, this.arr[i-1].y));
        }

    }

    drawHead(){

        var x = this.arr[0].x;
        var y = this.arr[0].y;

        //head
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size+1, 0, 2*Math.PI);
        this.ctx.fill();


        //eye 1
        var d = this.size/2;
        var p1 = new Point(x + d*Math.cos(this.angle), y+ d*Math.sin(this.angle));
        p1 = ut.rotate(p1, this.arr[0], -20);
        //eye
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, this.size/2, 0, 2*Math.PI);
        this.ctx.fill();

        //retina
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p1.x + Math.cos(this.angle), p1.y + Math.sin(this.angle), this.size/4, 0, 2*Math.PI);
        this.ctx.fill();


        //eye2
        var p2 = ut.rotate(p1, this.arr[0], 40);
        //eye
        this.ctx.fillStyle = "whitesmoke";
        this.ctx.beginPath();
        this.ctx.arc(p2.x, p2.y, this.size/2, 0, 2*Math.PI);
        this.ctx.fill();

        //retina
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(p2.x + Math.cos(this.angle), p2.y + Math.sin(this.angle), this.size/4, 0, 2*Math.PI);
        this.ctx.fill();

    }

    drawBody(x, y, i){

        var grd=this.ctx.createRadialGradient(x, y, 2, x+4, y+4, 10);
        grd.addColorStop(0, this.supportColor);
        grd.addColorStop(1, this.midColor);

        var radius = this.size - (i*0.01);
        if(radius < 0) radius = 1;

        this.ctx.beginPath();
        this.ctx.fillStyle = this.mainColor;
        this.ctx.arc(x, y, radius+1, 0, 2*Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = grd;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2*Math.PI);
        this.ctx.fill();

    }

    move(){
        if (this.boost && this.length > 10)
        {
            this.speed = 15;
            if (this.intervalId === null) {
                console.log('intervalId cycle');
                this.intervalId = setInterval(() => {  this.counter++; }, 1000);
                console.log(this.counter);
            }
            console.log('boost and length cycle');
            if (this.counter >= 3)
            {
                this.counter = 0;
                this.length --
            }
        }
        else
            this.speed = 5;

        this.velocity.x = this.speed*Math.cos(this.angle);
        this.velocity.y = this.speed*Math.sin(this.angle);

        //magic
        var d = this.size/2;
        for(var i=this.length-1; i>=1; i--){
            this.arr[i].x = this.arr[i-1].x - d*Math.cos(this.angle);
            this.arr[i].y = this.arr[i-1].y - d*Math.sin(this.angle);
            this.drawBody(this.arr[i].x, this.arr[i].y, i);
        }

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        this.drawHead();
    }

    // addScore(){
    //     this.length++;
    //     this.score++;
    //     this.arr.push(new Point(-100, -100));
    // }
    //
    // incSize(){
    //     if(this.length % 30 == 0) this.size++;
    //     if(this.size > this.MAXSIZE) this.size = this.MAXSIZE;
    // }

    changeAngle(angle){
        this.angle = angle;
    }

}