  module.exports = {


  // a function to run the logic for this role
  run(creep) {
    //creep.memory.currentTarget = false;
    // display creep role
    creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'green', font: 0.5, align: 'left'});

    //init structure objects
    var listOfSources = creep.room.find(FIND_SOURCES);
    var containersMining = creep.room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'mining')});
    var containersStorage = creep.room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'storage')});
    var storage = creep.room.storage;

    var target = null; //target to bring energy

    //setting the variable to define the state of creep
    // working = briging energy to storage, containers, spawn, etc ..
    // not working = finding energy to tranport
    if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.memory.currentTarget = false;
      creep.memory.currentTargetType = false;
    }

    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.memory.currentTarget = false;
      creep.memory.currentTargetType = false;
    }



    //################################################################################
    //########### Find where to bring energy #########################################
    //################################################################################

    // creep is working
    // Decide what requires energy most
    if (creep.memory.working == true) {
      if (!creep.memory.currentTarget) { //no target
        //finds in order spawn, expansions, container, tower, storage
        var priority0 = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
          { filter: (s) => (s.room.name === creep.memory.madeIn) && s.energy < s.energyCapacity && (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)});


        var priority1 = creep.room.find(FIND_MY_STRUCTURES,
          { filter: (s) => s.energy < s.energyCapacity && (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
            || (s.energy < s.energyCapacity/100*50 && s.structureType == STRUCTURE_TOWER)
          });


        var priority2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: function(s) {
            if (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'storage') {
              return (s.store[RESOURCE_ENERGY] < s.storeCapacity/100*80)
            }
          }
        });

        var priority2b = creep.room.find(FIND_MY_STRUCTURES,
          { filter: (s) => (s.energy < s.energyCapacity && s.structureType == STRUCTURE_LINK && s.memory.role == 'storage')
        });


        var priority3 = creep.room.find(FIND_MY_STRUCTURES,
          { filter: (s) => ((s.energy + creep.carry.energy) < s.energyCapacity && s.structureType == STRUCTURE_TOWER)
        });


        if (creep.room.storage) {
          const storageCurrent = _.sum(creep.room.storage.store);
          if (storageCurrent < creep.room.storage.storeCapacity) {
            var priority4 = creep.room.storage;
          } else {
            var priority4 = false;
          }
        } else {
          var priority4 = false;
        }


        if (creep.room.energyAvailable <300 && priority0) {
          target = priority0;
        } else if (priority1.length >0) {
          target = priority1[0];
        } else if (priority2b.length>0){
          target = priority2b[0];
        } else if (priority2){
          target = priority2;
        } else if (priority3.length>0) {
          priority3.sort((a,b) => a.energy - b.energy);
          target = priority3[0];
        } else if (priority4) {
          target = priority4;
        }

        if (target) {
          creep.memory.currentTarget = target;
        } else {
          console.log("Warning: No target can be determined for hauler "+creep.name+" (room:"+creep.room.name+")");
        }

      } else { // a target is defined
          if (creep.transfer(Game.getObjectById(creep.memory.currentTarget.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.currentTarget.id));
            creep.room.visual.poly(creep.room.findPath(creep.pos, creep.memory.currentTarget.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
          }
          if (creep.transfer(Game.getObjectById(creep.memory.currentTarget.id), RESOURCE_ENERGY) == ERR_FULL) {
            creep.memory.currentTarget = false;
          }
      }


    }



          //################################################################################
          //########### Find where to gather energy ########################################
          //################################################################################

          if (creep.memory.working == false) {
            if (creep.memory.currentTarget) {
              var currentTarget = Game.getObjectById(creep.memory.currentTarget);
              //console.log(creep.name+" current target is:"+Game.getObjectById(creep.memory.currentTarget));
              if (creep.memory.currentTargetType == "container") {
                //go to target
                if (creep.withdraw(currentTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(currentTarget,{reusePath: 10});
                  creep.room.visual.poly(Game.rooms[creep.room.name].findPath(creep.pos, currentTarget.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                }
              } else if (creep.memory.currentTargetType == "energy") {
                if (Game.getObjectById(creep.memory.currentTarget) == null) { //energy decayed
                  creep.memory.currentTarget = false;
                  creep.memory.currentTargetType = false;
                } else {
                  if (creep.pickup(currentTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currentTarget,{reusePath: 5});
                    creep.room.visual.poly(Game.rooms[creep.room.name].findPath(creep.pos, currentTarget.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                  }

                }
              }
            } else { // No known target //todo add storage
              const closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'mining' && s.store[RESOURCE_ENERGY] > creep.carryCapacity)});
              const closestDroppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (s) => (s.amount > creep.carryCapacity)});

              if (closestDroppedEnergy) {
                if (creep.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(closestDroppedEnergy,{reusePath: 5});
                  creep.room.visual.poly(creep.room.findPath(creep.pos, closestDroppedEnergy.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                  creep.memory.currentTarget = closestDroppedEnergy.id;
                  creep.memory.currentTargetType = "energy";
                }
              } else if (closestContainer) {
                if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(closestContainer,{reusePath: 10});
                  creep.room.visual.poly(creep.room.findPath(creep.pos, closestContainer.pos), {stroke: '#fff', strokeWidth: .15,opacity: .2, lineStyle: 'dashed'});
                  creep.memory.currentTarget = closestContainer.id;
                  creep.memory.currentTargetType = "container";
                }
              }
            }


          }
        }
      }
