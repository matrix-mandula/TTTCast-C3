function resizeHR() {
    const titles = document.getElementsByClassName("title");
    for (let title of titles) {
        const tagname = title.parentElement.classList[0]
        if (tagname != 'Intro' && tagname != 'Interlude' && tagname != 'Instrumental' && tagname != 'Solo') {
            let HR = title.children[1]
            let akkordok = title.children[2];
            HR.setAttribute('style', `height: ${getComputedStyle(akkordok).height}`)
        }
    }
}