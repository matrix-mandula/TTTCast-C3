// get elements
const popupwindow = document.querySelector(".blur-background");
const button_esemenyinditasa = document.getElementById("esemeny-inditasa");
const button_close = document.getElementById("button_close");

// open/close popupwindow
button_esemenyinditasa.addEventListener("click", () => {
    popupwindow.style.display = "flex";
    document.body.style.overflow = "hidden";
});
button_close.addEventListener("click", () => {
    popupwindow.style.display = "none"
    document.body.style.overflow = "scroll"
});
popupwindow.addEventListener("click", (event) => {
    const background = document.getElementsByClassName('blur-background')[0];
    const container = background.children[0];
    if (event.target == background || event.target == container) {
        console.log(true, event.target)
        popupwindow.style.display = "none"
        document.body.style.overflow = "scroll"
    }
})