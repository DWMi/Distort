const socket = io('http://localhost:3000');

let nickname = "";
let joinedRoom = "";
let createdRooms = []
let gifs = []





const container = document.querySelector('.container'),
    chatContainer = document.createElement('div'),
    chatContainerBox = document.createElement('div'),
    msgContainer = document.createElement('div'),
    msgInput = document.createElement('input'),
    msgBtn = document.createElement('button'),
    incMsg = document.createElement('p')

    chatContainer.classList.add('chatConBox')
    chatContainerBox.classList.add('chatSenderCon')
    msgContainer.classList.add('msgCon')
    msgInput.classList.add('msgInput')
    msgBtn.classList.add('msgBtn')
    incMsg.classList.add('incMsg')
    
    msgContainer.append(incMsg)
    container.append(chatContainer)
    chatContainer.append(msgContainer)
    chatContainer.append(chatContainerBox)
    chatContainerBox.append(msgInput)
    chatContainerBox.append(msgBtn)
    msgBtn.innerHTML = 'Send'
    msgInput.placeholder = 'Message'
    msgInput.type ='text'
    



const landingLoad = ()=>{

    container.style.display = 'none'

    const body = document.querySelector('body'),
    landingCon = document.createElement('div'),
    landHead = document.createElement('h1'),
    landHead2 = document.createElement('h1'),
    nickInput = document.createElement('input'),
    nickBtn = document.createElement('button')
    
    nickBtn.classList.add('nickBtn')
    nickInput.classList.add('nickInput')
    landHead.classList.add('landHead')
    landHead2.classList.add('landHead2')
    landingCon.classList.add('landingCon')

    body.append(landingCon)
    landingCon.append(landHead)
    landingCon.append(landHead2)
    landingCon.append(nickInput)
    landingCon.append(nickBtn)

    nickInput.placeholder ='Nickname'
    nickInput.type ='text'
    nickBtn.innerHTML ='Submit'
    nickBtn.disabled = true
    landHead.innerText = 'Distort🎤'
    landHead2.innerText = 'What is your nickname?'

    
    nickInput.addEventListener('input', function(){

        if(nickInput.value.length <=  0 ){
            
            nickBtn.disabled = true
            nickBtn.style.color = 'black'
            nickBtn.style.cursor = 'not-allowed'
        }else{
            nickBtn.style.cursor = 'pointer'
            nickBtn.disabled = false
            nickBtn.style.color = 'white'
            
            }
        
        
        })
    nickBtn.addEventListener('click', ()=>{
        nickname = nickInput.value
        landingCon.style.display='none'
        container.style.display ='flex'
    })    
}





// Om man använder React, viktigt att lägga i useEffect som körs 1 gång.
socket.on("newSocketConnected", (socketId) => {
    console.log("New socket connected: " + socketId);
    
});



socket.on("welcome", (msg) => {
    console.log(msg)
})

socket.on("msg", (msgObj) => {
    console.log(`${msgObj.nickname} : ${msgObj.msg} `);
    // const socketId = socket.id
    
    // console.log(socket.id);
    // msgFetcher(msgObj)
})
socket.on("blue", (msg) => {
    outputBlueMessage(msg)
    })
socket.on("grey", (msg) => {
        outputGreyMessage(msg)
    })

const outputBlueMessage =(data) => {
    const inMessage = `${data.nickname} : ${data.msg} `
    const chatBubble = document.createElement('div'),
        outMsg = document.createElement('p')

        outMsg.classList.add('outputBlueMsg')
        chatBubble.classList.add('chatBubbleBlue')
        msgContainer.append(chatBubble)
        chatBubble.append(outMsg)
        
        outMsg.innerText = inMessage
        chatBubble.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    msgInput.value = ''
}   
const outputGreyMessage = (data) => {
    const inMessage = `${data.nickname} : ${data.msg} `
    const chatBubble = document.createElement('div'),
        outMsg = document.createElement('p')

        outMsg.classList.add('outputGreyMsg')
        chatBubble.classList.add('chatBubbleGrey')
        msgContainer.append(chatBubble)
        chatBubble.append(outMsg)
        
    outMsg.innerText = inMessage 
    chatBubble.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    msgInput.value = ''
    
    
}

// Lägg till olika färger beroende på inkommande eller utgående meddelande!

socket.on("rooms", (rooms) => {
    console.log(rooms);
})



msgInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
        const msg = msgInput.value
        if(msgInput.value.length === 0){

        
        }else{
            socket.emit("msg", { msg, joinedRoom})
            msgInput.placeholder='Message'
        }
        
    }
   

})
msgInput.addEventListener("input", (e) => {
    if (e.target.value.startsWith("/gif/")) {
        let input = e.target.value?.slice(5)
        if(input) {
            fetch("http://localhost:3000/gif", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            input: input,
        }),
        })
        .then((res) => res.json())
        .then((data) => {
            gifs = data.data
            gifOutput()
        });
        
        }
        
    }
});


msgBtn.addEventListener("click", () => {
    const msg = msgInput.value
    if(msgInput.value.length === 0){
    
    }else{
        socket.emit("msg", { msg, joinedRoom})
        msgInput.placeholder='Message'
        
    }
    
})


  const gifCon = document.createElement("div")
  const gifImgDiv = document.createElement('div')
  function gifOutput() {
    container.append(gifCon)
    gifCon.append(gifImgDiv)
    gifCon.classList.add('gifCon')
    gifImgDiv.classList.add('gifImgDiv')
    console.log(typeof(gifImgDiv))

    const imgGif = document.querySelector('.gifs')
    for (let i = 0; i < gifs.length; i++) {
        const img = document.createElement('img')
        img.classList.add('gifs')
        
        gifImgDiv.append(img) 
        
        img.src = gifs[i].images.downsized.url
    }
   
    

}




// const msgFetcher=(data, id)=>{
// const inMessage = `${data.nickname} : ${data.msg} `
//     const chatBubble = document.createElement('div'),
//         outMsg = document.createElement('p')
//         outMsg.classList.add('outputBlueMsg')
//         msgContainer.append(chatBubble)
//         chatBubble.append(outMsg)
        
//        outMsg.innerText = inMessage + data.id 
    
//     msgInput.value = ''
//     console.log(data)
// }



document.getElementById("roomBtn").addEventListener("click", () => {
    const room = document.getElementById("roomInput").value
    socket.emit("join", {roomToLeave: joinedRoom, roomToJoin: room, nickname})
    joinedRoom = room; 
    createdRooms.push(joinedRoom)
    console.log(createdRooms);
})

document.getElementById("getRooms").addEventListener("click", () => {
    socket.emit("getRooms")
})




// socket.on("send-api", (apigif) => {
//     console.log("asdas" + apigif.chatGif)

// })





    const gifBtn = document.querySelector(".gifBtn")

    gifBtn.addEventListener("click", function(apigif) {
        // sendApiRequest()    
        socket.emit("gif")
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

    


window.addEventListener('load', landingLoad)