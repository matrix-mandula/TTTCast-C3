let spacewidth = 7.45; if (window.innerWidth < 550) { spacewidth = 4.65 }
let params = new URLSearchParams(window.location.search);
let song = params.get('song');

function isText(text) {
    const abc = /[aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz]/i;
    return abc.test(text);
}

let dal;
async function construct(song) {
    /*import dal file*/
    dal = await sheetreader(song)

    const kotta = document.getElementById('kotta');
    let felepites = [];
    let tagName;
    for (let tag of dal.adatok.structure) {
        if (!/\d/.test(tag.slice(-1))) { tagName = elemek[tag] }
        else { tagName = elemek[tag.slice(0, -1)] + tag.slice(-1) };
        felepites.push(tagName);
    };

    /*title*/

    document.title = `${dal.adatok.cim} (Sheet)`

    const dalcim = document.getElementById('dalcim');
    const adatok = document.getElementById('adatok');
    dalcim.innerText = dal.adatok.cim;

    const key = document.getElementById('key');
    const bpm = document.getElementById('bpm');
    const time_signature = document.getElementById('time_signature');
    key.innerText = dal.adatok.key;
    bpm.innerText = dal.adatok.bpm + ' Bpm';
    time_signature.innerText = dal.adatok.time_signature;

    /*CONSTRUCT*/
    for (let tagI = 0; tagI < felepites.length; tagI++) {
        let sorok = dal.kotta[felepites[tagI]];
        /*tag*/
        const tag = document.createElement('div');
        tag.id = 'tag' + (tagI + 1)
        tag.className = `${felepites[tagI]} tag`;
        /*title*/
        const title = document.createElement('div');
        title.className = 'title';
        tag.appendChild(title);
        /*tagname*/
        const tagname = document.createElement('div');
        tagname.className = 'tagname';
        tagname.innerText = felepites[tagI];
        title.appendChild(tagname);

        if (felepites[tagI] != 'Intro' && felepites[tagI] != 'Interlude' && felepites[tagI] != 'Instrumental' && felepites[tagI] != 'Solo') {
            /* vonal */
            const hr = document.createElement('hr');
            hr.className = "separator"
            title.appendChild(hr)
            /*akkordok*/
            const akkordok = document.createElement('div');
            akkordok.className = 'akkordok';
            for (let sor = 0; sor < sorok.length; sor++) {
                let akkordsor = document.createElement('div');
                akkordsor.className = 'akkordsor';
                let text = ''
                for (let elem = 0; elem < sorok[sor].length; elem++) {
                    let chord = sorok[sor][elem][1];
                    if (chord != ' ') { text += `${displayChord(chord)} ` }
                }
                akkordsor.innerText = text;
                akkordok.appendChild(akkordsor)
            }
            title.appendChild(akkordok);
        }
        else {
            title.style.marginBottom = "0"; if (window.innerWidth < 550) { title.style.marginBottom = "-10px" }
        }
        /*sheet*/
        const sheet = document.createElement('div');
        sheet.className = 'sheet';
        tag.appendChild(sheet);
        for (let sorI = 0; sorI < sorok.length; sorI++) {
            /*sor*/
            const sor = document.createElement('div');
            sor.id = 'sor' + (sorI + 1)
            sor.className = 'sor';
            sheet.appendChild(sor);
            for (let elemI = 0; elemI < sorok[sorI].length; elemI++) {

                /*elem*/
                const elem = document.createElement('div');
                elem.className = 'elem';
                sor.appendChild(elem);

                /*akkord*/
                const akkord = document.createElement('div');
                akkord.className = 'akkord';
                let chord = sorok[sorI][elemI][1];

                if (chord == ' ') { akkord.classList.add('-'); chord = ' ' }
                else { akkord.classList.add(chord); }

                let chorddata = displayChord2(chord);

                let keynote = document.createElement('span');
                keynote.className = 'keynote';
                keynote.textContent = chorddata.keynote;

                let sharpflat = document.createElement('span');
                sharpflat.className = 'sharpflat';
                sharpflat.textContent = chorddata.sharpflat

                let modal = document.createElement('span');
                modal.className = 'modal';
                modal.textContent = chorddata.modal;

                let modify = document.createElement('span');
                modify.className = 'modify';
                modify.textContent = chorddata.modify;

                let bass = document.createElement('span');
                bass.className = 'bass';
                bass.textContent = chorddata.bass;

                let space = document.createElement('span');
                space.className = 'space';
                space.textContent = ' ';

                akkord.appendChild(keynote);
                akkord.appendChild(sharpflat);
                akkord.appendChild(modal);
                akkord.appendChild(modify);
                akkord.appendChild(bass);
                akkord.appendChild(space);

                elem.appendChild(akkord);

                /*szoveg*/
                const szoveg = document.createElement('div');
                szoveg.className = 'szoveg';
                let text = sorok[sorI][elemI][0];
                if (text.slice(-1) == ' ') {
                    if (felepites[tagI] != 'Intro' && felepites[tagI] != 'Interlude' && felepites[tagI] != 'Instrumental' && felepites[tagI] != 'Solo') {
                        text = text.slice(0, -1) + ' '
                    }
                }
                /* felütés */
                if (text.slice(0, 1) == ' ') {
                    if (felepites[tagI] != 'Intro' && felepites[tagI] != 'Interlude' && felepites[tagI] != 'Instrumental' && felepites[tagI] != 'Solo') {
                        text = '  ' + text.slice(1)
                    }
                }
                szoveg.innerText = text;
                elem.appendChild(szoveg);
            }
        };
        kotta.appendChild(tag)
    };
};
async function akkordDistance() {
    let sorok = document.getElementsByClassName('sor');
    for (let i = 0; i < sorok.length; i++) {
        let sor = sorok[i];
        for (let i2 = 0; i2 < sor.children.length; i2++) {
            let elem = sor.children[i2];
            let akkordW = Number(getComputedStyle(elem.children[0]).width.slice(0, -2));
            let szovegW = Number(getComputedStyle(elem.children[1]).width.slice(0, -2));
            if (akkordW >= szovegW) { // ha hosszabb az akkord mint a szöveg
                if (isText(elem.children[1].textContent)) { // ha a szövegrész tartalmaz szöveget
                    if (i2 < sor.children.length - 1) { // ha nem a sor vége
                        if (elem.children[1].textContent.slice(-1) != ' ') { // ha nem space-el végződik
                            if (isText(sor.children[i2 + 1].children[1].textContent)) { // ha az utána következő rész is tartalmaz szöveget
                                const kotojel = document.createElement('div');
                                kotojel.className = 'kotojel';
                                kotojel.textContent = '-';
                                elem.children[1].appendChild(kotojel);
                            }
                        }
                    }
                }
            }
        }
    }
};

async function rewrite() {
    transponer(dal);
    console.log(dal);

    const key = document.getElementById('key');
    key.innerText = dal.adatok.key;

    for (let tagname in dal.kotta) {
        let tagsHTML = document.getElementsByClassName(tagname);
        for (let tagHTML of tagsHTML) {
            let sorokHTML = tagHTML.getElementsByClassName('sor');
            let sorokJS = dal.kotta[tagname];

            let akkordok = tagHTML.getElementsByClassName('akkordok')[0];

            if (akkordok != undefined) {
                for (let sor = 0; sor < sorokJS.length; sor++) {
                    let akkordsor = akkordok.children[sor];
                    let text = ''
                    for (let elem = 0; elem < sorokJS[sor].length; elem++) {
                        let chord = sorokJS[sor][elem][1];
                        if (chord != ' ') { text += `${displayChord(chord)} ` }
                    };
                    akkordsor.innerText = text
                }
            }

            for (let sorI = 0; sorI < sorokJS.length; sorI++) {
                let sorHTML = sorokHTML[sorI].getElementsByClassName('elem');
                let sorJS = sorokJS[sorI];
                for (let elemI = 0; elemI < sorJS.length; elemI++) {
                    let elemHTML = sorHTML[elemI].children;
                    let elemJS = sorJS[elemI]
                    if (elemJS[1] != ' ') {
                        let chorddata = displayChord2(elemJS[1]);

                        let keynote = elemHTML[0].getElementsByClassName('keynote')[0];
                        let sharpflat = elemHTML[0].getElementsByClassName('sharpflat')[0];
                        let modal = elemHTML[0].getElementsByClassName('modal')[0];
                        let modify = elemHTML[0].getElementsByClassName('modify')[0];
                        let bass = elemHTML[0].getElementsByClassName('bass')[0];

                        keynote.textContent = chorddata.keynote;
                        sharpflat.textContent = chorddata.sharpflat;
                        modal.textContent = chorddata.modal;
                        modify.textContent = chorddata.modify;
                        bass.textContent = chorddata.bass
                    }
                    if (elemJS[1] == ' ') { elemHTML[0].innerText = ' ' };
                    // elemHTML[1].removeAttribute("style")  -- ha szélesség-változtatással választjuk el a tag-eket
                }
            }
        }
    };
    akkordDistance()
};

const keyContainer = document.getElementById('container-key');
const button1 = document.getElementById('+');
const button2 = document.getElementById('-');
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');

keyContainer.addEventListener('mouseover', () => {
    arrowUp.removeAttribute('style');
    arrowDown.removeAttribute('style');
})
keyContainer.addEventListener('mouseleave', () => {
    arrowUp.style.display = 'None';
    arrowDown.style.display = 'None';
})

button1.addEventListener('click', () => {
    button1.style.marginBottom = '8px';
    keychangeI = 1;
    rewrite()
    setTimeout(() => {
        button1.removeAttribute('style')
    }, 100);
})
button2.addEventListener('click', () => {
    button2.style.marginTop = "8px";
    keychangeI = -1;
    rewrite();
    setTimeout(() => {
        button2.removeAttribute('style')
    }, 100)
})

// OLDAL SZERKEZETÉT ÁT KELL ALAKÍTANI
/*const containerKotta = document.getElementById('container-kotta');
containerKotta.addEventListener('scroll', function () {
    console.log(containerKotta.onscroll)
})*/


construct(song).then(() => {
    resizeDalcim();
    resizeHeader();
    resizeHR();
    akkordDistance()
})