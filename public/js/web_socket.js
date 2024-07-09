let conn = new WebSocket('ws://10.250.104.40:8080');

conn.onopen = function (e) {
    alert("Connection established!");
};


let data = {
    up: false,
    down: false,
    left: false,
    right: false,
    boost: false
};

const actions = {
    'KeyW': 'up',
    'KeyS': 'down',
    'KeyA': 'left',
    'KeyD': 'right',
    'Space': 'boost',
}

window.addEventListener('keydown', function (event) {
    let key = event.code;
    let action = actions[key];
    if (action)
    {
        data[action] = true;
        let jsonData = JSON.stringify(data, null, 4);
        conn.send(jsonData);
    }
});

window.addEventListener('keyup', function (event) {
    let key = event.code;
    let action = actions[key];
    if (action)
    {
        data[action] = false;
        let jsonData = JSON.stringify(data, null, 4);
        conn.send(jsonData);
    }
});
