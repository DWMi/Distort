const socket = io();

let nickname = "Jacob";
let joinedRoom = "";






const container = document.querySelector('.container')
const chatContainer = document.createElement('div')
const chatContainerBox = document.createElement('div')
const msgContainer = document.createElement('div')
const msgInput = document.createElement('input')
const msgBtn = document.createElement('button')


chatContainer.classList.add('chatConBox')
chatContainerBox.classList.add('chatSenderCon')
msgContainer.classList.add('msgCon')
msgInput.classList.add('msgInput')
msgBtn.classList.add('msgBtn')

container.append(chatContainer)
chatContainer.append(msgContainer)
chatContainer.append(chatContainerBox)
chatContainerBox.append(msgInput)
chatContainerBox.append(msgBtn)
msgBtn.innerHTML = 'Send'
msgInput.placeholder = 'Message'
msgInput.type ='text'






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
    console.log(`${msgObj.nickname} : ${msgObj.msg}`);
})






msgBtn.addEventListener("click", () => {
    const msg = msgInput.value
    socket.emit("msg", { msg, joinedRoom})
    const outBubble = document.createElement('div'),
        outMsg = document.createElement('p')
        outBubble.classList.add('outBubble')
        outMsg.classList.add('outMsg')
        msgContainer.append(outBubble)
        outBubble.append(outMsg)
        
    outMsg.innerText =  nickname +': '+ msg
    msgInput.value = ''
    console.log(nickname);

})
msgInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){

        e.preventDefault();


        const msg = msgInput.value
        socket.emit("msg", { msg, joinedRoom})
        const outBubble = document.createElement('div'),
            outMsg = document.createElement('p')
            outBubble.classList.add('outBubble')
            outMsg.classList.add('outMsg')
            msgContainer.append(outBubble)
            outBubble.append(outMsg)
            
        outMsg.innerText = nickname +': '+ msg
        msgInput.value = ''
    }
})


document.getElementById("roomBtn").addEventListener("click", () => {
    const room = document.getElementById("roomInput").value
    socket.emit("join", {roomToLeave: joinedRoom, roomToJoin: room, nickname})
    joinedRoom = room; 
})

document.getElementById("getRooms").addEventListener("click", () => {
    socket.emit("getRooms")
})


socket.on("send-api", (apigif) => {
    console.log("asdas" + apigif.chatGif)

})



document.getElementById("gifBtn").addEventListener("click", () => {
    socket.on("send-api", )
    const img = document.createElement("img")
    const imgPath = gif
    img.src = imgPath
    document.body.append(img)
})


//   const gifBtn = document.querySelector(".gifBtn")
//   gifBtn.addEventListener("click", function() {
//     sendApiRequest() 
//   })

// function gifOutput(gif) {

//     const img = document.createElement("img")
//     const imgPath = gif
//     img.src = imgPath
//     document.body.append(img)
  
// }
