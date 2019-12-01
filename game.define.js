module.exports = function() {


  //adds memory to sources. (source.memory) which is set per room
  Object.defineProperty(Source.prototype, 'memory', {
      get: function() {
          if(_.isUndefined(this.room.memory.sources)) {
              this.room.memory.sources = {};
          }
          if(!_.isObject(this.room.memory.sources)) {
              return undefined;
          }
          return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
      },
      set: function(value) {
          if(_.isUndefined(this.room.memory.sources)) {
              Memory.sources = {};
          }
          if(!_.isObject(this.room.memory.sources)) {
              throw new Error('Could not set source memory');
          }
          this.room.memory.sources[this.id] = value;
      }
      //configurable: true,
  })

  //adds memory to containers. (container.memory) which is set per room.
  Object.defineProperty(StructureContainer.prototype, 'memory', {
      get: function() {
          if(_.isUndefined(this.room.memory.containers)) {
              this.room.memory.containers = {};
          }
          if(!_.isObject(this.room.memory.containers)) {
              return undefined;
          }
          return this.room.memory.containers[this.id] = this.room.memory.containers[this.id] || {};
      },
      set: function(value) {
          if(_.isUndefined(this.room.memory.containers)) {
              Memory.containers = {};
          }
          if(!_.isObject(this.room.memory.containers)) {
              throw new Error('Could not set container memory');
          }
          this.room.memory.containers[this.id] = value;
      }
    //  configurable: true,
  })

  //adds memory to links. (link.memory) which is set per room.
  Object.defineProperty(StructureLink.prototype, 'memory', {
      get: function() {
          if(_.isUndefined(this.room.memory.links)) {
              this.room.memory.links = {};
          }
          if(!_.isObject(this.room.memory.links)) {
              return undefined;
          }
          return this.room.memory.links[this.id] = this.room.memory.links[this.id] || {};
      },
      set: function(value) {
          if(_.isUndefined(this.room.memory.links)) {
              Memory.links = {};
          }
          if(!_.isObject(this.room.memory.links)) {
              throw new Error('Could not set link memory');
          }
          this.room.memory.links[this.id] = value;
      }
    //  configurable: true,
  })

};
