let websocket;
let reconnectInterval = 5000;
const notification = document.getElementById("notification"); let connected;
let onlineserver = 'https://tttcast-server.onrender.com';
let localhost = 'ws://localhost:8000';
let currentSong;
let ujdal = false;

function connectWebSocket() {
    websocket = new WebSocket(onlineserver);

    // CSATLAKOZÁS
    websocket.onopen = function (event) {
        //console.clear();
        console.log('Connected to server ✅');
        websocket.send(JSON.stringify({
            type: 'new-device',
            deviceName: "cast-sheet"
        }))
    };

    // ÜZENET FOGADÁSA
    websocket.onmessage = function (message) {
        let data = JSON.parse(message.data)
        console.log("Message from server:\n", data)

        // notification
        if (!connected && data.host != 0) {
            notification.innerText = "Connected"
            notification.style.animation = 'connected 2s forwards';
            connected = true
        } else if (connected && data.host == 0) {
            notification.removeAttribute("style");
            notification.innerText = "Connecting";
            notification.style.backgroundColor = "#a6a6a6";
            notification.style.color = '#505050';
            notification.style.marginTop = "20px"
            connected = false;
        };
        if (currentSong != data.song) { ujdal = true };
        currentSong = data.song;
        construct(currentSong).then(() => {
            resizeDalcim();
            resizeHeader();
            resizeHR();
            akkordDistance()
        })
        currentSong = data.song;
        gotoCurrentTag(parseInt(data.tag));
    };

    // LECSATLAKOZÁS
    websocket.onclose = function (event) {
        //console.log('WebSocket connection closed ❌');
        if (connected) {
            notification.removeAttribute("style");
            notification.innerText = "Connecting";
            notification.style.backgroundColor = "#a6a6a6";
            notification.style.color = '#505050';
            notification.style.marginTop = "20px"
            connected = false;
        };
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

function gotoCurrentTag(tagI) {
    window.location.href = `#tag${tagI}`
}

// Első csatlakozás
connectWebSocket();