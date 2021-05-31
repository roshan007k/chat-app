const room=[
    {roomName:"Default Room"}
]
const roomlist=document.getElementById('room2')

const createRoom=document.getElementById('create-room');

const socket=io();
createRoom.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.room.value;
    socket.emit('createRoom',msg)
    e.target.elements.room.value='';
    e.target.elements.room.focus();
})

socket.on('createdRoom',rooms=>{
    outputRooms(rooms);

})

function outputRooms(rooms){
    roomlist.innerHTML=
    `${rooms.map(room=>`<option>${room.roomName}</option>`).join('')}`

}