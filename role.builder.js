var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

 creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'yellow', font: 0.5, align: 'left'});

// Settings state
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

// Behavior settings
	    if(creep.memory.building) {
	        //var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (i) => i.structureType == STRUCTURE_WALL});
	        //targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (i) => i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_EXTENSION});
	        //var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
          var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, { filter: (s) => (s.room.name == creep.room.name)});
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    creep.room.visual.line(creep.pos, target.pos,{color: 'red', style: 'dashed'});
                    //console.log('Builder '+creep.name + ':moving to '+targets[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                    //console.log('Builder '+creep.name + ':building '+targets[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            } else {

                if (Game.spawns.Spawn1.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns.Spawn1);
                    creep.room.visual.poly(creep.room.findPath(creep.pos, Game.spawns.Spawn1.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                    //console.log('Builder '+creep.name+'Moving to '+Game.spawns.Spawn1+' for recycling. Energy: '+creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                    //console.log('Builder '+creep.name+' has been recycling.');
                }
            }
	    } else { // Not Building
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES,{filter: (s) => (s.amount >50)});
        var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: function(structure){
              if(structure.structureType == STRUCTURE_CONTAINER){
                  return (structure.memory.role == 'storage' && structure.store[RESOURCE_ENERGY] >0)
              }else if(structure.structureType == STRUCTURE_STORAGE) {
                  return (structure.store[RESOURCE_ENERGY] > 0)
              }
          }
        });

      //  if (droppedEnergy.length>0) {
        //    droppedEnergy.sort((a,b) => b.amount - a.amount);// most energy first
          //  if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(droppedEnergy[0]);

                 //console.log('Hauler '+creep.name + ':moving to '+droppedEnergy[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
        //    } else {
                //console.log('Hauler '+creep.name + ':picking up '+droppedEnergy[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
            //}
        if (targets != null) {
                if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                    creep.room.visual.line(creep.pos, targets.pos,{color: 'red', style: 'dashed'});
                     //console.log('Builder '+creep.name + ':moving to '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                    //console.log('Builder '+creep.name + ':withdrawing from '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }

        } else if(droppedEnergy.length>0) {// If no containers with energy, builder tries dropped energy
          droppedEnergy.sort((a,b) => b.amount - a.amount);// most energy first
          if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(droppedEnergy[0]);
          }
        } else  {// If no containers with energy, builder goes harvesting sources
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source,{reusePath: 5});
                    //console.log('Builder '+creep.name + ':moving to '+source+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                //console.log('Builder '+creep.name + ':harvesting from '+sources[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            }
        }

	}
};

module.exports = roleBuilder;
