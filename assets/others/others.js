// get button stlye
function getButtonStlye(button) {
    let width = getComputedStyle(button).width.slice(0, -2);
    let height = getComputedStyle(button).height.slice(0, -2);
    let fontSize = getComputedStyle(button).fontSize.slice(0, -2);
    let padding = getComputedStyle(button).padding.split(' ');
    let padding_1 = padding[0].slice(0, -2);
    let padding_2 = padding[1].slice(0, -2);
    let margin = getComputedStyle(button).margin.slice(0, -2);
    // console.log(`width: ${width}, height: ${height}, fontSize: ${fontSize}, padding_1: ${padding_1}, padding_2: ${padding_2}, margin: ${margin}`);
};

// buttonclick stlye change
function buttonClickStyle(button) {
    buttonStyle = []
    let width = getComputedStyle(button).width.slice(0, -2);
    let height = getComputedStyle(button).height.slice(0, -2);
    let fontSize = getComputedStyle(button).fontSize.slice(0, -2);
    let padding = getComputedStyle(button).padding.split(' ');
    let padding_1 = padding[0].slice(0, -2);
    let padding_2 = padding[1].slice(0, -2);
    let margin = getComputedStyle(button).margin.slice(0, -2);

    let width2 = width * 0.95;
    let height2 = height * 0.95;
    let fontSize2 = fontSize * 0.95;
    let padding2_1 = padding_1 * 0.95;
    let padding2_2 = padding_2 * 0.95;
    let margin2_1 = height * 0.05;
    let margin2_2 = width * 0.05;

    // console.log(width, height, fontSize, padding_1, padding_2);
    // console.log(width2, height2, fontSize2, padding2_1, padding2_2);

    button.addEventListener("mousedown", () => {
        button.style.width = width2 + "px";
        button.style.height = height2 + "px";
        button.style.fontSize = fontSize2 + "px";
        button.style.padding = padding2_1 + "px " + padding2_2 + "px";
    });
    button.addEventListener("mouseup", () => {
        button.style.width = width + "px";
        button.style.height = height + "px";
        button.style.fontSize = fontSize + "px";
        button.style.padding = padding_1 + "px " + padding_2 + "px";
    });
};

for (let button of document.getElementsByClassName("big-button")) {
    button.addEventListener("click", buttonClickStyle(button))
}

//test
/*var root = getComputedStyle(document.documentElement)
root.setProperty('--title-main', '#000000')
var mainColor = root.getPropertyValue('--title-main')
console.log(mainColor)*/