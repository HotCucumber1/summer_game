const enter = document.getElementById("enter");
const nickname = document.getElementById("nickname");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function hangleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function () {
            window.location.href = targetURL;
        }, 2000);
    }

    enter.addEventListener("submit", function () {
        const nickname = document.getElementById("nickname");
        const nick = nickname.value;
        sessionStorage.setItem("Nickname", nick);
        hangleButtonClick("../pages/menu.html");
    });

});
