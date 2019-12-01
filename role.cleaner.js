module.exports = {


  // a function to run the logic for this role
  run(creep) {
    //creep.memory.currentTarget = false;
    // display creep role
    creep.room.visual.text(creep.memory.role+' ('+_.sum(creep.carry)+'/'+creep.carryCapacity+')', creep.pos, {color: 'green', font: 0.5, align: 'left'});

    //init structure objects
    var tombstones = creep.room.find(FIND_TOMBSTONES,{ filter: (s) => (_.sum(s.store >0))});
    tombstones.sort((a,b) => b.ticksToDecay - a.ticksToDecay);

    var storage = creep.room.storage


    var target = null; //target to bring energy

    //setting the variable to define the state of creep
    // working = bringing resources back to storages
    // not working = finding tombstones
    if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.memory.currentTarget = false;
    }

    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.memory.currentTarget = false;
    }



    //################################################################################
    //########### Move to the best tombstones         ################################
    //################################################################################

    // creep is working
    if (creep.memory.working == false && tombstones.length > 0) {
      //finds in order storage, container
      if(creep.withdraw(tombstones[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(tombstones[0]);
      }
    } else if (creep.memory.working == false && tombstones.length == 0) {
      creep.memory.role = "hauler";
      creep.memory.working = false;
    }

    //################################################################################
    //########### Find where to bring resources ######################################
    //################################################################################

    if (creep.memory.working == true) {
      // transfer all resources
      for(const resourceType in creep.carry) {
        if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
        }
      }
    }




  }
}
