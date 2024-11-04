let websocket;
let reconnectInterval = 5000;
let onlineserver = 'https://tttcast-server-c3.onrender.com';
let localhost = 'ws://localhost:8000';
let Nsheet = 0;

function connectWebSocket() {

    websocket = new WebSocket(onlineserver);

    // CSATLAKOZÁS
    websocket.onopen = function (event) {
        //console.clear();
        console.log('Connected to server ✅');
        websocket.send(JSON.stringify({
            type: 'new-device',
            deviceName: "cast-main",
            song: currentsong
        }))
    };

    // ÜZENET FOGADÁSA
    websocket.onmessage = function (message) {
        message = JSON.parse(message.data)
        //notification
        if (message.type == 'newSheet') {
            const notification = document.getElementById("notification");
            notification.style.animation = 'connected 2s forwards';
            setTimeout(() => { notification.removeAttribute('style'); }, 2500)
        }
        else if (message.type == 'data') {
            let data = message
            console.log('Message from server:\n', data);

            // ha másik cast-main irányít
            if (data.tag != oldalI + 1) {
                oldalak[oldalI].style.animation = 'out 0.2s ease forwards';
                oldalak[oldalI].style.display = 'none'
                //if (oldalI != 0) { tagREMOVEstyle(oldalI) }
                if (oldalak[oldalI].classList[1] != 'cim') { tagI++; }
                tagI = data.tag;
                oldalI = data.page;
                if (currentsong != oldalak[oldalI].classList[0]) { tagI = 1 }
                currentsong = oldalak[oldalI].classList[0];
                //tagADDstyle(oldalI)
                sendData(tagI)
                setTimeout(() => {
                    oldalak[oldalI].removeAttribute('style');
                    oldalak[oldalI].style.animation = 'in 0.2s ease forwards'
                }, 200);
            }
        }
    };

    // LECSATLAKOZÁS
    websocket.onclose = function (event) {
        //console.log('WebSocket connection closed ❌');
        attemptReconnect();
    };

    // HIBA
    websocket.onerror = function (event) {
        //console.error('WebSocket error');
        websocket.close(); // Kapcsolat lezárása hiba esetén, majd újrakapcsolódás megkísérlése
    };
}

// ÚJRACSATLAKOZÁS
function attemptReconnect() {
    //console.log(`Reconnect in ${reconnectInterval / 1000} seconds...`);
    setTimeout(function () {
        connectWebSocket();
    }, reconnectInterval);
}

// Első csatlakozás
connectWebSocket();

function sendData(tagI, oldalI) {
    try {
        websocket.send(JSON.stringify({
            type: 'data',
            device: "cast-main",
            song: currentsong,
            tag: tagI,
            page: oldalI
        })).then(console.log("Message sent!"))
    } catch { }
}