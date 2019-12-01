/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.misc');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  exflate(id) {
    return Game.getObjectById(id);
  },
  inlate(object) {
    return object.id;
  },

   randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  },

  errorCodeSpawn(errorCode) {
    switch (errorCode) {
      case 0:
        return errorCode+' - A creep with the given body and name can be created';
        break;
      case -1:
        return  errorCode+' - You are not the owner of this spawn.';
        break;
      case -3:
        return  errorCode+' - There is a creep with the same name already.';
        break;
      case -6:
        return  errorCode+' - The spawn and its extensions contain not enough energy to create a creep with the given body.';
        break;
      case -10:
        return  errorCode+' - Body is not properly described.';
        break;
      case -14:
        return  errorCode+' - Your Room Controller level is insufficient to use this spawn.';
        break;
    }
  },

   shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
},

  recycle(creep) {
    if (creep.room.memory.spawns[0].recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.memory.spawns[0]);
        //console.log('Builder '+creep.name+'Moving to '+Game.spawns.Spawn1+' for recycling. Energy: '+creep.carry.energy+'/'+creep.carryCapacity);
    } else {
        //console.log('Builder '+creep.name+' has been recycling.');
    }
  }

};
