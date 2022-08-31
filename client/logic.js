const socket = io();

let nickname = "Jacob";
let joinedRoom = "";

const sendMsg = () => {

}

// Om man använder React, viktigt att lägga i useEffect som körs 1 gång.
socket.on("newSocketConnected", (socketId) => {
    console.log("New socket connected: " + socketId);
});


socket.on("welcome", (msg) => {
    console.log(msg)
})

socket.on("msg", (msgObj) => {
    console.log(`${msgObj.msg} : ${msgObj.nickname}`);
})


document.getElementById("msgBtn").addEventListener("click", () => {
    const msg = document.getElementById("msgInput").value
    socket.emit("msg", { msg, joinedRoom})
})


document.getElementById("roomBtn").addEventListener("click", () => {
    const room = document.getElementById("roomInput").value
    socket.emit("join", {roomToLeave: joinedRoom, roomToJoin: room, nickname})
    joinedRoom = room; 
})

document.getElementById("getRooms").addEventListener("click", () => {
    socket.emit("getRooms")
})