const single = document.getElementById("single");
const multi = document.getElementById("multi");


window.addEventListener("load", function () {
    document.body.classList.add("fade-in");

    function hangleButtonClick(e, targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out"); 

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    single.addEventListener("click", function (e) {
        hangleButtonClick(e, "../pages/index.html");
    });
    
});

function hangleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)"; 
};

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

single.addEventListener('mouseover', hangleOnButton);
single.addEventListener('mouseout', pullOfWithButton);

multi.addEventListener('mouseover', hangleOnButton);
multi.addEventListener('mouseout', pullOfWithButton);


