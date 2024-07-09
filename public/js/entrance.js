const enter = document.getElementById("enter");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function hangleButtonClick(e, targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    enter.addEventListener("submit", function (e) {
        hangleButtonClick(e, "templates/ws_testing.html.twig");
    });
});

function hangleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
}

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

enter.addEventListener('mouseover', hangleOnButton);
enter.addEventListener('mouseout', pullOfWithButton);