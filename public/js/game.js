Game = function(game) {}

Game.prototype = {
    preload: function() {
        //load assets
        this.game.load.image('circle','../public/images/circle.png');
        this.game.load.image('background', '../public/images/background3.png'); // временно
    },
    create: function() {
        let width = this.game.width;
        let height = this.game.height;

        this.game.world.setBounds(-width, -height, width*2, height*2);
        this.game.stage.backgroundColor = '#444';

        //add tilesprite background
        let background = this.game.add.tileSprite(-width, -height,
            this.game.world.width, this.game.world.height, 'background');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.game.snakes = [];

        //create player
        let snake = new Snake(this.game, 'circle', 0, 0);
        this.game.camera.follow(snake.head);
    },
    /**
     * Main update loop
     */
    update: function() {
        //update game components
        for (let i = this.game.snakes.length - 1 ; i >= 0 ; i--) {
            this.game.snakes[i].update();
        }
    }
};