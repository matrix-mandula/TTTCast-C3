function resizegrid(extraW = 0) {
    const itemsek = document.getElementsByClassName("items");
    for (let items of itemsek) {
        let itemsW = parseInt(getComputedStyle(items).width.slice(0, -2));
        if (getComputedStyle(items).display == 'grid') {
            let n = Math.floor((itemsW + extraW) / 176);
            items.style.gridTemplateColumns = `repeat(${n}, 176px)`;
        }
    }
}

resizegrid()
window.addEventListener("resize", () => {
    resizegrid()
})