const single = document.getElementById("single");
const multi = document.getElementById("multi");
const form = document.querySelector("menu");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500)
    }

    single.addEventListener("click", () => handleButtonClick("../pages/index.html"))

    multi.addEventListener("click", () => handleButtonClick("../pages/index.html"))

})