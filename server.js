const path=require('path');
const http = require('http');
const express=require('express');
const socketio=require('socket.io'); 
const app=express();
const server=http.createServer(app)
const io=socketio(server);
app.use(express.static(path.join(__dirname,'public')));
const {roomcreated}=require('./utils/room')
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,getRoomUsers,userLeave} =require('./utils/users')
const botName='UserBot'

io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room)
        socket.emit('message',formatMessage(botName,'Welcome to ChatApp'));

        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined`));

        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })

    socket.on('createRoom',(msg)=>{
        const room=roomcreated(msg) 
        socket.emit('createdRoom',room)
    })


    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left`));
            io.to(user.room).emit('roomusers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
        
    });


})
const PORT=process.env.PORT || 3000;
const host='0.0.0.0'

server.listen(PORT,host,()=>console.log(`Server running on port ${PORT}`))
