function resizeHeader() {
    /*header mérete*/
    const header = document.getElementsByTagName("header")[0];
    const headerH = Number(getComputedStyle(header).height.slice(0, -2))
    const headerPlaceholder = document.getElementsByClassName('header-placeholder')[0];
    headerPlaceholder.style.height = headerH + 10 + "px"
}