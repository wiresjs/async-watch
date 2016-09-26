"use strict";
var should = require('should');
var AsyncWatch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Subscriptions', function() {
   it('SHould properly handle old value (simple case)', function(done) {

      let objA = {
         name: `first name`
      }

      let objB = {
         name: `second name`
      }

      var watcher1 = AsyncWatch(objA, `name`, function(v){
         // console.log(n,`change happened on ObjA`);
         //console.log("obj1", v)
      })

      var watcher2 = AsyncWatch(objB, `name`, function(v){
         //console.log(n,`change happened on ObjB`);
          //console.log("obj2", v)
      })

      var subscription = AsyncWatch.subscribe([watcher1, watcher2], function(changes) {
         //console.log(changes)

      })

      //objB.name = objA.name;

      setTimeout(() => {
         objB.name = `second modification`;
         objA.name = `third modification`;
      }, 1)

      setTimeout(function(){
         done();
      },20)
   });

});
