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



let roomData;
io.on("connection", (socket) => { 
    console.log("Socket has connected: " + socket.id)
    io.emit("newSocketConnected", socket.id)


    socket.on("join", (socketRoomData) => {

        socket.leave(socketRoomData.roomToLeave) 
        socket.join(socketRoomData.roomToJoin) 
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
        io.emit("getUsers", roomUsers, filteredRoomsArray)
        roomData = roomUsers
    })


    socket.on("getRooms", () => {
        const filteredRoomsArray = convertRoomMap()
        io.emit('rooms', filteredRoomsArray)
        io.emit("getUsers", roomData, filteredRoomsArray)
    })



    socket.on("msg", (msgObj) => {
        const obj = {
            msg: msgObj.msg, 
            nickname: socket.nickname, 
            id: socket.id,
        }
        io.in(msgObj.joinedRoom).emit("msg", obj)
    })



    socket.on("isWriting", (room) => {
 
        socket.broadcast.to(room).emit("isWriting", socket.nickname)
    })

    socket.on("stopWriting", () => {
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
    
    const filteredRooms = convertedArray.filter(room => ! room[1].has(room[0]))

    const roomsWithSocketID = filteredRooms.map((roomArray) =>{
        return {room: roomArray[0], sockets:Array.from(roomArray[1])}
    })

    const roomsWithIdsAndNickName = roomsWithSocketID.map((roomObj)=>{
        const nicknames = roomObj.sockets.map((socketId)=>{
            return { id: socketId, nickname: io.sockets.sockets.get(socketId).nickname }
        })
        return {room: roomObj.room, sockets: nicknames}
    })

    return roomsWithIdsAndNickName

}

app.post('/gif', async (req, res) => {
    const { input } = req.body 
    const gifs = await fetchGifApi(input)
    res.send(gifs)
})


app.post('/emoji', async (req, res) => {
    const { input } = req.body 
    const emojis = await fetchEmojiApi(input)
    res.send(emojis)

})
httpServer.listen(port, () => {
    console.log("Server is running on port: " + port)
})