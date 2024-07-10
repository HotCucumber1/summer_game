// let conn = new WebSocket('ws://10.250.104.40:8080');

let conn = new WebSocket('ws://10.10.29.61:8080');
// let conn = new WebSocket('ws://192.168.140.3:8080');

conn.onopen = function (e) {
    console.log("Connection established!");
};

conn.onerror = function (e) {
    alert(`Error`);
}