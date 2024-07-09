// let conn = new WebSocket('ws://10.250.104.40:8080');
let conn = new WebSocket('ws://10.10.29.61:8080');

conn.onopen = function (e) {
    alert("Connection established!");
};

conn.onerror = function (e) {
    alert(`Error`);
}