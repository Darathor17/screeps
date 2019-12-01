var roleHarvester = {
    // a function to run the logic for this role
    run: function(creep) {

       creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'white', font: 0.5, align: 'left'});

        var room = creep.room.name
        // if creep is bringing energy to the spawn or an extension but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) =>
              (s.room.name == creep.room.name) &&
              s.energy < s.energyCapacity &&
              ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) || (s.energy < s.energyCapacity/100*50 && s.structureType == STRUCTURE_TOWER))
            });
            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                    console.log('Harvester '+creep.name + ':moving to '+structure+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                } else {
                    console.log('Harvester '+creep.name + ':transfering to '+structure+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            } else {
            //no spawn or extension needs energy. We try to fill containers
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)
                });
                if(targets.length > 0) {
                    targets.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                        console.log('Harvester '+creep.name + ':moving to '+targets[0]+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                    }
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity});
                    if (targets.length>0) {
                        targets.sort((a,b) => b.energy - a.energy);
                        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(structure);
                            console.log('Harvester '+creep.name + ':moving to '+structure+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                        } else {
                            console.log('Harvester '+creep.name + ':transfering to '+structure+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                        }
                    } else {
                    creep.moveTo(Game.spawns.Spawn1);
                    console.log('Harvester '+creep.name + ':waiting for work. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                    }

                }
            }
        } else { // if creep is supposed to harvest energy from source
            // find closest source
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE,{ filter: (s) => (s.room.name == creep.memory.madeIn)});
            console.log("harvester is going to source:"+source);
            //sources.sort((a,b) => b.energy - a.energy);
            // try to harvest energy, if the source is not in range
            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                    creep.room.visual.poly(Game.rooms[creep.room.name].findPath(creep.pos, source.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                } else {
                console.log('Harvester '+creep.name + ':harvesting '+source+'. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
                }
            } else {
                console.log('Harvester '+creep.name + ':waiting for source. Energy:' +creep.carry.energy+'/'+creep.carryCapacity);
            }
        }
    }
};

module.exports = roleHarvester;
