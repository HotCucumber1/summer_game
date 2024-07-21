// let conn = new WebSocket('ws://10.250.104.40:8085/socket/');
let conn = new WebSocket('ws://10.10.24.132:8085/socket/');

// let conn = new WebSocket('ws://192.168.20.104:8085/socket/');
// let conn = new WebSocket('ws://192.168.140.11:8085/socket/');
// let conn = new WebSocket('ws://10.10.29.61:8085/socket/');

conn.onopen = function ()
{
    console.log("Connection established!");

    // let userData= {
    //     'userName': localStorage.getItem("nickname"),
    // }
    // conn.send(JSON.stringify(userData));
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