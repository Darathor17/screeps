var misc = require('function.misc');
module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createStandard =
        function(energy, roleName, roomName, opt) {
            // create a balanced body as big as possible with the given energy
            var body = [];
            var numberOfParts = Math.min(Math.floor(energy / 200),8); // min is 200 energy 1 part of each
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            var creepName = roleName+Game.time.toString();
            var canCreate = this.spawnCreep(body,creepName,{ dryRun: true });
            if(canCreate == OK) {
                var newName = this.spawnCreep(body, creepName, {memory:{ role: roleName, working: false, madeIn: roomName}});
                console.log(this.name+' is spawning '+newName+' ('+roleName+')');
            } else {
                var errorMsg = misc.errorCodeSpawn(canCreate);
                console.log(this.name+' cannot spawn creep '+roleName+' in '+roomName+'. Error is:'+errorMsg);
            }
        };

      // create a new template of Hauler
      StructureSpawn.prototype.createHauler =
        function(energy, roleName, roomName, opt) {
          // create a balanced body as big as possible with the given energy
          var body = [];
          var numberOfParts = Math.min(Math.floor(energy / 150),8);
          var numberOfPartsMove = Math.ceil(numberOfParts/2);
          //console.log(numberOfParts);
          for (let i = 0; i < numberOfParts; i++) {
            var error = body.push(CARRY);
            //console.log(error);
          }
          for (let i = 0; i < numberOfPartsMove; i++) {
            var error = body.push(MOVE);
            //console.log(error);
          }
          // create creep with the created body and the given role
          var creepName = roleName+Game.time.toString();
          var canCreate = this.spawnCreep(body,creepName,{ dryRun: true });
          if(canCreate == OK) {
              var newName = this.spawnCreep(body, creepName, {memory:{ role: roleName, working: false, madeIn: roomName}});
              console.log(this.name+' is spawning '+newName+' ('+roleName+')');
          } else {
              var errorMsg = misc.errorCodeSpawn(canCreate);
              console.log(this.name+' cannot spawn creep '+roleName+' in '+roomName+'. Error is:'+errorMsg);
          }
      };


      // create a new template of Miner
      StructureSpawn.prototype.createMiner =
        function(energy, roleName, roomName, opt) {
          // create a balanced body as big as possible with the given energy
          var body = [];
          var numberOfPartsWork = Math.min(Math.floor(energy / 150),5);
          var numberOfPartsMove = Math.ceil(numberOfPartsWork/2);
          for (let i = 0; i < numberOfPartsWork; i++) {
            body.push(WORK);
          }
          for (let i = 0; i < numberOfPartsMove; i++) {
            body.push(MOVE);
          }
          // create creep with the created body and the given role
          var creepName = roleName+Game.time.toString();
          var canCreate = this.spawnCreep(body,creepName,{ dryRun: true });
          if(canCreate == OK) {
              var newName = this.spawnCreep(body, creepName, {memory:{ role: roleName, working: false, madeIn: roomName}});
              console.log(this.name+' is spawning '+newName+' ('+roleName+')');
          } else {
              var errorMsg = misc.errorCodeSpawn(canCreate);
              console.log(this.name+' cannot spawn creep '+roleName+' in '+roomName+'. Error is:'+errorMsg);
          }
      };

      // create a new template of Upgrader
      StructureSpawn.prototype.createUpgrader =
        function(energy, roleName, roomName, opt) {
          // create a balanced body as big as possible with the given energy
          var body = [];
          var numberOfParts = Math.min(Math.floor((energy-50)/150),6); // if energy = 200 > 1
          var numberOfPartsMove = Math.ceil(numberOfParts/2);
          if (numberOfParts>0) {
            body.push(CARRY);
          }
          for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
          }
          for (let i = 0; i < numberOfPartsMove; i++) {
            body.push(MOVE);
          }

          // create creep with the created body and the given role
          var creepName = roleName+Game.time.toString();
          var canCreate = this.spawnCreep(body,creepName,{ dryRun: true });
          if(canCreate == OK) {
              var newName = this.spawnCreep(body, creepName, {memory:{ role: roleName, working: false, madeIn: roomName}});
              console.log(this.name+' is spawning '+newName+' ('+roleName+')');
          } else {
              var errorMsg = misc.errorCodeSpawn(canCreate);
              console.log(this.name+' cannot spawn creep '+roleName+' in '+roomName+'. Error is:'+errorMsg);
          }
      };

        // create a new template of short range warrior 
        // if energy is at least 130 [MOVEx1, ATTACKx1] : Most Basic warrior
        // if energy is above 190 [MOVEx2, ATTACKx1, TOUGHx1] : intermediate
        StructureSpawn.prototype.createWarrior=
          function(energy, roleName, roomName, opt) {
            // create a balanced body as big as possible with the given energy
            var body = [];
            if (130 < energy && energy < 190) {
                body.push(MOVE);
                body.push(ATTACK);
            } else if (energy >= 190) {
                var numberOfParts = Math.min(Math.floor(energy / 190),5); // max energy is 950

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(TOUGH);
                    body.push(MOVE);
                    body.push(ATTACK);
                    body.push(MOVE);
                }
            }
 
            // create creep with the created body and the given role
            var creepName = roleName+Game.time.toString();
            var canCreate = this.spawnCreep(body,creepName,{ dryRun: true });
            if(canCreate == OK) {
                var newName = this.spawnCreep(body, creepName, {memory:{ role: roleName, working: false, madeIn: roomName}});
                console.log(this.name+' is spawning '+newName+' ('+roleName+')');
            } else {
                var errorMsg = misc.errorCodeSpawn(canCreate);
                console.log(this.name+' cannot spawn creep '+roleName+' in '+roomName+'. Error is:'+errorMsg);
            }
        };

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createClaimer =
        function (roomName, opt) {
            return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', madeIn: roomName});
        }
};


/*

    MOVE: "move",
    WORK: "work",
    CARRY: "carry",
    ATTACK: "attack",
    RANGED_ATTACK: "ranged_attack",
    TOUGH: "tough",
    HEAL: "heal",
    CLAIM: "claim",

    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },

*/
