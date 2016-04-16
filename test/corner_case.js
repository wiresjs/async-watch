var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Corner case', function(done) {
   it('Should trigger the latest set property (1 watcher)', function() {
      var obj = {};
      var results = [];
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });
      obj.a = {
         b: {
            c: 1
         }
      };
      obj.a.b.c = 2;
      obj.a.b.c = 3;

      setTimeout(function() {
         results.should.be.lengthOf(2);
         should.equal(results[0], undefined);
         should.equal(results[1], 3);
         done();
      }, 1)
   });

   it('Should trigger the latest set property (2 watchers)', function() {
      var obj = {};
      var results = [];
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });
      obj.a = {
         b: {
            c: 1
         }
      };
      obj.a.b.c = 2;
      obj.a.b.c = 3;

      setTimeout(function() {
         results.should.be.lengthOf(4);
         should.equal(results[0], undefined);
         should.equal(results[0], undefined);
         should.equal(results[1], 3);
         should.equal(results[1], 3);
         done();
      }, 1)
   });

   it('Should get triggered 2 times', function() {
      var obj = {
         a: {
            b: 0
         }
      };

      var results = [];
      watch(obj, 'a.b', function(value) {
         results.push(value)
      });

      obj.a.b = 1;
      obj.a.b = 100;
      obj.a = {
         b: 0
      }
      obj.a = {
         b: -1
      }
      setTimeout(function() {
         console.log("\t", results);
         console.info("\tNot critical");
         console.info("\tNeeds fixing! Result should have only 2 elements");
      }, 1)

   })

});
