const path = require("path")
const http = require("http")
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io")
const Filter = require("bad-words")
const {generateMessage,generateLocationMessage} = require("./utils/messages")

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log("A new connection was made");
    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{
    //     count++;
    //     //socket.emit('countUpdated',count);
    //     io.emit('countUpdated',count)
    // })
    socket.emit('message',generateMessage("welcome!"))
    socket.broadcast.emit('message',generateMessage('a new user has joined'))
    socket.on('sendmessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed")
        }
        io.emit('message',generateMessage(message))
        callback()
    })
    socket.on('location',(longitude,latitude,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left!'))
    })
})




server.listen(PORT,()=>{
    console.log("server started on port "+ PORT)
})