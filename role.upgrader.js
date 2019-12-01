var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {

    creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'grey', font: 0.5, align: 'left'});

    // Settings state
    if(creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('harvesting');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrading');
    }

    // Behavior settings
    if(creep.memory.upgrading) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) { //Not in range
        creep.moveTo(creep.room.controller);
        creep.room.visual.poly(creep.room.findPath(creep.pos, creep.room.controller.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
        //console.log('Upgrader '+creep.name + ':moving to '+creep.room.controller+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
      } else { // In range of controller & Upgrading
        //console.log('Upgrader '+creep.name + ':upgrading '+creep.room.controller+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
      }
    }
    else { // Not Upgrading
      var links = creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK && i.energy > 0 && i.memory.role == 'controller'});
      var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0});//Finding nearest containers or storage with energy
      if (links.length >0) {targets = links[0]};
      if (targets != null) {
        if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets);
          creep.room.visual.poly(creep.room.findPath(creep.pos, targets.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
          //console.log('Upgrader '+creep.name + ':moving to '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
        } else {
          //console.log('Upgrader '+creep.name + ':withdrawing from '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity+'. Container:'+targets.store[RESOURCE_ENERGY]);
        }
      } else {// If no containers with energy, upgrader goes harvesting sources or droppedEnergy
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES,{filter: (s) => (s.amount >50)});
        if (droppedEnergy.length >0) {
          droppedEnergy.sort((a,b) => b.amount - a.amount);// most energy first
          if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy[0]);
            //console.log('Upgrader '+creep.name + ':moving to '+droppedEnergy[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
          } else {
            //console.log('Upgrader '+creep.name + ':picking up '+droppedEnergy[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
          }
        } else {
          var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source,{reusePath: 5});
            //console.log('Upgrader '+creep.name + ':moving to '+source+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
          } else {
            //console.log('Upgrader '+creep.name + ':harvesting from '+source+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
          }
        }
      }
    }
  }
};

module.exports = roleUpgrader;
