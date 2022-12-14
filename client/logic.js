const socket = io("http://localhost:3000");

let nickname = "";
let joinedRoom = "";
let createdRooms = [];
let gifs = [];
let roomUsers = []
let selectedGif;
// --------------------GLOBAL DOM ---------------------------//
const container = document.querySelector(".container"),
  container2 = document.createElement('div'),
  container3 = document.createElement('div'),
  chatContainer = document.createElement("div"),
  isWritingBox = document.createElement("div"), 
  chatContainerBox = document.createElement("div"),
  msgContainer = document.createElement("div"),
  msgInput = document.createElement("input"),
  msgBtn = document.createElement("button"),
  incMsg = document.createElement("p"),
  gifCon = document.createElement("div"),
  roomCon = document.createElement('div'),
  cmdCon = document.createElement('div'),
  cmdBox = document.createElement('div'),
  cmdSugg1 = document.createElement('p'),
  cmdSugg2 = document.createElement('p'),
  emojiCon = document.createElement('div')
 
container2.classList.add('container2')
container3.classList.add('container3')
chatContainer.classList.add("chatConBox");
isWritingBox.classList.add("isWritingBox");
chatContainerBox.classList.add("chatSenderCon");
msgContainer.classList.add("msgCon");
msgInput.classList.add("msgInput");
msgBtn.classList.add("msgBtn");
incMsg.classList.add("incMsg");
roomCon.classList.add('roomCon')

container.append(container2)
container2.append(container3)
msgContainer.append(incMsg);
container2.append(chatContainer);
container3.append(roomCon)

chatContainer.append(msgContainer);
chatContainer.append(chatContainerBox);
chatContainer.append(isWritingBox);
chatContainerBox.append(msgInput);
chatContainerBox.append(msgBtn);

msgBtn.innerHTML = "Send";
msgInput.placeholder = "Message";
msgInput.type = "text";

// ---------------NICKNAME LANDINGPAGE-----------------//
const landingLoad = () => {
  container.style.display = "none";

  const body = document.querySelector("body"),
    landingCon = document.createElement("div"),
    landHead = document.createElement("h1"),
    landHead2 = document.createElement("h1"),
    nickInput = document.createElement("input"),
    nickBtn = document.createElement("button");

  nickBtn.classList.add("nickBtn");
  nickInput.classList.add("nickInput");
  landHead.classList.add("landHead");
  landHead2.classList.add("landHead2");
  landingCon.classList.add("landingCon");

  body.append(landingCon);
  landingCon.append(landHead);
  landingCon.append(landHead2);
  landingCon.append(nickInput);
  landingCon.append(nickBtn);

  nickInput.placeholder = "Nickname";
  nickInput.type = "text";
  nickBtn.innerHTML = "Submit";
  nickBtn.disabled = true;
  landHead.innerText = "Distort????";
  landHead2.innerText = "What is your nickname?";

  nickInput.addEventListener("input", function () {
    if (nickInput.value.length <= 0) {
      nickBtn.disabled = true;
      nickBtn.style.color = "black";
      nickBtn.style.cursor = "not-allowed";
    } else {
      nickBtn.style.cursor = "pointer";
      nickBtn.disabled = false;
      nickBtn.style.color = "white";
    }
  });
  nickBtn.addEventListener("click", () => {
    nickname = nickInput.value;
    landingCon.style.display = "none";
    container.style.display = "flex";
    socket.emit("getRooms", nickname);
  });
};


// --------------SOCKETS-------------------//
socket.on("newSocketConnected", (socketId) => {
  console.log("New socket connected: " + socketId);
});

socket.on("getUsers", (data, rooms) => {
    getRoomUsers(data, rooms)
});

socket.on("msg", (msg) => {
  outputMessage(msg);
});

socket.on("rooms", (rooms) => {
  roomGeter(rooms)

})

socket.on("isWriting", (nickname) => {
  isWritingBox.innerHTML = nickname + ":" + ' is typing...';

  })

  socket.on("stopWriting", () => {
          isWritingBox.innerHTML = ""
  })



// ------------------USER-------------------------------


const userBoxCon = document.createElement('div'),
        userBox = document.createElement('div')
        
const getRoomUsers =(data, rooms)=>{
    userBox.replaceChildren('')
    userBoxCon.replaceChildren('')
    container3.append(userBoxCon)
   
    userBoxCon.append(userBox)

    userBoxCon.classList.add('userBoxCon')
    userBox.classList.add('userBox')
   
    rooms?.forEach(item => {
       const userTitle = document.createElement('h3')
       userTitle.innerText = ''
        userBox.append(userTitle)
        userTitle.classList.add('userTitle')

        userTitle.innerText = `Users in room: ${item.room}: `
          item.sockets.forEach(user =>{
                  const users = document.createElement('p')
                  users.innerText = ''
                  userBox.append(users)
                  users.classList.add('users')
                  users.innerText =`user: ${user.nickname}`

                
              })
    })
    

}

//---------------MESSAGE-----------------------//

const outputMessage = (data) => {
  const chatBubble = document.createElement("div"),

    outMsg = document.createElement("div"),
    outNickname = document.createElement("p");
  if (socket.id === data.id) {
    if(data.gif || data.emoji) {
      outMsg.classList.add("outputBlueMsg");
      chatBubble.classList.add("chatBubbleBlue");
      msgContainer.append(chatBubble);
      chatBubble.append(outMsg);
    } else {
       outMsg.classList.add("outputBlueMsg");
      chatBubble.classList.add("chatBubbleBlue");
      msgContainer.append(chatBubble);
      chatBubble.append(outMsg);
    }

  } 
  else {
    outMsg.classList.add("outputGreyMsg");
    chatBubble.classList.add("chatBubbleGrey");
    msgContainer.append(chatBubble);
    chatBubble.append(outMsg);
  }

  if (data.gif ) {
    const gifChat = document.createElement('img')
    gifChat.classList.add('gifChat')
    gifChat.src = data.gif
    outNickname.innerText = data.nickname + ": "
    outMsg.append(outNickname);
    outMsg.append(gifChat);

  } else if(data.emoji){
    const emojiChat = document.createElement('p')
    emojiChat.classList.add('emojiChat')
    emojiChat.innerText = data.emoji
    outNickname.innerText = data.nickname + ": "
    outMsg.append(outNickname);
    outMsg.append(emojiChat);
  }else{
    outMsg.innerText = `${data.nickname} : ${data.msg} `;
  }
  
  chatBubble.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};

msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const msg = msgInput.value;
    socket.emit("stopWriting")
    if (msgInput.value.length === 0) {
    } else {
      socket.emit("msg", { msg, joinedRoom });
      msgInput.placeholder = "Message";
    }
    msgInput.value = "";
  }
})

msgBtn.addEventListener("click", () => {
  const msg = msgInput.value;
  socket.emit("stopWriting")
  if (msgInput.value.length === 0) {
  } else {
    socket.emit("msg", { msg, joinedRoom });
    msgInput.placeholder = "Message";
  }
  msgInput.value = "";
});


// ------------------ROOOOOM-------------//

  const RoomDOM = (data)=>{
    const roomName = document.createElement('h2'),
    roomBox = document.createElement('div'),
    roomJoin = document.createElement('div')

    roomName.classList.add('roomName')
    roomBox.classList.add('roomBox')
    roomJoin.classList.add('roomJoin')
    
    roomCon.append(roomBox)
    roomBox.append(roomName)
    roomBox.append(roomJoin)
    roomName.innerText = `Room: ${data.room}`
    roomJoin.innerText = ' Join'

    roomJoin.addEventListener('click', ()=>{

      socket.emit("join", { roomToLeave: joinedRoom, roomToJoin: data.room, nickname });
      socket.emit("getRooms")
      joinedRoom = data.room;
    })
    
  }

const roomGeter =(roomNr)=>{

  roomCon.innerHTML = ''
    roomNr.forEach(data => {
       RoomDOM(data)
    });

  }
//--------------------TYPING-------------////
  let isWriting = false
  msgInput.addEventListener('input', (e) => {
  if (isWriting || e.target.value.length > 0) {
      socket.emit("isWriting",joinedRoom);
  }else if (!isWriting || e.target.value.length === 0) {
      socket.emit("stopWriting")
 
  }
  })



// ---------------------API-------------------------//
let timer = undefined;

msgInput.addEventListener("input", (e) => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {


         chatContainerBox.before(cmdCon)

    if(e.target.value === '/' ){
      cmdCon.innerHTML = ''
       cmdOutput(cmdCon, cmdBox, cmdSugg1, cmdSugg2)
     

     
    }else if(e.target.value === '' || e.target.value === '/gif ' || e.target.value === '/emoji ')
      {
        cmdCon.replaceChildren('')
       
      }

//--------------EMOJI FETCH----------------//
    if (e.target.value.startsWith("/emoji ")) {
      let input = e.target.value?.slice(7);
      if(input){
        fetch("http://localhost:3000/emoji", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: input,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          emojiOutput(data);
        });
      }
    }else (!e.target.value.startsWith("/emoji "))
    {
      emojiCon.innerHTML = "";
    }
// ------------GIF EMOJI-----------------//
    if (e.target.value.startsWith("/gif ")) {
      let input = e.target.value?.slice(5);
      if (input) {
        fetch("http://localhost:3000/gif", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: input,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            gifOutput(data.data);
          });
      }
    } else (!e.target.value.startsWith("/gif "))
    {
      gifCon.innerHTML = "";
    }
  }, 100);
});

const cmdOutput =(cmdCon, cmdBox, cmdSugg1, cmdSugg2)=>{
  
  cmdCon.append(cmdBox)
  cmdBox.append(cmdSugg1)
  cmdBox.append(cmdSugg2)

  cmdCon.classList.add('cmdCon')
  cmdBox.classList.add('cmdBox')
  cmdSugg1.classList.add('cmdSugg1')
  cmdSugg2.classList.add('cmdSugg2')

  cmdSugg1.innerText ='/gif example -> /gif cat '
  cmdSugg2.innerText ='/emoji example -> /emoji cat' 
  
}
// --------EMOJI-----------------//
function emojiOutput(emojis) {
  chatContainer.append(emojiCon);
  emojiCon.classList.add("emojiCon");

  emojiCon.innerHTML = "";
  emojis.forEach((i) => {
    const emojiP = document.createElement("p"),
    emojiPDiv = document.createElement("div")
    emojiPDiv.style.cursor = "pointer";
    const selectedEmoji = i.character
    
    
    emojiPDiv.addEventListener("click", () => {
      
      socket.emit("emoji", {selectedEmoji, joinedRoom})
      emojiCon.innerHTML = "";
      msgInput.value = ''  
      chatContainer.removeChild(cmdCon)
      socket.emit("stopWriting")
    }); 
    
    emojiPDiv.classList.add("emojiPDiv");
    emojiP.classList.add("emojis");
    emojiCon.append(emojiPDiv);
    emojiPDiv.append(emojiP);

    emojiP.innerText = i.character;
  });
}

//---------------GIF------------------//

function gifOutput(gifs) {
  chatContainer.append(gifCon);
  gifCon.classList.add("gifCon");

  gifCon.innerHTML = "";

  gifs.forEach((i) => {
    const img = document.createElement("img"),
    gifImgDiv = document.createElement("div")
    gifImgDiv.style.cursor = "pointer";
    const selectedGif = i.images.downsized.url
    
    
    gifImgDiv.addEventListener("click", () => {
      
      socket.emit("gif", {selectedGif, joinedRoom})
      gifCon.innerHTML = "";
      msgInput.value = ''    
      chatContainer.removeChild(cmdCon)
      socket.emit("stopWriting")
    }); 
    
    gifImgDiv.classList.add("gifImgDiv");
    img.classList.add("gifs");
    gifCon.append(gifImgDiv);
    gifImgDiv.append(img);

    img.src = i.images.downsized.url;
  });
}


  const roomBtn = document.getElementById("roomBtn")
  roomBtn.addEventListener("click", () => {
    const room = document.getElementById("roomInput").value;
    if (room.length > 0) {
      socket.emit("join", { roomToLeave: joinedRoom, roomToJoin: room, nickname });
    socket.emit("getRooms")
      joinedRoom = room;
      createdRooms.push(joinedRoom);
    }
    
  });




window.addEventListener("load", landingLoad);