const canvas = document.getElementById("slithar");
const ctx = canvas.getContext("2d");

var point = {
    max: 50,
    array: [],
    radius: 50
};

var score = {
    name: "Score:  ",
    color: "white",
    font: "100px Arial"
};

var player = {
    x: 0,
    y: 0,
    score: 0,
    radius: 10
};

function update() {

    if (point.array.length < point.max) { //рандомное позиционирование точек
        point.array.push({
            x: Math.random() * (canvas.width - point.radius),
            y: Math.random() * (canvas.height - point.radius),
            status: 1,
            score: 1
        });
    };

    for (let a = 0; a < point.array.length; a++) { // коллизия змейки и очков
        if (player.x + player.radius > point.array[a].x && player.x - player.radius < point.array[a].x + point.radius &&
            player.y + player.radius > point.array[a].y && player.y - player.radius < point.array[a].y + point.radius) {

            point.array[a].status = 0;
            player.score += point.array[a].score;
        };
    };

    ctx.fillStyle = score.color; // рисование счёта
    ctx.font = score.font;
    ctx.fillText(score.name, 60, 100);
    ctx.fillText(player.score, 380, 100);
}

function mouseOffset() { // привязка к мыши
    canvas.addEventListener("mousemove", e => {
        player.x = e.offsetX;
        player.y = e.offsetY;
    })
}
function render() { //

    let background = new Image();
    background.src = "background.jpg";

    for (let y = 0; y <= canvas.height; y += 667) {      // рисование фона
        for (let x = 0; x <= canvas.width; x += 1000) {  
            ctx.drawImage(background, x, y);
        }
    }

    let points = new Image();
    points.src = "point1.png";

    for (let a = 0; a < point.array.length; a++) { // рисование точек
        if (point.array[a].status === 1) {
            ctx.drawImage(points, point.array[a].x, point.array[a].y, point.radius, point.radius);
        };
        if (point.array[a].status === 0) { //проверка на то, съела ли змейка очко 
            point.array.splice(a, 1);
        };
    }
}

function game() {
    render();
    mouseOffset();
    update();
    requestAnimationFrame(game);
}

game();