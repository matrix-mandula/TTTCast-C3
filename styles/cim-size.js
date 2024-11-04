function resizeDalcim() {
    const dalcim = document.getElementById("dalcim")
    const dalcimW = Number(getComputedStyle(dalcim).width.slice(0, -2))
    const windowW = document.documentElement.clientWidth
    if (dalcimW >= windowW) {
        if (windowW < 550) {
            dalcim.style.fontSize = '30pt'
            dalcim.style.lineHeight = '35px';
            dalcim.style.marginTop = '30px';
            dalcim.style.marginBottom = '10px'
        }
        else {
            dalcim.style.fontSize = '40pt'
            dalcim.style.lineHeight = '35px';
            dalcim.style.marginTop = '30px';
            dalcim.style.marginBottom = '10px'
        }
    }
}
resizeDalcim()