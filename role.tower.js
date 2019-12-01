var roleTower = {
    // a function to run the logic for this role
    run: function(tower){

        tower.room.visual.text(tower.energy+'/'+tower.energyCapacity, tower.pos.x,tower.pos.y+1, {color: 'white', font:  0.4, align:'center'});

        var hostileInRoom = tower.room.find(FIND_HOSTILE_CREEPS);
        var creepToHeal = tower.room.find(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
        var repairTargets = tower.pos.findInRange(FIND_STRUCTURES, 30, {
            filter: function(structure){
                if(structure.structureType == STRUCTURE_WALL){
                    return (structure.hits < 20000)
                }else if(structure.structureType == STRUCTURE_RAMPART) {
                    return (structure.hits < 20000)
                }else{
                    return (structure.hits < structure.hitsMax)
                }
            }
        });

        if(hostileInRoom.length >0) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            console.log(tower+' is firing on '+closestHostile)
            if (closestHostile.owner.username === 'Invader') {
                Game.notify('Room '+tower.room.name+' is under attack by '+closestHostile.owner.username+'. Firing on '+closestHostile.id, 0)
            }
            tower.attack(closestHostile);
        } else if (creepToHeal.length) {
            creepToHeal.sort(function(a, b){return a.hits - b.hits});
            tower.heal(creepToHeal[0]);
        }else{
            if(repairTargets.length){
                repairTargets.sort(function(a, b){
                    return a.hits - b.hits;
                })
                tower.repair(repairTargets[0]);
                console.log(tower+' is repariring '+repairTargets[0]+'.energy:'+repairTargets[0].hits+'/'+repairTargets[0].hitsMax);
            }
        }
    }
};
module.exports = roleTower;
