//DEFCON defines the readiness of the room and determine the correct course of action to defend at all cost the room.
//DEFCON 1 Romm is going to be lost  OR Defcon 2 has lasted 50+ ticks // Safe mode activated // Maximum alert
//DEFCON 2 10+ hostiles in the room OR Defcon 3 has lasted more thant 50 ticks // Balance energy between towers and room + 10 defenders + workers repair walls //  Full alert
//DEFCON 3 5-9 hostiles in the room OR Defcon 4 lasted more than 50 ticks // 2 Defenders + Defcon4 to other rooms // High alert
//DEFCON 4 1-4 hostiles in the room // Towers get energy first // Above normal readiness
//DEFCON 5 No hostile in the room // Normal operations // Normal readiness

module.exports = {
  run:function(room) {
    //memory init
    if (!room.memory.hasOwnProperty('defcon')) {
      room.memory.defcon = {level:-1,since:-1,duration:-1};
    } else {
      if (!room.memory.defcon.hasOwnProperty('level')) {
        room.memory.defcon.level = 100;
      }
      if (!room.memory.defcon.hasOwnProperty('since')) {
        room.memory.defcon.since = -1;
      }
      if (!room.memory.defcon.hasOwnProperty('duration')) {
        room.memory.defcon.duration = -1;
      }
    }

    //set defcon based on hostiles number in the room
    var hostileInRoom = room.find(FIND_HOSTILE_CREEPS);
    if (hostileInRoom.length <1) {
      if (room.memory.defcon.level !== 5) {
        room.memory.defcon.level = 5;
        room.memory.defcon.since = Game.time;
        console.log('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. No hostiles in the room.');
        //Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. No hostiles in the room.',0);
      }
    } else if (hostileInRoom.length < 5) {
      if (room.memory.defcon.level !== 4) {
        room.memory.defcon.level = 4;
        room.memory.defcon.since = Game.time;
        console.log('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileInRoom.length+' hostiles in the room.');
        //Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileInRoom.length+' hostiles in the room.',0);
      }
    } else if (hostileInRoom.length < 10) {
      if (room.memory.defcon.level !== 3) {
        room.memory.defcon.level = 3;
        room.memory.defcon.since = Game.time;
        Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileInRoom.length+' hostiles in the room.',0);
      }
    } else if (hostileInRoom.length >= 10){
      if (room.memory.defcon.level !== 2) {
        room.memory.defcon.level = 2;
        room.memory.defcon.since = Game.time;
        Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileInRoom.length+' hostiles in the room.',0);
      }
    }

    //set defcon based on the duration of the current defcon
    room.memory.defcon.duration = Game.time - room.memory.defcon.since;
    var duration = room.memory.defcon.duration;
    if (duration > 50 && 0 > room.memory.defcon.level && room.memory.defcon.level <5) {
      room.memory.defcon.level = 1 + room.memory.defcon.level;
      room.memory.defcon.since = Game.time;
      Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileInRoom.length+' hostiles in the room.',0);
    }



  }
};
