var misc = require('function.misc');
require('game.define')();
require('spawn.prototype')();
var roleTower = require('role.tower');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var roleCleaner = require('role.cleaner');
var roleMoveToRoom = require('role.moveToRoom');
var spawnFactory = require('spawn.factory');
var roomDefine = require('room.define');
var defcon = require('room.defcon');




module.exports.loop = function () {


  // Clearing non-existing creep memory
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }


    //########################################
    // ########### Objects Init ############
    //########################################

    //creeps

    //structures
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
    var links = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_LINK);
    var containers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_CONTAINER);


    // #############################################################################
    //###################### VISUAL ######################

    try {
        for (var r in Game.rooms) {
            if (Game.rooms[r].controller && Game.rooms[r].controller.my) {

               Game.rooms[r].visual.text('RCL: '+Game.rooms[r].controller.level+'  ('+misc.shortenLargeNumber(Game.rooms[r].controller.progress,1)+'/'+misc.shortenLargeNumber(Game.rooms[r].controller.progressTotal,1)+')', 20, 2, {align: 'left', font: 0.6});

               var creepsInRoom = Game.rooms[r].find(FIND_MY_CREEPS);
               var haulers = _.sum(creepsInRoom, (creep) => creep.memory.role == 'hauler');
               var repairers = _.sum(creepsInRoom, (creep) => creep.memory.role == 'repairer');
               var builders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'builder');
               var upgraders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
               var miners = _.sum(creepsInRoom, (creep) => creep.memory.role == 'miner');

               var droppedRessources = Game.rooms[r].find(FIND_DROPPED_RESOURCES);
               var resourcesInRoom = 0;
               var containersMiningAmount = 0;
               var containersMiningAmountMax = 0;
               var containersStorageAmount = 0;
               var containersStorageAmountMax = 0;


               for (var l in droppedRessources) {
                   resourcesInRoom = resourcesInRoom + droppedRessources[l].amount;
               }
              var containersMining = Game.rooms[r].find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'mining')});
              for (j in containersMining) {
                  containersMiningAmount += containersMining[j].store[RESOURCE_ENERGY];
                  containersMiningAmountMax += containersMining[j].store.getCapacity();
              }
              var containersStorage = Game.rooms[r].find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.memory.role == 'storage')});
              for (i in containersStorage) {
                  containersStorageAmount += containersStorage[i].store[RESOURCE_ENERGY];
                  containersStorageAmountMax += containersStorage[i].store.getCapacity();
              }

              var constructionSites =  Game.rooms[r].find(FIND_MY_CONSTRUCTION_SITES);




               Game.rooms[r].visual.text('Energy: '+Game.rooms[r].energyAvailable+'/'+Game.rooms[r].energyCapacityAvailable, 0, 1, {align: 'left', font: 0.6});
               Game.rooms[r].visual.text('Dropped Ressources: '+resourcesInRoom, 0, 5, {align: 'left', font: 0.6});
               Game.rooms[r].visual.text('Container - Mining: '+misc.shortenLargeNumber(containersMiningAmount,1)+'/'+misc.shortenLargeNumber(containersMiningAmountMax,1), 0, 4, {align: 'left', font: 0.6});
               Game.rooms[r].visual.text('Container - Storage: '+misc.shortenLargeNumber(containersStorageAmount,1)+'/'+misc.shortenLargeNumber(containersStorageAmountMax,1), 0, 3, {align: 'left', font: 0.6});
               if (Game.rooms[r].storage) {
                  Game.rooms[r].visual.text('Room Storage: '+_.sum(Game.rooms[r].storage.store), 0, 2, {align: 'left', font: 0.6});
               } else {
                  Game.rooms[r].visual.text('Room Storage: Not build', 0, 2, {align: 'left', font: 0.6});
               }
               Game.rooms[r].visual.text('Constructions: '+constructionSites.length+' ('+misc.shortenLargeNumber(Game.rooms[r].memory.constructionSites.progress,1)+'/'+misc.shortenLargeNumber(Game.rooms[r].memory.constructionSites.progressTotal,1)+')', 0, 6, {align: 'left', font: 0.6});

               Game.rooms[r].visual.text('Creeps: '+creepsInRoom.length, 45, 1, {align: 'left', font: 0.5});
               Game.rooms[r].visual.text('Miners: '+miners, 45, 2, {align: 'left', font: 0.5});
               Game.rooms[r].visual.text('Haulers: '+haulers, 45, 3, {align: 'left', font: 0.5});
               Game.rooms[r].visual.text('Upgraders: '+upgraders, 45, 4, {align: 'left', font: 0.5});
               Game.rooms[r].visual.text('Builders: '+builders+'/'+Game.rooms[r].memory.factory.target.builders, 45, 5, {align: 'left', font: 0.5});
           }
        }
  } catch (error) {
      console.log('ERROR VISUAL MAIN :'+error);
  }

  // #############################################################################
  // Applying Roles to towers
  try {
    for(var t in towers) {
      roleTower.run(towers[t]);
    }
  } catch (err) {
    console.log('ERROR ROLE TOWER :'+err);
  }

    // #############################################################################
    // #############################################################################
    // Init spawn factory and room definitions

      for (var i in Game.spawns) {
        spawnFactory.run(Game.spawns[i]);
      }

      for (var i in Game.rooms) {
        if (Game.rooms[i].controller && Game.rooms[i].controller.my) {
            roomDefine.run(Game.rooms[i]);
            defcon.run(Game.rooms[i]);
        }

      }



    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            try {
              roleHarvester.run(creep);
            } catch (err) {
              console.log("ERROR WITH HARVESTER ROLE :"+err);
            }
        }

        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }

        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }

        if(creep.memory.role == 'repairer') {
          try {
            roleRepairer.run(creep);
          } catch (err) {
            console.log("ERROR WITH REPAIRER ROLE :"+err);
          }
        }

        if(creep.memory.role == 'claimer') {
            try {
              roleClaimer.run(creep);
            } catch (err) {
              console.log("ERROR WITH CLAIMER ROLE :"+err);
            }
        }

        if(creep.memory.role == 'cleaner') {
            try {
              roleCleaner.run(creep);
            } catch (err) {
              console.log("ERROR WITH CLEANER ROLE :"+err);
            }
        }

        if(creep.memory.role == 'moveToRoom') {
            try {
              roleMoveToRoom.run(creep);
            } catch (err) {
              console.log("ERROR WITH MOVE TO ROOM ROLE :"+err);
            }
        }

    }
}
