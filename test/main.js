var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Generic tests', function() {
   it('Should call a simple watcher', function(done) {
      var obj = {
         a: 1
      };
      var results = [];
      watch(obj, 'a', function(value) {
         results.push(value);
      });
      setTimeout(function() {
         results.should.be.lengthOf(2);
         results[0].should.equal(1)
         results[1].should.equal(2)
         done();
      }, 1);
      obj.a = 2;
   });

   it('2 simple watchers should perfectly', function(done) {
      var obj = {
         a: 1
      };
      var results = [];
      watch(obj, 'a', function(value) {
         results.push(value);
      });
      watch(obj, 'a', function(value) {
         results.push(value);
      });
      setTimeout(function() {

         results.should.be.lengthOf(4);
         results[0].should.equal(1)
         results[1].should.equal(1)
         results[2].should.equal(2)
         results[3].should.equal(2)
         done();
      }, 10);
      obj.a = 2;
   });

   it('Nested watcher without default values (1 watcher)', function(done) {
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
      setTimeout(function() {
         results.should.be.lengthOf(2);
         should.equal(results[0], undefined);
         should.equal(results[1], 1);
         done();
      }, 1);
   });

   it('Nested watcher without default values (1 watcher) with a tiny delay', function(done) {
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
      setTimeout(function() {
         obj.a.b.c = 2;
      }, 0)
      setTimeout(function() {
         results.should.be.lengthOf(3);
         should.equal(results[0], undefined);
         should.equal(results[1], 1);
         should.equal(results[2], 2);
         done();
      }, 5);
   });

   it('Nested watcher without default values (2 watchers) with a tiny delay', function(done) {
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
      setTimeout(function() {
         obj.a.b.c = 2;
      }, 0)
      setTimeout(function() {

         results.should.be.lengthOf(6);
         should.equal(results[0], undefined);
         should.equal(results[1], undefined);
         should.equal(results[2], 1);
         should.equal(results[3], 1);
         should.equal(results[4], 2);
         should.equal(results[5], 2);
         done();
      }, 5);
   });

   it('Partially destroying an object (1 watcher) (in the middle, breaking the chain)', function(done) {
      var obj = {};
      var results = [];
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });

      setTimeout(function() {
         obj.a = {
            b: {

            }
         }
         setTimeout(function() {
            obj.a = {
               b: {
                  c: 5
               }
            }
         }, 0)
      }, 0);
      setTimeout(function() {

         results.should.be.lengthOf(3);
         should.equal(results[0], undefined);
         should.equal(results[1], undefined);
         should.equal(results[2], 5);
         done();
      }, 5);
   });

   it('Partially destroying an object (2 watchers) (in the middle, breaking the chain)', function(done) {
      var obj = {};
      var results = [];
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });

      setTimeout(function() {
         obj.a = {
            b: {

            }
         }
         setTimeout(function() {
            obj.a = {
               b: {
                  c: 5
               }
            }
         }, 0)
      }, 0);
      setTimeout(function() {
         results.should.be.lengthOf(6);
         should.equal(results[0], undefined);
         should.equal(results[1], undefined);
         should.equal(results[2], undefined);
         should.equal(results[3], undefined);
         should.equal(results[4], 5);
         should.equal(results[5], 5);
         done();
      }, 5);
   });

});
