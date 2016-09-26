var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Corner case', function(done) {
   it('Should trigger the latest set property (1 watcher)', function(done) {
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
         results.should.be.lengthOf(1);
         should.equal(results[0], 3);
         done();
      }, 0)
   });

   it('Should trigger the latest set property (2 watchers)', function(done) {
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

         results.should.be.lengthOf(2)
         should.equal(results[0], 3);
         should.equal(results[1], 3);

         done();
      }, 1)
   });

   //
   it('Should get triggered 2 times', function(done) {
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
      setTimeout(function() {

         results.should.be.lengthOf(1);
         results[0].should.equal(1);
         done()
      }, 0)

   });

   it('2 nested object with the same key', function(done) {
      var obj = {
         user1: {
            name: {
               title: "John"
            }
         },
         user2: {
            name: {
               title: "Jose"
            }
         }
      };

      var results = [];
      watch(obj, 'user1.name.title', function(value) {

         results.push(value)
      });

      obj.user2.name.title = "Pukka";
      setTimeout(function() {

         results.should.deepEqual(['John'])

         done()
      }, 0)

   });

});
