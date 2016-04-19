var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('It should behave accordingly when having lots of data', function() {
   it('SHould give the latest changed value', function(done) {
      var obj = {
         a: 0
      };
      var results = [];
      watch(obj, 'a', function(value) {

         results.push(value);
      });

      for (var i = 0; i < 100; i++) {
         obj.a++;
      }
      setTimeout(function() {
         results.should.be.lengthOf(1);
         results[0].should.equal(100);
         done();
      }, 0);
   });

   it('SHould give the latest changed value (in a loop breaking objects)', function(done) {
      var obj = {
         a: {
            b: 0
         }
      };
      var results = [];
      watch(obj, 'a.b', function(value) {
         results.push(value);
      });

      obj.a = {
         b: 1
      }
      obj.a.b++;

      setTimeout(function() {

         results.should.be.lengthOf(1)
         results[0].should.equal(2)
         done();
      }, 20);
   });

   it("should not break", function(done) {
      var obj1 = {}
      var obj2 = {};

      var results = [];
      watch(obj1, 'a.b', function(value) {
         results.push(value);
      });
      watch(obj2, 'a.b', function(value) {
         results.push(value);
      });
      for (var i = 0; i <= 5; i++) {
         if (!obj1.a) {
            obj1.a = {
               b: 0
            }
         }
         if (!obj2.a) {
            obj2.a = {
               b: 0
            }
         }
         obj1.a.b++;
         obj2.a.b++;
      }
      setTimeout(function() {
         results.should.be.lengthOf(2)
         results[0].should.equal(6)
         results[1].should.equal(6)
         done();
      }, 0)
   });

});
