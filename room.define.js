/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room');
 * mod.thing == 'a thing'; // true
 */


module.exports = {


    run: function(room) {
      //find all sources
      var sources = room.find(FIND_SOURCES);
      //find all spawns and add them to room's memory
      var spawnsInRoom = room.find(FIND_MY_SPAWNS);
      room.memory.spawns = {};
      for (var i in spawnsInRoom) {
        room.memory.spawns[spawnsInRoom[i].id] = spawnsInRoom[i].memory; // link spawn.memory to room.spawns.{id}
      }
      //find the room controller
      var controller = room.find(FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_CONTROLLER});
      controller = controller[0];
      room.memory.controller = {};
      room.memory.controller[controller.id] = {level:controller.level};

      //find all towers
      var towers = room.find(FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_TOWER})

      //find all containers
      var containers = room.find(FIND_STRUCTURES,{ filter: (s) => s.structureType == STRUCTURE_CONTAINER});

      //assign containers to source
      for (var i in containers) {
        var c = containers[i];
        room.visual.text(c.memory.role+":"+c.store[RESOURCE_ENERGY], c.pos.x,c.pos.y+1, {color: 'white', font:  0.4, align:'center'});
        for (var s in sources) {
          if (c.pos.isNearTo(sources[s])) {
            sources[s].memory.container = c.id;
            c.memory.role = 'mining';
            c.memory.source = sources[s].id;
          }
        }
        if (!c.memory.source) {
          c.memory.role = 'storage';
        }
      }

      // Clearing non-existing containers
      for(var id in room.memory.containers) {
        if(!Game.getObjectById(id)) {
          console.log('Clearing non-existing containers memory: '+room.name+" - "+Game.getObjectById(id));
          delete Memory.rooms[room.name].containers[id];
        }
      }

      //find all extractors
      var extractors = room.find(FIND_MY_STRUCTURES,{ filter: (s) => s.structureType == STRUCTURE_EXTRACTOR});
      room.memory.extractors = extractors.length;

      //find all storage
      var storages = room.find(FIND_STRUCTURES,{ filter: (s) => s.structureType == STRUCTURE_STORAGE});
      for (var i in storages) {
        room.visual.text(storages[i].store[RESOURCE_ENERGY], storages[i].pos.x,storages[i].pos.y, {color: 'white', font:  0.4, align:'center'});
      }


      //find all links
      var links = room.find(FIND_MY_STRUCTURES,{ filter: (s) => s.structureType == STRUCTURE_LINK});
      //console.log(JSON.stringify(links));
      for (var l in links) {
        if (links[l].pos.inRangeTo(room.controller.pos,3)) {
          links[l].memory.role = 'controller';
        } else {
          links[l].memory.role = 'storage';
        }
      }

      //find all FIND_CONSTRUCTION_SITES
      var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      for (var i in constructionSites) {
        room.visual.text(constructionSites[i].progress+"/"+constructionSites[i].progressTotal, constructionSites[i].pos.x,constructionSites[i].pos.y, {color: 'white', font:  0.25, align:'center'});
      }

      /* TO DO
      * add towers
      * add spawns
      *
      *
      */

  }
};
