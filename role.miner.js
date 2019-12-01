var roleMiner = {
    // a function to run the logic for this role
    run: function(creep) {

        creep.room.visual.text(creep.memory.role, creep.pos, {color: 'white', font: 0.5, align: 'left'});

        //Find a source with no miner
        if (!creep.memory.working) {
          var sources = creep.room.find(FIND_SOURCES); // Find all sources
          var miners = creep.room.find(FIND_MY_CREEPS, { filter: (creep) => (creep.memory.role == 'miner' && creep.memory.target != null)}); //find miners in the room with active target
          var sourcesTaken = []; //creates an empty object to store source which are already harvested by other miners
          for (var i in miners) {
              sourcesTaken[i] = miners[i].memory.target;
          }
          // removes already assigned sources
          for (var j in sources) {
            for (var k in sourcesTaken) {
                if (sources[j].id == sourcesTaken[k]) {
                  sources.splice(j,1);
                }
            }
          }
          if (sources.length >0){ //there is at least an available source
            var source = sources[0];
            creep.memory.container = source.memory.container; //add the assigned container so creep can move to it later
            source.memory.minedBy = creep.id; // Not used at the time
            creep.memory.target = source.id;
            creep.memory.working = true;
          } else {
            console.log(creep.name+': No free source found');
            creep.say('idle');
          }
        }


        //moves and harvest the target
        if (creep.memory.working) {
            var source = Game.getObjectById(creep.memory.target);
            var container = Game.getObjectById(creep.memory.container);
            if (container) {
              if (creep.pos.isEqualTo(container.pos)) {
                creep.harvest(source);
                //console.log('Miner '+creep.name + ':harvesting '+source+'.');
              } else {
                creep.moveTo(container);
              }
            } else {
              if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                //console.log('Miner '+creep.name+' ('+creep.pos+') is moving to '+source);
              } else {
                //console.log('Miner '+creep.name + ':harvesting '+source+'.');
              }
            }
        }

        //release the source if the creep is about to expire ## TODO: handle if destroyed by hostile action
        if (creep.ticksToLive <2 || creep.hits < creep.hitsMax/2) {
          source.memory.minedBy = undefined;
        }




  }
};

module.exports = roleMiner;
