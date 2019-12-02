//DEFCON defines the readiness of the room and determine the correct course of action to defend at all cost the room
//DEFCON 1 Room is going to be lost, Defcon 2 has lasted more thant 50 ticks : Safe mode activated // Maximum alert
//DEFCON 2 10+ hostiles in the room OR Defcon 3 has lasted more thant 50 ticks : Balance energy between towers and room + 10 defenders + workers repair walls //  Full alert
//DEFCON 3 5-9 hostiles in the room OR Perimeter is being breached OR Defcon 4 lasted more than 50 ticks : 2 Defenders + Defcon4 to other rooms // High alert
//DEFCON 4 1-4 hostile(s) in the room // Towers get energy first // No loss at that point (buildings or walls) // Above normal readiness
//DEFCON 5 No hostile in the room // Normal operations // Normal readiness

module.exports = {
  run:function(room) {
    //memory init
    if (!room.memory.hasOwnProperty('defcon')) {
      room.memory.defcon = {level:-1,since:-1,duration:-1,defenses:-1,ruins:-1};
    } else {
      if (!room.memory.defcon.hasOwnProperty('level')) {
        room.memory.defcon.level = -1;
      }
      if (!room.memory.defcon.hasOwnProperty('since')) {
        room.memory.defcon.since = -1;
      }
      if (!room.memory.defcon.hasOwnProperty('duration')) {
        room.memory.defcon.duration = -1;
      }
      if (!room.memory.defcon.hasOwnProperty('defenses')) {
        room.memory.defcon.defenses = -1;
      }
      if (!room.memory.defcon.hasOwnProperty('ruins')) {
        room.memory.defcon.ruins = -1;
      }
    }

    //init variables
    var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    var ruins = room.find(FIND_RUINS);
    var defenses = room.find(FIND_STRUCTURES, {
      filter: function(structure) {
        if (structure.structureType == STRUCTURE_WALL || structureType == STRUCTURE_RAMPART) {
          return structure
        }
      }
    });


    //set defcon 5
    if (hostileCreeps.length <1) {
      if (room.memory.defcon.level !== 5) {
        room.memory.defcon.level = 5;
        room.memory.defcon.since = Game.time;
        console.log('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. No hostiles in the room.');
        //Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. No hostiles in the room.',0);
      }
    }  

    //set defcon 4
    if (0 < hostileCreeps.length && hostileCreeps.length < 5) {
      if (room.memory.defcon.level !== 4) {
        room.memory.defcon.level = 4;
        room.memory.defcon.since = Game.time;
        room.memory.defcon.defenses = defenses.length;
        room.memory.defcon.ruins = ruins.length;
        console.log('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileCreeps.length+' hostiles in the room.');
        //Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileCreeps.length+' hostiles in the room.',0);
      }
    }

    //set defcon 3  
    if ((4 < hostileCreeps.length && hostileCreeps.length < 10) || (defenses.length < room.memory.defcon.defenses) ) {
      if (room.memory.defcon.level !== 3) {
        room.memory.defcon.level = 3;
        room.memory.defcon.since = Game.time;
        Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileCreeps.length+' hostiles in the room.',0);
      }
    }

    //set defcon 2
    if (hostileCreeps.length >= 10){
      if (room.memory.defcon.level !== 2) {
        room.memory.defcon.level = 2;
        room.memory.defcon.since = Game.time;
        Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileCreeps.length+' hostiles in the room.',0);
      }
    }

    //set defcon based on the duration of the current defcon
    room.memory.defcon.duration = Game.time - room.memory.defcon.since;
    var duration = room.memory.defcon.duration;
    if (duration > 50 && 2 < room.memory.defcon.level && room.memory.defcon.level < 5) {
      room.memory.defcon.level += 1;
      room.memory.defcon.since = Game.time;
      Game.notify('Room '+room.name+' has been set to Defcon '+room.memory.defcon.level+'. '+hostileCreeps.length+' hostiles in the room.',0);
    }

// Actions for DEFCON1
  if (room.memory.defcon.level == 1) {
    var safeModeReturncode = room.controller.activateSafeMode();
    if (safeModeReturncode !==0) {
      console.log('Activation of Safe Mode in room '+room.name+' failed with Error code: '+safeModeReturncode);
    } else {
      console.log('Activation of Safe Mode in room '+room.name+' is succesful');
    }
  }


  }
};
