const single = document.getElementById("single");
const multi = document.getElementById("multi");
const changeSkin = document.getElementById("change-skin");
const form = document.querySelector("menu");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    single.addEventListener("click", () => handleButtonClick("../pages/lobby.html"))

    multi.addEventListener("click", () => handleButtonClick("../pages/loading.html"))

    changeSkin.addEventListener("click", () => handleButtonClick("../pages/changeSkin.html"));

})

function handleOnImage(e) {
    const image = e.target;
    image.style.filter = "brightness(1)";
};

function pullOfWithImage(e) {
    const image = e.target;
    image.style.filter = "brightness(0.8)";
}

changeSkin.addEventListener('mouseover', handleOnImage);
changeSkin.addEventListener('mouseout', pullOfWithImage);