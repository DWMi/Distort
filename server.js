import { createServer } from "http";
import { Server } from "socket.io";
import express from "express"


const app = express()
const httpServer = createServer(app);
const port = 3000;
const io = new Server(httpServer);

app.use("/", express.static("./client"))



io.on("connection", (socket) => {
    console.log("Socket has connected: " + socket.id)
    io.emit("newSocketConnected", socket.id)


    socket.on("join", (socketRoomData) => {
        socket.leave(socketRoomData.roomToLeave) // lämnar rum man är i om man joinar ett nytt
        socket.join(socketRoomData.roomToJoin) // skapar ett rum genom clienten?
        socket.nickname = socketRoomData.nickname
        io.in(socketRoomData.roomToJoin).emit("welcome", `Välkommen ${socket.nickname}!`)
    })


    // Rums lista, körs functionen uppdateras det på alla clienter 
    socket.on("getRooms", () => {
        console.log(io.sockets.adapter.rooms);

    })

    socket.on("msg", (msgObj) => {
        io.in(msgObj.joinedRoom).emit("msg", {msg: msgObj.msg, nickname: socket.nickname})
    })
})


//FETCH GIF API FROM GIPHY
io.on("connection", socket => {
    socket.on("send-api", apigif => {
            
        function fetchGifApi() {
    
                console.log(socket.id)
        
                let gifArray
                
                const userInput = document.getElementById("input").value
                const giphyApiKey = "Bhx9WisWg50kcqriLhdZQJYiycqFewTV";
                const giphyApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${userInput}&limit=10&offset=0&rating=g&lang=en`
                
                fetch(giphyApiUrl, {
                    method: 'GET',
                    redirect: 'follow',
                })
                .then(response => response.json())
                .then(result => gifArray = result) 
                .then(() => {
                    console.log(gifArray.data)
                    const gifArrayMap = gifArray.data
                    gifArrayMap.map(data => {
                        // return console.log(data.images.downsized.url)
                        var chatGif = gifOutput(data.images.downsized.url)
                        return chatGif
                    })
                    io.emit("receive-gif", apigif.chatGif)

                }).catch(error => console.log('error', error));
        }
    })
})

        





httpServer.listen(port, () => {
    console.log("Server is running on port: " + port)
})









    // socket.join("") //ange namnet på rummet
    // socket.leave("") //ange namnet på rummet



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