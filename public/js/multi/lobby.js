window.addEventListener("DOMContentLoaded", function ()
{
    const start = document.getElementById("start");
    const lobby = document.getElementById("lobby");
    const gameCont = document.getElementById('gameCont');
    document.body.classList.add("fade-in");


    function handleOnButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
    }

    function pullOfWithButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "";
    }


    start.addEventListener("click", function ()
    {
        conn.send(
            JSON.stringify({ type: 'start' })
        );
    });

    conn.addEventListener('message', function (event)
    {
        let data = JSON.parse(event.data);
        if (data.type === 'ping')
        {
            return;
        }

        if (data.start)
        {
            lobby.classList.remove("fade-in");
            lobby.classList.add("fade-out");
            gameCont.style.display = "block";
            gameCont.classList.add("fade-in");
            const startEvent = new CustomEvent('startEvent');
            document.dispatchEvent(startEvent);
        }
    });

    start.addEventListener('mouseover', handleOnButton);
    start.addEventListener('mouseout', pullOfWithButton);
});


