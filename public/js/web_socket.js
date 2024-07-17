let conn = new WebSocket('ws://10.250.104.40:8080');
// let conn = new WebSocket('ws://192.168.20.104:8080');
// let conn = new WebSocket('ws://192.168.140.11:8080');

conn.onopen = function () {
    console.log("Connection established!");

    let userData = {
        'name': localStorage.getItem("nickname"),
    }
    conn.send(JSON.stringify(userData));
}

conn.onerror = function (e) {
    console.log(`Error`);
}

conn.onclose = function () {
    console.log('Closed');
}