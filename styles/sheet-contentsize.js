function resizeSheet() {
    const windowH = document.documentElement.clientHeight;
    const container = document.getElementById('container-kotta');
    const header = document.getElementsByTagName('header')[0];
    const headerH = Number(getComputedStyle(header).height.slice(0, -2));
    const foot = document.getElementById('foot');
    const footH = Number(getComputedStyle(foot).height.slice(0, -2));
    container.style.height = (windowH - headerH - footH - 50) + 'px';
}
resizeSheet()

window.addEventListener("resize", () => {
    resizeSheet()
    if (window.innerWidth < 550) { spacewidth = 5.59 }
})

// function HV() {
//     const windowH = document.documentElement.clientHeight;
//     const windowW = document.documentElement.clientWidth;
//     if (windowH < windowW) {
//         const kottaC = document.getElementById("container-kotta")
//         const kotta = document.getElementById("kotta");

//         kotta.classList.add("kotta-vertical");
//         kotta.style.display = 'flex';
//         kotta.style.flexDirection = 'row';
//         kotta.style.marginTop = '0';

//         kottaC.classList.add("container-kotta-vertical");
//         kottaC.style.overflowY = 'hidden';
//         kottaC.style.overflowX = 'scroll';
//     }
// }

// HV()

/*function widthCheck() {
    const kotta = document.getElementById("kotta");
    const kottaW = parseFloat(getComputedStyle(kotta).width.slice(0, -2));
    const windowW = window.innerWidth;
    if (windowW < kottaW + 40) {
        console.log(true, windowW, kottaW);
    }

};
const kotta = document.getElementById("kotta");
const kottaW = parseFloat(getComputedStyle(kotta).width.slice(0, -2));
console.log(kottaW + 40)
widthCheck();
window.addEventListener("resize", () => {
    widthCheck();
})*/