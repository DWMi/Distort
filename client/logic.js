const socket = io("http://localhost:3000");

let nickname = "";
let joinedRoom = "";
let createdRooms = [];
let gifs = [];
let selectedGif;

const container = document.querySelector(".container"),
  chatContainer = document.createElement("div"),
  isWritingBox = document.createElement("div"),   //box för is typing
  chatContainerBox = document.createElement("div"),
  msgContainer = document.createElement("div"),
  msgInput = document.createElement("input"),
  msgBtn = document.createElement("button"),
  incMsg = document.createElement("p"),
  gifCon = document.createElement("div"),
  roomCon = document.createElement('div'),
  roomBox = document.createElement('div'),
  roomName = document.createElement('h2')

chatContainer.classList.add("chatConBox");
isWritingBox.classList.add("isWritingBox");  //box för is typing
chatContainerBox.classList.add("chatSenderCon");
msgContainer.classList.add("msgCon");
msgInput.classList.add("msgInput");
msgBtn.classList.add("msgBtn");
incMsg.classList.add("incMsg");
roomCon.classList.add('roomCon')
roomBox.classList.add('roomBox')
roomName.classList.add('roomName')

msgContainer.append(incMsg);
container.append(chatContainer);
container.append(roomCon)
roomCon.append(roomBox)
roomBox.append(roomName)
chatContainer.append(msgContainer);
chatContainer.append(chatContainerBox);
chatContainer.append(isWritingBox); // box for is typing
chatContainerBox.append(msgInput);
chatContainerBox.append(msgBtn);


roomName.innerText = 'Room: 1'

msgBtn.innerHTML = "Send";
msgInput.placeholder = "Message";
msgInput.type = "text";

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
  landHead.innerText = "Distort🎤";
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
  });
};

socket.on("newSocketConnected", (socketId) => {
  console.log("New socket connected: " + socketId);
});

socket.on("welcome", (msg) => {
  console.log(msg);
});

socket.on("msg", (msg) => {
  outputMessage(msg);
});

const outputMessage = (data) => {
  const chatBubble = document.createElement("div"),

    outMsg = document.createElement("div"),
    outNickname = document.createElement("p");
    // isWritingBox.innerHTML = ""; //is writing

  if (socket.id === data.id) {
    console.log(data)
    if(data.gif) {
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

  if (data.gif) {
    const gifChat = document.createElement('img')
    gifChat.classList.add('gifChat')
    gifChat.src = data.gif
    outNickname.innerText = data.nickname + ": "
    outMsg.append(outNickname);
    outMsg.append(gifChat);

  } else {
    outMsg.innerText = `${data.nickname} : ${data.msg} `;
  }


  
  chatBubble.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
  msgInput.value = "";
};

socket.on("rooms", (rooms) => {
  console.log(rooms);
});

msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const msg = msgInput.value;
    if (msgInput.value.length === 0) {
    } else {
      socket.emit("msg", { msg, joinedRoom });
      msgInput.placeholder = "Message";
    }
  }
});

msgBtn.addEventListener("click", () => {
  const msg = msgInput.value;
  if (msgInput.value.length === 0) {
  } else {
    socket.emit("msg", { msg, joinedRoom });
    msgInput.placeholder = "Message";
  }
});



//is typing TO server
msgInput.addEventListener('keypress', () => {
  socket.emit('isWriting', nickname);
})

//is typing FROM server
socket.on("isWriting", (data) => {
  isWritingBox.innerHTML = data + ":" + ' is typing...';

  // stop typing TO server
  msgInput.addEventListener("keypress", () => {
  socket.emit("stopWriting")
})
  console.log(data + ":" + " is typing...")
})


// stop typing FROM server
socket.on("stopWriting", (stopWriting) => {
  if(msgInput.value.length <= 0) {
    isWritingBox.innerHTML = ""
  }
})




// Om value == / , Visa giltiga kommandon
// Om value.length , startsWriting
// Om !value.length , stopsWriting
// Om value inte startar med "/gif ", töm preview med giffar istället kryss.


let timer = undefined;
msgInput.addEventListener("input", (e) => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {

          ///  stop writing
          if(e.target.value.length <= 0) {  
            isWritingBox.innerHTML = "";
          }
          /// stop writing

    if (e.target.value.startsWith("/gif ")) {
      let input = e.target.value?.slice(5);
      if (input) {
        // convertera till get params?
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
            console.log(data);
            gifs = data.data;
            gifOutput(gifs);
          });
      }
    } else !e.target.value.startsWith("/gif ");
    {
      gifCon.innerHTML = "";
    }
  }, 1000);
});

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
    }); 
    
    gifImgDiv.classList.add("gifImgDiv");
    img.classList.add("gifs");
    gifCon.append(gifImgDiv);
    gifImgDiv.append(img);

    img.src = i.images.downsized.url;
  });
}


document.getElementById("roomBtn").addEventListener("click", () => {
  const room = document.getElementById("roomInput").value;
  socket.emit("join", { roomToLeave: joinedRoom, roomToJoin: room, nickname });
  joinedRoom = room;
  createdRooms.push(joinedRoom);
  console.log(createdRooms);
  socket.emit("getRooms");
});

// document.getElementById("getRooms").addEventListener("click", () => {
  
// });


window.addEventListener("load", landingLoad);
