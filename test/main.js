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

      obj.a = 2;
      setTimeout(function() {

         results.should.be.lengthOf(1);
         results[0].should.equal(2)
         done();
      }, 0);
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
         results.should.be.lengthOf(2);
         results[0].should.equal(2)
         results[1].should.equal(2)
         done();
      }, 0);
      obj.a = 2;
   });
   //
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
         results.should.be.lengthOf(1);
         should.equal(results[0], 1);
         done();
      }, 20);
   });

   it('Nested watcher without default values (1 watcher) with a tiny delay', function(done) {
      var obj = {};
      var results = [];
      var cb = function(value) {
         results.push(value);
      };
      watch(obj, 'a.b.c', cb);

      obj.a = {
         b: {
            c: 1
         }
      };
      setTimeout(function() {
         obj.a.b.c = 2;
      }, 0)
      setTimeout(function() {
         // console.log(results);
         // results.should.be.lengthOf(2);
         // should.equal(results[0], 1);
         // should.equal(results[1], 2);
         done();
      }, 10);
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
         results.should.be.lengthOf(4);
         should.equal(results[0], 1);
         should.equal(results[1], 1);
         should.equal(results[2], 2);
         should.equal(results[3], 2);
         done();
      }, 5);
   });

   it('Should be okay with a single object and a single value', function(done) {
      var obj = {};
      obj.a = {
         b: {
            c: 100
         }
      }
      var results = [];

      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });

      setTimeout(function() {

         results.should.be.lengthOf(1);
         should.equal(results[0], 100);

         done();
      }, 0);
   });

   it('Partially destroying an object (1 watcher) (in the middle, breaking the chain)', function(done) {
      var obj = {};
      obj.a = {
         b: {
            c: 100
         }
      }
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
         should.equal(results[0], 100);
         should.equal(results[1], undefined);
         should.equal(results[2], 5);
         done();
      }, 10);
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
         }, 5)
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
      }, 10);
   });

   it('Should not break when having deep nested object and several in between', function(done) {
      var obj = {};
      var results = [];
      watch(obj, 'a.b.c.d.e', function(value) {
         results.push(value);
      });
      watch(obj, 'a.b.c', function(value) {
         results.push(value);
      });
      watch(obj, 'a', function(value) {
         results.push(value);
      });

      obj.a = {
         b: {
            c: {
               d: {
                  e: 100
               }
            }
         }
      }

      setTimeout(function() {

         results.should.be.lengthOf(3);
         results[0].should.equal(100);
         results[1].d.should.be.ok;
         results[2].b.should.be.ok;

         done();
      }, 0)
   })


});
