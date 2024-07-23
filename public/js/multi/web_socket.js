// const conn = new WebSocket('ws://10.250.104.40:8085/socket/');
// let conn = new WebSocket('ws://192.168.20.104:8085/socket/');
// let conn = new WebSocket('ws://192.168.140.11:8085/socket/');
let conn = new WebSocket('ws://10.10.29.61:8085/socket/');
// let conn = new WebSocket('ws://10.10.24.132:8085/socket/');

function measurePing()
{
    let start = Date.now();
    conn.send(JSON.stringify(
        {
            type: 'ping',
            timestamp: start,
        }
    ));
}

setInterval(measurePing, 2000);


conn.onopen = function ()
{
    console.log("Connection established!");
}

conn.onerror = function (error)
{
    console.log(`Error ${error.message}`);
}

conn.onclose = function ()
{
    console.log('Closed');
    window.location.href = "/menu";
}

conn.onmessage = function (event)
{
    let dataFromServer = JSON.parse(event.data);
    if (dataFromServer.type === 'pong')
    {
        let end = Date.now();
        let ping = end - dataFromServer.timestamp;
        console.log(`Ping: ${ping}ms`);
    }
}