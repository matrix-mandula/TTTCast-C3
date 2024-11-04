/* URL ADATOK */
let params = new URLSearchParams(window.location.search);
let songP = params.get('song')
let esemeny = params.get('event')
let currentsong;
if (songP != null) { currentsong = songP }
else { currentsong = events[esemeny].dalok[0] }

/* HTML felépítése */
if (esemeny != null) { document.title = `${events[esemeny].title} (Main)` }
const oldalakHTML = document.getElementById('oldalak');

async function construct(songs) {

    // dal beolvasása
    const dalok = []
    for (let song of songs) {
        let dal = await sheetreader(song);
        dalok.push(dal)
    }

    // oldal címe
    if (esemeny == null) { document.title = `${dalok[0].adatok.cim} (Main)` }

    let dalI = 0
    for (let dal of dalok) {
        dalI++;
        // HTML elemek létrehozása
        const dalcimHTML = document.createElement('div');
        dalcimHTML.className = dal.adatok.filename;
        dalcimHTML.classList.add('cim');
        dalcimHTML.innerText = dal.adatok.cim
        if (dalI != 1) { dalcimHTML.style.display = 'none' } //később az összest display:none-ra kellene állítani
        oldalakHTML.appendChild(dalcimHTML)

        for (let tag of dal.adatok.structure) {

            let tagName;
            if (!/\d/.test(tag.slice(-1))) { tagName = elemek[tag] }
            else { tagName = elemek[tag.slice(0, -1)] + tag.slice(-1) };

            const dalszovegHTML = document.createElement('div');
            dalszovegHTML.className = dal.adatok.filename
            dalszovegHTML.classList.add(tag);
            dalszovegHTML.style.display = 'none';

            // sorok létrehozása
            for (let sorI = 0; sorI < dal.dalszoveg[tagName].length; sorI++) {
                const sorHTML = document.createElement('div');
                sorHTML.id = 'sor' + sorI;
                sorHTML.className = 'szovegsor';
                sorHTML.textContent = dal.dalszoveg[tagName][sorI]
                dalszovegHTML.appendChild(sorHTML)
            }

            oldalakHTML.appendChild(dalszovegHTML)

        };
    }

    // OLDALAK
    let HTMLoldalak = document.getElementById('oldalak').children;
    for (let HTMLoldal of HTMLoldalak) {
        if (HTMLoldal.className == 'dal') {
            for (let HTMLoldal_dal of HTMLoldal.children) {
                if (HTMLoldal_dal.id != 'felepites-container') { oldalak.push(HTMLoldal_dal) }
            }
        }
        else {
            oldalak.push(HTMLoldal)
        }
    }

    // felépítés
    const felepitesContainer = document.createElement("div");
    felepitesContainer.id = 'felepites-container';
    for (let dal of dalok) {
        const dalHTML = document.createElement('div');
        dalHTML.className = dal.adatok.filename;
        for (let tag of dal.adatok.structure) {
            const tagHTML = document.createElement('div');
            tagHTML.textContent = tag;
            tagHTML.className = tag;
            dalHTML.appendChild(tagHTML)
        }
        if (dalok.indexOf(dal) != 0) { dalHTML.style.display = 'none' }
        else { dalHTML.style.animation = 'in 2s ease forwards' }
        felepitesContainer.appendChild(dalHTML)
    }
    oldalakHTML.appendChild(felepitesContainer)
};

/* tag stílusa váltáskor */
/*function tagADDstyle(n) {
    const tag = document.getElementById('tag' + n);
    tag.style.opacity = "1";
    // tag.style.fontSize = '2vw';
}
function tagREMOVEstyle(n) {
    const tag = document.getElementById('tag' + n);
    tag.removeAttribute('style')
}*/

/* váltás */
function navRight() {
    let dalok = document.getElementsByClassName('dal');
    if (oldalI + 1 < oldalak.length) {
        oldalak[oldalI].style.animation = 'out 0.2s ease forwards';
        oldalak[oldalI].style.display = 'none'
        //if (oldalI != 0) { tagREMOVEstyle(oldalI) }
        if (oldalak[oldalI].classList[1] != 'cim') { tagI++; }
        oldalI++;
        if (currentsong != oldalak[oldalI].classList[0]) {
            tagI = 1
            let currentsongHTML = document.getElementById('felepites-container').getElementsByClassName(currentsong)[0];
            currentsongHTML.style.animation = 'out 0.2s ease forwards';
            currentsongHTML.style.display = 'none'
        }
        currentsong = oldalak[oldalI].classList[0];
        //tagADDstyle(oldalI)
        let currentsongHTML = document.getElementById('felepites-container').getElementsByClassName(currentsong)[0];
        currentsongHTML.removeAttribute('style')
        currentsongHTML.style.animation = 'in 0.2s ease forwards'
        for (let tag of currentsongHTML.children) { tag.removeAttribute('style') };
        sendData(tagI, oldalI)
        setTimeout(() => {
            if (oldalak[oldalI].classList[1] != 'cim') {
                currentsongHTML.children[tagI - 1].style.opacity = '1';
            }
            oldalak[oldalI].removeAttribute('style');
            oldalak[oldalI].style.animation = 'in 0.2s ease forwards'
        }, 200);
    }
}
function navLeft() {
    if (oldalI > 0) {
        oldalak[oldalI].style.animation = 'out 0.2s ease forwards';
        oldalak[oldalI].style.display = 'none';
        //tagREMOVEstyle(oldalI)
        oldalI--;
        if (oldalak[oldalI].classList[1] != 'cim') { tagI--; }
        // if (oldalI != 0) { tagADDstyle(oldalI) };
        if (currentsong != oldalak[oldalI].classList[0]) {
            let currentsongHTML = document.getElementById('felepites-container').getElementsByClassName(currentsong)[0];
            currentsongHTML.style.animation = 'out 0.2s ease forwards';
            currentsongHTML.style.display = 'none'
            currentsong = oldalak[oldalI].classList[0];
            currentsongHTML = document.getElementById('felepites-container').getElementsByClassName(currentsong)[0];
            currentsongHTML.removeAttribute('style')
            currentsongHTML.style.animation = 'in 0.2s ease forwards'
            tagI = document.getElementsByClassName(currentsong).length - 2
        }
        // tagstyle
        const currentsongHTML = document.getElementById('felepites-container').getElementsByClassName(currentsong)[0];
        for (let tag of currentsongHTML.children) { tag.removeAttribute('style') };
        if (oldalak[oldalI].classList[1] != 'cim') {
            currentsongHTML.children[tagI - 1].style.opacity = '1';
        }
        sendData(tagI, oldalI)
        setTimeout(() => {
            oldalak[oldalI].removeAttribute('style');
            oldalak[oldalI].style.animation = 'in 0.2s ease forwards'
        }, 200);
    }
}

let oldalI = 0;
let tagI = 1;
let oldalak = [];

if (songP != null) {
    construct([songP]).then(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") { navRight() }
            else if (event.key === "ArrowLeft") { navLeft() }
        });

    });
}
else if (esemeny != null) {
    if (Object.keys(events).includes(esemeny)) {
        let dalok = events[esemeny].dalok;
        construct(dalok).then(() => {
            document.addEventListener("keydown", (event) => {
                if (event.key === "ArrowRight") { navRight() }
                else if (event.key === "ArrowLeft") { navLeft() }
            });
        })
    }
    // console.log({ oldalak })
}
