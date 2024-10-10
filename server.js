const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, getUser, removeUser } = require("./utils/user");

const io =new Server(server);

//routes
app.get("/", (req,res) =>{
    res.send("server is running");
});
let roomIdGlobal,imgURLGlobal;

io.on("connection", (socket) => {
    socket.on("UserJoined",(data)=>{
        const {name , userId, roomId,host,presenter} = data;
        roomIdGlobal=roomId;
        socket.join(roomId);
        const users = addUser({name , userId, roomId,host,presenter,socketId:socket.id})
        socket.emit("userIsJoined",{success:true,users});
        //socket.emit("alluser",users)
        socket.broadcast.to(roomId).emit("newUserJoinedMessageBroadcast",name);
        socket.broadcast.to(roomId).emit("allusers",users);
        socket.broadcast.to(roomId).emit("whiteboardDataResponse",{
            imgURL:imgURLGlobal,
        });
    });

    socket.on("whiteboardData",(data)=>{
        imgURLGlobal=data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse",{
            imgURL:data,
        });

    });

    socket.on("disconnect",()=>{
        const user = getUser(socket.id);
        
        if(user){
             removeUser(socket.id);
            socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted",user.name)
        }
       

    });
});





const port = process.env.PORT || 5000;
server.listen(port,()=>console.log("server is running on http://localhost:5000")
);

