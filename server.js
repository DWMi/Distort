import { createServer } from "http";
import { Server } from "socket.io";
import express from "express"
import fetch from 'node-fetch';

const app = express()
const httpServer = createServer(app);
const port = 3000;
const io = new Server(httpServer); 
app.use(express.json())
app.use("/", express.static("./client"))




io.on("connection", (socket) => { 
    console.log("Socket has connected: " + socket.id)
    io.emit("newSocketConnected", socket.id)


    socket.on("join", (socketRoomData) => {

        socket.leave(socketRoomData.roomToLeave) // lämnar rum man är i om man joinar ett nytt
        socket.join(socketRoomData.roomToJoin) // skapar ett rum genom clienten?
        socket.nickname = socketRoomData.nickname
        const filteredRoomsArray = convertRoomMap()
        const roomUsers = filteredRoomsArray.find(user =>{
           if(user.room === socketRoomData.roomToJoin){
            return  user.sockets 
           } 
        })

        const roomUserToLeave = filteredRoomsArray.find(user =>{
            if(user.room === socketRoomData.roomToLeave){
             return  user.sockets 
            } 
         })
  
        io.in(socketRoomData.roomToLeave).emit("getUsers",roomUserToLeave)
        io.in(socketRoomData.roomToJoin).emit("getUsers",roomUsers)
        // io.in(socketRoomData.roomToJoin).emit("welcome", `Välkommen ${socket.nickname}!`)

    })


    // Rums lista, körs functionen uppdateras det på alla clienter 
    socket.on("getRooms", () => {
        console.log(io.sockets.adapter.rooms);
        const filteredRoomsArray = convertRoomMap()
        io.emit('rooms', filteredRoomsArray)
    })








    socket.on("msg", (msgObj) => {
        const obj = {
            msg: msgObj.msg, 
            nickname: socket.nickname, 
            id: socket.id,
        }
        io.in(msgObj.joinedRoom).emit("msg", obj)
    })

    
    // is typing to client
    socket.on("isWriting", (data) => {
        socket.broadcast.emit("isWriting", data)
        // socket.broadcast.to(data.rooms).emit("isWriting")
    })

    // stop typing to client
    socket.on("stopsWriting", () => {
        socket.broadcast.emit("stopWriting")
    })



    socket.on("gif",(gifObj)=>{ 
        io.in(gifObj.joinedRoom).emit("msg",{gif: gifObj.selectedGif, id: socket.id, nickname: socket.nickname})
    })

    socket.on("emoji",(emojiObj)=>{ 
        io.in(emojiObj.joinedRoom).emit("msg",{emoji: emojiObj.selectedEmoji, id: socket.id, nickname: socket.nickname})
    })


    socket.on("disconnect", () => {
        console.log(socket.id, 'disconnected!!')
      });

})




async function fetchGifApi(inputValue) {
        const giphyApiKey = "Bhx9WisWg50kcqriLhdZQJYiycqFewTV";
        const giphyApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${inputValue}&limit=25&offset=0&rating=g&lang=en`

        const response = await fetch(giphyApiUrl);
        const body = await response.json();
                
        return body
} 

async function fetchEmojiApi(inputValue) {
        const emojiApiKey = "c8e5eae9de404f7d52da93e337c2c67e0175b5fe";
        const emojiApiUrl = `https://emoji-api.com/emojis?search=${inputValue}&access_key=${emojiApiKey}`

        const response = await fetch(emojiApiUrl);
        const body = await response.json();
                
        return body
}



const convertRoomMap =()=>{


    const convertedArray = Array.from(io.sockets.adapter.rooms)

    // console.log(io.sockets.adapter.rooms);
    // console.log(convertedArray);
    
    const filteredRooms = convertedArray.filter(room => ! room[1].has(room[0]))
    // console.log(filteredRooms);

    const roomsWithSocketID = filteredRooms.map((roomArray) =>{
        return {room: roomArray[0], sockets:Array.from(roomArray[1])}
    })
    // console.log(roomsWithSocketID);
    
    const roomsWithIdsAndNickName = roomsWithSocketID.map((roomObj)=>{
        const nicknames = roomObj.sockets.map((socketId)=>{
            return { id: socketId, nickname: io.sockets.sockets.get(socketId).nickname }
        })
        return {room: roomObj.room, sockets: nicknames}
    })
    // console.log(roomsWithIdsAndNickName)

    return roomsWithIdsAndNickName

}

app.post('/gif', async (req, res) => {
    const { input } = req.body 
    console.log(input)
    const gifs = await fetchGifApi(input)
    res.send(gifs)
})


app.post('/emoji', async (req, res) => {
    const { input } = req.body 
    console.log(input)
    const emojis = await fetchEmojiApi(input)
    res.send(emojis)

})
httpServer.listen(port, () => {
    console.log("Server is running on port: " + port)
})











/*  
socket.emit('message', "this is a test"); //sending to sender-client only. (skicka ett meddelande till den specific clienten som socketen är i.)

socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender

socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender

socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)

socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid

io.emit('message', "this is a test"); //sending to all clients, include sender

io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender

io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender

socket.emit(); //send to all connected clients

socket.broadcast.emit(); //send to all connected clients except the one that sent the message

socket.on(); //event listener, can be called on client to execute on server

io.sockets.socket(); //for emiting to specific clients

io.sockets.emit(); //send to all connected clients (same as socket.emit)

io.sockets.on() ; //initial connection from a client.
*/