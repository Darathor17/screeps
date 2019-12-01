// Module to claim a room
//add a flag named "claim1" in the target room
//build one claimer creep, then it will go there and claim the room
//todo : add a carry & work part so it can be useful
//to reserve the controller, put in memory creep.memory.claim =false;


var roleMoveToRoom =  {
    run: function(creep){
        creep.room.visual.text(creep.memory.target, creep.pos, {color: 'white', font: 0.4, align: 'left'});
        console.log(creep.name+': Current room is '+creep.room.name);
        creep.memory.claim = true;


        if (Game.flags.build1) {
          //console.log("creep "+creep.name+" is moving to: "+Game.flags.claim1.pos.roomName);
          creep.memory.target = Game.flags.build1.pos.roomName;
        } else {
          console.log("Please add a flag with build1 name");
        }


        if(creep.memory.target != creep.room.name){
            var exits = Game.map.findExit(creep.room,creep.memory.target)
            var exit = creep.pos.findClosestByRange(exits)
            //console.log(creep.name+': found exits : '+exits)
            //console.log(creep.name+': found exits : '+exit)
            //creep.memory.expiresAt += 1
            creep.moveTo(exit);
        }else{
          if (!creep.pos.isNearTo(Game.flags.build1.pos)) {
            //console.log(Game.flags.build1.pos);
            creep.moveTo(Game.flags.build1.pos);
          }
          creep.memory.building = 'false';
          creep.memory.role = 'builder';
        }
    }
};
module.exports = roleMoveToRoom;
