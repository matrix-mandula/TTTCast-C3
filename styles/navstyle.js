function navstyle() {
    if (window.innerWidth < 450) {
        const navbar = document.getElementsByTagName("nav")[0];
        const mainpages = document.getElementsByClassName("page")
        for (let page of mainpages) {
            page.style.marginLeft = '0'
        }
        navbar.style.back
    }
}
navstyle()
window.addEventListener("resize", () => { navstyle() })