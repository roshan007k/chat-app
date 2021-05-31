const room=[
    {roomName:"Default Room"}
]

function roomcreated(roomName){
    const room1={roomName}
    room.push(room1)
    return room
};

module.exports={roomcreated}