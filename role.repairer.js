var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'yellow', font: 0.5, align: 'left'});

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }

        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if(creep.memory.repairing) {


            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure){
                    if(structure.structureType == STRUCTURE_WALL){
                        return (structure.hits < 100000)
                    }else if(structure.structureType == STRUCTURE_RAMPART) {
                        return (structure.hits < 100000)
                    }else if(structure.structureType == STRUCTURE_ROAD) {
                          return (structure.hits < structure.hitsMax/100*15)
                    }else{
                        return (structure.hits < structure.hitsMax/100*75)
                    }
                }
            });

            if(target) {
                console.log(target);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(target);
                      console.log('Repairer '+creep.name + ':moving to '+target+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                     console.log('Repairer '+creep.name + ':Repairing '+target+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            } else {
                var mySpawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (mySpawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(mySpawn);
                }
            }

        } else { // Not Repariring
            var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0});//Finding nearest containers with energy
            if (targets !== null) {
                if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                     console.log('Repairer '+creep.name + ':moving to '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                    console.log('Repairer '+creep.name + ':withdrawing from '+targets+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity+'. Container:'+targets.store[RESOURCE_ENERGY]);
                }
            } else {// If no containers with energy, builder goes harvesting sources
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                    console.log('Repairer '+creep.name + ':moving to '+sources[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                console.log('Repairer '+creep.name + ':harvesting from '+sources[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            }
        }
    }
};
module.exports = roleRepairer;
