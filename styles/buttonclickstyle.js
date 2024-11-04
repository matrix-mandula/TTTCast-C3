// GOMBNYOMÁS EFFEKT
function buttonClickStyle(button) {
    buttonStyle = []
    let width = getComputedStyle(button).width.slice(0, -2);
    let height = getComputedStyle(button).height.slice(0, -2);
    let fontSize = getComputedStyle(button).fontSize.slice(0, -2);
    let padding = getComputedStyle(button).padding.split(' ');
    let padding_1 = padding[0].slice(0, -2);
    let padding_2 = padding[1].slice(0, -2);

    let width2 = width * 0.95;
    let height2 = height * 0.95;
    let fontSize2 = fontSize * 0.95;
    let padding2_1 = padding_1 * 0.95;
    let padding2_2 = padding_2 * 0.95;
    let margin2_1 = height * 0.05;
    let margin2_2 = width * 0.05;

    button.addEventListener("mousedown", () => {
        button.style.width = width2 + "px";
        button.style.height = height2 + "px";
        button.style.fontSize = fontSize2 + "px";
        button.style.padding = padding2_1 + "px " + padding2_2 + "px";
    });
    button.addEventListener("mouseup", () => {

        button.removeAttribute("style")
    });
    button.addEventListener("mouseleave", () => {
        button.removeAttribute("style")
    });
};