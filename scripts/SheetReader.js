const sounds_sharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const sounds_flat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

async function sheetreader(file) {
    const response = await fetch(`./texts/${file}.txt`);
    const text = await response.text();
    let dal = {};
    let akkordok = {};
    let szoveg = {};
    let sorok
    if (text.includes("\r")) {
        sorok = text.split('\r\n');
    } else {
        sorok = text.split('\n')
    }
    dal.adatok = { 'cim': sorok[0], 'filename': file };
    if (dal.adatok.cim.slice(0, 1) == '#') {
        dal.adatok.new = true;
        dal.adatok.cim = dal.adatok.cim.slice(1)
    } else { dal.adatok.new = false }
    dal.dalszoveg = {};
    dal.kotta = {};
    let index1 = sorok[1].indexOf('|');
    let index2 = sorok[1].indexOf('|', index1 + 1);
    dal.adatok.key = sorok[1].slice(0, index1);
    dal.adatok.bpm = sorok[1].slice(index1 + 1, index2);
    dal.adatok.time_signature = sorok[1].slice(index2 + 1);
    dal.adatok.structure = sorok[2].split(' ');
    let sor2 = 0;
    let tag;
    for (let sor1 = 4; sor1 < sorok.length; sor1++) {
        sor2++
        if (sorok[sor1].includes('[')) {
            tag = sorok[sor1].slice(1, -1);
            dal.dalszoveg[tag] = [];
            akkordok[tag] = [];
            szoveg[tag] = [];
            sor2 = 0;
        }
        else {
            if (sor2 % 2 == 1) {
                akkordok[tag].push(sorok[sor1])
            }
            else if (sor2 % 2 == 0) {
                szoveg[tag].push(sorok[sor1]);
                let sor = sorok[sor1]
                while (sor.includes('_')) { sor = sor.replace('_', '') }
                dal.dalszoveg[tag].push(sor)
            }
        };
    };
    for (let tag in szoveg) {
        dal.kotta[tag] = [];
        for (let n_sor = 0; n_sor < szoveg[tag].length; n_sor++) {
            let sor = [];
            let akkordsor = akkordok[tag][n_sor];
            let szovegsor = szoveg[tag][n_sor];
            let rovidsor, hossz;
            if (Object.keys(szovegsor).length > Object.keys(akkordsor).length) { hossz = akkordsor.length; rovidsor = 'akkordsor' }
            else { hossz = szovegsor.length; rovidsor = 'szovegsor' };
            for (let n_karakter = 0; n_karakter < hossz; n_karakter++) {
                let akkord = akkordsor[n_karakter];
                let betu = szovegsor[n_karakter];
                if (betu == '_') { betu = '' };
                if (n_karakter == hossz - 1) {
                    if (rovidsor == 'akkordsor') {
                        if (akkord != ' ') {
                            if (akkord == akkord.toUpperCase() && isNaN(akkord) && akkord != '/' && akkord != '#' && akkord != 'b') {
                                sor.push([betu, akkord])
                            }
                            else {
                                sor.push([betu, ' '])
                            }
                        }
                        else {
                            sor.push([betu, akkord])
                        }
                    }
                    else if (rovidsor == 'szovegsor') {
                        if (akkord != ' ') {
                            if (akkord == akkord.toUpperCase() && isNaN(akkord) && akkord != '/' && akkord != '#' && akkord != 'b') {
                                if (akkordsor.slice(n_karakter + 1).includes(' ')) {
                                    if (akkordsor[n_karakter + 1] != ' ') {
                                        let n_karakter2 = n_karakter;
                                        while (akkordsor[n_karakter2 + 1] != ' ') {
                                            akkord += akkordsor[n_karakter2 + 1];
                                            n_karakter2++
                                        };
                                        sor.push([betu, akkord])
                                    }
                                    else {
                                        sor.push([betu, akkord])
                                    }
                                }
                                else {
                                    if (n_karakter != akkordsor.length - 1) {
                                        for (let akkord_part of akkordsor.slice(n_karakter + 1)) {
                                            akkord += akkord_part
                                        };
                                        sor.push([betu, akkord])
                                    }
                                    else {
                                        sor.push([betu, akkord])
                                    }
                                }
                            }
                            else {
                                sor.push([betu, ' '])
                            }
                        }
                        else {
                            sor.push([betu, akkord])
                        };
                        betu = ' '
                    }
                }
                else {
                    if (akkord != ' ') {
                        if (akkord == akkord.toUpperCase() && isNaN(akkord) && akkord != '/' && akkord != '#' && akkord != 'b') {
                            if (akkordsor.slice(n_karakter + 1).includes(' ')) {
                                if (akkordsor[n_karakter + 1] != ' ') {
                                    let n_karakter2 = n_karakter;
                                    while (akkordsor[n_karakter2 + 1] != ' ') {
                                        akkord += akkordsor[n_karakter2 + 1];
                                        n_karakter2++
                                    };
                                    sor.push([betu, akkord])
                                }
                                else {
                                    sor.push([betu, akkord])
                                }
                            }
                            else {
                                if (n_karakter != akkordsor.length - 1) {
                                    for (let akkord_part of akkordsor.slice(n_karakter + 1)) {
                                        akkord += akkord_part
                                    };
                                    sor.push([betu, akkord])
                                }
                                else {
                                    sor.push([betu, akkord])
                                }
                            }
                        }
                        else {
                            sor.push([betu, ' '])
                        }
                    }
                    else {
                        sor.push([betu, akkord])
                    }
                }
            }
            if (rovidsor != undefined) {
                if (rovidsor == 'akkordsor') {
                    for (let n_karakter = hossz; n_karakter < szovegsor.length; n_karakter++) {
                        let betu = szovegsor[n_karakter];
                        sor.push([betu, ' '])
                    }
                }
                else if (rovidsor == 'szovegsor') {
                    for (let n_karakter = hossz; n_karakter < akkordsor.length; n_karakter++) {
                        let akkord = akkordsor[n_karakter];
                        let betu = ' ';
                        if (akkord != ' ') {
                            if (akkord == akkord.toUpperCase() && isNaN(akkord) && akkord != '/' && akkord != '#' && akkord != 'b') {
                                if (akkordsor.slice(n_karakter + 1).includes(' ')) {
                                    if (akkordsor[n_karakter + 1] != ' ') {
                                        let n_karakter2 = n_karakter;
                                        while (akkordsor[n_karakter2 + 1] != ' ') {
                                            akkord += akkordsor[n_karakter2 + 1];
                                            n_karakter2++
                                        };
                                        sor.push([betu, akkord])
                                    }
                                    else {
                                        sor.push([betu, akkord])
                                    }
                                }
                                else {
                                    if (n_karakter != akkordsor.length - 1) {
                                        for (let akkord_part of akkordsor.slice(n_karakter + 1)) {
                                            akkord += akkord_part
                                        };
                                        sor.push([betu, akkord])
                                    }
                                    else {
                                        sor.push([betu, akkord])
                                    }
                                }
                            }
                            else {
                                sor.push([' ', ' '])
                            }
                        }
                        else {
                            sor.push([' ', akkord])
                        }
                    }
                }
            };
            dal.kotta[tag].push(sor)
        };
    };
    for (let tag in dal.kotta) {
        for (let sor of dal.kotta[tag]) {
            let doublespace = [];
            if (dal.kotta[tag].indexOf(sor) == 0) { }
            else {
                for (let n_karakter = 1; n_karakter < sor.length - 1; n_karakter++) {
                    let karakter = sor[n_karakter];
                    if (karakter[0] == ' ' && karakter[1] == ' ' && sor[n_karakter - 1][0] == ' ' && sor[n_karakter - 1][1] == ' ') {
                        doublespace.push(n_karakter)
                    }
                };
                for (let n = 0; n < doublespace.length; n++) {
                    sor.splice(doublespace[n] - n, 1);
                }
            }
        };
    };
    for (let tag in dal.kotta) {
        for (let sor of dal.kotta[tag]) {
            for (let i = 0; i < sor.length; i++) {
                while (i + 1 < sor.length && sor[i + 1][1] == ' ') {
                    sor[i][0] += sor[i + 1][0];
                    sor.splice(i + 1, 1)
                }
            }
        };
    };

    // console.log(dal);
    return dal
};

function chordreader(akkord) {
    let scale;

    let chord = { 'chord': akkord };
    let index1 = 1;
    if (akkord != ' ') {
        if (akkord.length == 1) {
            chord['keynote'] = akkord;
            chord['modal'] = 'major';
            chord['modify'] = null;
            chord['bass'] = null
        }
        else {
            if (akkord[index1] == '#') {
                index1++;
                chord['keynote'] = akkord.slice(0, index1);
                scale = sounds_sharp
            }
            else if (akkord[index1] == 'b') {
                index1++;
                chord['keynote'] = akkord.slice(0, index1);
                scale = sounds_flat
            }
            else {
                chord['keynote'] = akkord[0]
            }
            if ((akkord.length == index1 + 1 && akkord[index1] == 'm') || (akkord.length > index1 + 1 && akkord[index1] == 'm' && (akkord[index1 + 1] != 'a' && akkord[index1 + 1] != 'i'))) {
                index1++;
                chord['modal'] = 'minor'
            }
            else {
                chord['modal'] = 'major'
            }
            let index2; if (akkord.includes('/')) { index2 = akkord.indexOf('/') } else { index2 = akkord.length };
            if (index1 < index2) {
                chord['modify'] = akkord.slice(index1, index2)
            }
            else {
                chord['modify'] = null
            }

            if (akkord.includes('/')) {
                chord['bass'] = akkord.slice(index2 + 1)
            }
            else {
                chord['bass'] = null
            }
        }
    };
    return chord
};

function chordname(chord) {
    let keynote = chord['keynote'];
    let modal; if (chord['modal'] == 'minor') { modal = 'm' } else { modal = '' };
    let modify; if (chord['modify'] != null) { modify = chord['modify'] } else { modify = '' };
    let bass; if (chord['bass'] != null) { bass = '/' + chord['bass'].toLowerCase() } else { bass = '' };
    chord['chord'] = keynote + modal + modify + bass;
    return chord
}

function displayChord(akkord) {
    let chord = chordreader(akkord)
    let keynote = chord['keynote'];
    let modal; if (chord['modal'] == 'minor') { modal = 'm' } else { modal = '' };
    let modify; if (chord['modify'] != null) { modify = chord['modify'] } else { modify = '' };
    let bass; if (chord['bass'] != null) {
        if (chord['bass'].includes('b') && chord['bass'].length > 1) { bass = '/' + chord['bass'].slice(0, 1).toUpperCase() + 'b' }
        else { bass = '/' + chord['bass'].toUpperCase() }
    } else { bass = '' };
    chord['chord'] = keynote + modal + modify + bass;
    return chord['chord']
}

function displayChord2(akkord) {
    let chord = chordreader(akkord)
    let keynote;
    let sharpflat = '';
    if (chord.keynote.slice(-1) == 'b' || chord.keynote.slice(-1) == '#') {
        keynote = chord.keynote[0]
        sharpflat = chord.keynote.slice(-1)
    }
    else { keynote = chord.keynote }
    let modal; if (chord['modal'] == 'minor') { modal = 'm' } else { modal = '' };
    let modify; if (chord['modify'] != null) { modify = chord['modify'] } else { modify = '' };
    let bass; if (chord['bass'] != null) {
        if (chord['bass'].includes('b') && chord['bass'].length > 1) { bass = '/' + chord['bass'].slice(0, 1).toUpperCase() + 'b' }
        else { bass = '/' + chord['bass'].toUpperCase() }
    } else { bass = '' };
    let chorddata = {
        'name': keynote + sharpflat + modal + modify + bass,
        'keynote': keynote,
        'sharpflat': sharpflat,
        'modal': modal,
        'modify': modify,
        'bass': bass
    };
    return chorddata
}

function sharp_or_flat(sound) {
    let scale; if (sound.includes('b')) { scale = sounds_flat } else { scale = sounds_sharp };
    return scale
}

var keychangeI = 0;
function transponer(dal) {
    let modal = '';
    let key1;
    if (dal.adatok.key.slice(-1) == 'm') {
        key1 = dal.adatok.key.slice(0, -1);
        modal = 'm'
    } else { key1 = dal.adatok.key };
    let keyI;
    let scale_key;
    if (key1.includes('b')) { keyI = sounds_flat.indexOf(key1) }
    else { keyI = sounds_sharp.indexOf(key1) };
    //keychangeI = 0; //ENNEK MAJD ÉRTÉKET KELL ADNI
    keyI += keychangeI;
    if (keyI > 11) { keyI -= 12 }
    else if (keyI < 0) { keyI += 12 };
    let key2;
    if (keychangeI >= 0) {
        scale_key = sounds_sharp;
        key2 = scale_key[keyI]
    }
    else if (keychangeI < 0) {
        scale_key = sounds_flat;
        key2 = scale_key[keyI]
    };
    dal.adatok.key = key2 + modal;
    //overwrite
    for (let tag of Object.values(dal.kotta)) {
        for (let sor of tag) {
            for (let elem of sor) {
                let akkord = elem[1];
                let chord, scale_keynote, keynoteI, scale_bass, bassI;
                if (akkord != ' ') {
                    chord = chordreader(akkord);
                    scale_keynote = sharp_or_flat(chord.keynote);
                    keynoteI = scale_keynote.indexOf(chord.keynote) + keychangeI;
                    if (keynoteI > 11) { keynoteI -= 12 }
                    else if (keynoteI < 0) { keynoteI += 12 };
                    chord.keynote = scale_key[keynoteI];
                    if (akkord.includes('/')) {
                        scale_bass = sharp_or_flat(chord.bass);
                        if (chord.bass.includes('b') && chord.bass.length > 1) {
                            bassI = scale_bass.indexOf(chord.bass[0].toUpperCase() + 'b') + keychangeI
                        }
                        else {
                            bassI = scale_bass.indexOf(chord.bass.toUpperCase()) + keychangeI
                        };
                        if (bassI > 11) { bassI -= 12 }
                        else if (bassI < 0) { bassI += 12 };
                        chord.bass = scale_key[bassI];
                    }
                    else {
                        chord.bass = null
                    }
                    chordname(chord);
                    elem[1] = chord.chord
                }
            }
        };
    };
    return dal
};