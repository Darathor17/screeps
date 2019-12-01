//########################################
// ########### Creeps Factory ############
//########################################

var spawnFactory = {

  run: function(spawn){

    var roomLevel = spawn.room.controller.level;
    var roomName = spawn.room.name;
    //var defcon = spawn.room.memory.defcon.level;
    var defcon = 1;
    //init variables containing numbers of creeps per roles
    var creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    var harvesters = _.sum(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.madeIn == roomName);
    var harvesterExtractors = _.sum(creepsInRoom, (creep) => creep.memory.role == 'harvesterExtractor');
    var harvesters2 = _.sum(creepsInRoom, (creep) => creep.memory.role == 'harvester2');
    var repairers = _.sum(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.madeIn == roomName);
    var builders = _.sum(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.madeIn == roomName);
    var upgraders = _.sum(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.madeIn == roomName);
    var builders = _.sum(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.madeIn == roomName);
    var scouts = _.sum(Game.creeps, (creep) => creep.memory.role == 'scout' && creep.memory.madeIn == roomName);
    var claimers = _.sum(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.madeIn == roomName);
    var miners = _.sum(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.madeIn == roomName);
    var haulers = _.sum(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.memory.madeIn == roomName);
    var defenders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'defender');
    var constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);

    //init other variables
    var sources = spawn.room.find(FIND_SOURCES);
    var numberOfSources = sources.length;
    var energyOfRoomCapacity = spawn.room.energyCapacityAvailable;
    var energyOfRoom = spawn.room.energyAvailable;
    var minerals = spawn.room.find(FIND_MINERALS);
    var mineral = minerals[0];
    // Init number of creeps per room
    var minHarvesters = 0;
    var minMiners = 0;
    var minHaulers = 0;
    var minUpgraders = 0;
    var minBuilders = 0;
    var minRepairers = 0;
    var minScouts = 0;
    var minClaimers = 0;
    var minHarvesters2 = 0;
    var minDefenders = 0;
    var minHarvesterExtractors = 0;


//###################### VISUAL ######################
spawn.room.visual.text(spawn.energy+'/'+spawn.energyCapacity, spawn.pos.x,spawn.pos.y+1, {color: 'white', font:  0.5, align:'center'});
if (spawn.spawning) {
  var remainingTime = spawn.spawning.remainingTime;
  var needTime = spawn.spawning.needTime;
  var timePourcentage = Math.round(100-(remainingTime/needTime*100));
  spawn.room.visual.text(spawn.spawning.name+' ('+timePourcentage+')', spawn.pos.x,spawn.pos.y+2, {color: 'white', font:  0.5, align:'center'});
}


//###################### ROOM LEVEL 1 ######################
    if (roomLevel == 1) {
      minHarvesters = numberOfSources;
      minUpgraders = 1;
    }
//###################### ROOM LEVEL 2 ######################
    if (roomLevel == 2) {
      minMiners = numberOfSources;
      minHaulers = numberOfSources;
      minUpgraders = numberOfSources;
      minRepairers = 0;
     if (spawn.room.memory.defcon < 5) {
      minDefenders = 1;
      }
    }

//###################### ROOM LEVEL 3 ######################
    if (roomLevel == 3) {
      minMiners = numberOfSources;
      minHaulers = numberOfSources+1;
      minUpgraders = numberOfSources+1;
      minClaimers = 0;
      minBuilders = 0;
    }

//###################### ROOM LEVEL 4 ######################
    if (roomLevel == 4) {
      minMiners = numberOfSources;
      minHaulers = 2*numberOfSources;
      minUpgraders = 2;
      minScouts = 0;
      minClaimers = 0;
    }

//###################### ROOM LEVEL 5 ######################
    if (roomLevel == 5) {
      minHarvesters = 0;
      minMiners = numberOfSources;
      minHaulers = 2*numberOfSources;
      minRepairers = 0;
      minUpgraders = 2;
      minScouts = 0;
      minClaimers = 0;
      minHarvesters2 = 0;
    }

//###################### ROOM LEVEL 6 ######################
    if (roomLevel == 6) {
      minHarvesters = 0;
      minMiners = numberOfSources;
      minHaulers = 1+numberOfSources;
      minRepairers = 0;
      minUpgraders = numberOfSources;
      minScouts = 0;
      minClaimers = 0;
      minHarvesters2 = 0;
      if (mineral.mineralAmount > 0) {
        minHarvesterExtractors = spawn.room.memory.extractors;
      }
    }

//###################### ROOM LEVEL 7 ######################
    if (roomLevel == 7) {
      minHarvesters = 0;
      minMiners = numberOfSources;
      minHaulers = 1+numberOfSources;
      minRepairers = 0;
      minUpgraders = numberOfSources+1;
      minScouts = 0;
      minClaimers = 0;
      minHarvesters2 = 0;
      if (mineral.mineralAmount > 0) {
        minHarvesterExtractors = spawn.room.memory.extractors;
      }
    }
//###################### ROOM LEVEL 8 ######################
    if (roomLevel == 8) {
      minHarvesters = 0;
      minHarvesterExtractors = spawn.room.memory.extractors;
      minMiners = numberOfSources;
      minHaulers = 2;
      minRepairers = 0;
      minUpgraders = 3;
      minScouts = 0;
      minClaimers = 0;
      minHarvesters2 = 0;
    }

//###################### Routines ######################
    if (constructionSites.length >0) {
       if (constructionSites.length > 10) {
           minBuilders = 2;
       } else {
           minBuilders = 2;
       }
    } else if (builders >0) {
       minBuilders = 0;
    }

    if (spawn.room.controller.ticksToDowngrade < 1500 && minUpgraders < 1) {
       minUpgraders = 1;
    }

    if (defcon === 3) {
      minDefenders = 2;
    } else if (defcon === 2) {
      minDefenders = 4;
    }

   //repairer (when no tower)
   if (roomLevel < 3) {

     var repairTargets = spawn.room.find(FIND_STRUCTURES, {
       filter: function(structure){
         if (structure.structureType == STRUCTURE_ROAD) {
           return (structure.hits < structure.hitsMax/100*15)
         }else if (structure.structureType == STRUCTURE_WALL) {
           return (structure.hits < 30000)
         }else{
           return (structure.hits < structure.hitsMax/100*75)
         }
       }
     });

     if (repairTargets.length > 0 && minRepairers <1) {
       minRepairers = 1;
     }
  }


  //repairer (when no tower)
  if (Game.flags.claim1) {
      minClaimers = 1;
    }
//todo change role on the fly whenever possible. Especially to survive a partial wipe
    // if (harvesters == 0 && haulers == 0) {
    //         // if there are still miners left
    //         if (miners > 0 && minHaulers >0) {
    //             // create a hauler
    //             minHaulers = 1;
    //         }
    //         // if there is no miner left
    //         else if (minHarvesters <1) {
    //             // create a harvester because it can work on its own
    //             minHarvesters = 1;
    //         }
    // }



    if (!spawn.spawning) { //spawn is free
        if (defenders < minDefenders) {
          spawn.createWarrior(energyOfRoom,'defender',spawn.room.name);
        }
        else if(harvesters < minHarvesters) {
          var newName = spawn.createStandard(energyOfRoom,'harvester',spawn.room.name);
        }
        else if(miners < minMiners) {
          var newName = spawn.createMiner(energyOfRoom,'miner',spawn.room.name);
        }
        else if(haulers < minHaulers) {
          var newName = spawn.createHauler(energyOfRoom,'hauler',spawn.room.name);
          console.log('Spawn '+spawn.name+' is spawning new hauler: ' + newName);
        }
        else if(upgraders < minUpgraders) {
          var newName = spawn.createUpgrader(energyOfRoom,'upgrader',spawn.room.name);
          console.log('Spawning new upgrader: ' + newName);
        }
        else if(builders < minBuilders) {
          var newName = spawn.createStandard(energyOfRoom,'builder',spawn.room.name);
        }
        else if(repairers < minRepairers) {
          var newName = spawn.createStandard(energyOfRoom,'repairer',spawn.room.name);
        }
        else if(scouts < minScouts) {
          //spawn.createWarrior(energyOfRoom,'scout',spawn.room.name,false);
          spawn.createStandard(400,'moveToRoom',spawn.room.name);
        }
        else if(claimers < minClaimers) {
          var newName = spawn.createClaimer(spawn.room.name);
          console.log('Spawning new claimer: ' + newName);
        }
        else if(harvesters2 < minHarvesters2) {
          var newName = spawn.createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'harvester2', home:'E22S66',target: 'E23S66',sourceIndex: '0',working:false});
          console.log('Spawning new interharvesters: ' + newName);
        }
        else if(harvesterExtractors < minHarvesterExtractors) {
          var newName = spawn.createStandard(energyOfRoom,'harvesterExtractor',spawn.room.name);
        }
    } else { // spawn is in use
        let progression = spawn.spawning.needTime-spawn.spawning.remainingTime;
        console.log(spawn.name+' is spawning '+spawn.spawning.name+' ('+progression+'/'+spawn.spawning.needTime+')');
    }
  }
};
module.exports = spawnFactory;

//function to recycle creep
//function to spawn differents tier of creeps
