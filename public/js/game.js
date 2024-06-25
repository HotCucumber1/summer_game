class Game{
    constructor(ctxSnake, ctxHex){
        this.ctxSnake = ctxSnake;
        this.ctxHex = ctxHex;
        this.WORLD_SIZE = new Point(4000, 2000);
        this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
        this.world = new Point(-1200, -600);
        this.snakes = [];
        this.backgroundImage = new Image();
        this.backgroundImage.src = '../public/images/background.png';
        this.backgroundImage.onload = () => {
            this.drawWorld();
        };
    }

    init(){
        this.snakes[0] = new Snake(this.ctxSnake, 0);
    }

    draw(){

        //draw world
        this.drawWorld();

        // move yourself
        if(this.snakes[0].state === 0)
            this.snakes[0].move();

        //move other snakes
        for(var i=1; i<this.snakes.length; i++)
            if(this.snakes[i].state === 0) this.snakes[i].move(this.snakes[0]);
    }

    drawWorld(){

        this.ctxHex.fillStyle = "white";
        this.ctxHex.fillRect(this.world.x - 2, this.world.y - 2, this.WORLD_SIZE.x+4, this.WORLD_SIZE.y+4);

        this.ctxHex.fillStyle = "#17202A";
        this.ctxHex.fillRect(this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.ctxHex.drawImage(this.backgroundImage, this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

        this.world.x -= this.snakes[0].velocity.x;
        this.world.y -= this.snakes[0].velocity.y;
    }

    // drawScore(){
    //     var start = new Point(20, 20);
    //     for (var i = 0; i < this.snakes.length; i++) {
    //         this.ctxSnake.fillStyle = this.snakes[i].mainColor;
    //         this.ctxSnake.font="bold 10px Arial";
    //         this.ctxSnake.fillText(this.snakes[i].name + ":" + this.snakes[i].score,
    //             start.x-5, start.y +i*15);
    //     }
    // }

    // drawMap(){
    //
    //     this.ctxSnake.globalAlpha = 0.5;
    //
    //     var mapSize = new Point(100, 50);
    //     var start = new Point(20, this.SCREEN_SIZE.y-mapSize.y-10);
    //     this.ctxSnake.fillStyle = "white";
    //     this.ctxSnake.fillRect(start.x, start.y, mapSize.x,  mapSize.y);
    //     this.ctxSnake.fill();
    //
    //     this.ctxSnake.globalAlpha = 1;
    //
    //
    //     //draw all player in map
    //     for (var i = 0; i < this.snakes.length; i++) {
    //         var playerInMap = new Point(start.x + (mapSize.x/this.WORLD_SIZE.x) * this.snakes[i].pos.x,
    //             start.y + (mapSize.y/this.WORLD_SIZE.y) * this.snakes[i].pos.y);
    //
    //         // console.log(playerInMap);
    //         this.ctxSnake.fillStyle = this.snakes[i].mainColor;
    //         this.ctxSnake.beginPath();
    //         this.ctxSnake.arc(start.x + playerInMap.x, playerInMap.y + 10, 2, 0, 2*Math.PI);
    //         this.ctxSnake.fill();
    //     }
    //
    //
    // }

}