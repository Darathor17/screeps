/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */

var roleScout = {


run: function(creep,targetRoom) {
    
    creep.room.visual.text(creep.memory.role, creep.pos, {color: 'red', font: 0.6, align: 'left'});

    if(targetRoom != creep.room.name) {
            //console.log(targetRoom+' is not '+creep.room.name);
            var exits = Game.map.findExit(creep.room,targetRoom);
            var exit = creep.pos.findClosestByRange(exits);
            creep.moveTo(exit);
            //console.log(creep.name+' moving to '+exit);
    } else {
        //console.log('Im in the good room')
        var targetsInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        if(targetsInRange.length > 0) {
            creep.attack(targetsInRange[0]);
            console.log('Scout '+creep.name+' is firing upon '+targetsInRange[0]);
        }else{
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if(target != undefined){
                creep.moveTo(target);
                console.log(creep.name+' moving to '+target);
            } else {
              //console.log('No targets in room '+creep.room.name+creep.pos);
              if (!creep.pos.isNearTo(creep.room.controller)) {
                creep.moveTo(creep.room.controller);
                console.log(creep.name+' moving to '+creep.room.controller);
              }
            }
        }
    }

}


};
module.exports = roleScout;
