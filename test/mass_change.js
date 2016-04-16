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
      for (var i = 0; i < 1000; i++) {
         obj.a++;
      }
      setTimeout(function() {
         results.should.be.lengthOf(2);
         results[0].should.equal(0);
         results[1].should.equal(1000);
         done();
      }, 1);
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
      for (var i = 0; i < 5; i++) {
         if (i % 2) {
            obj.a = {}
         }
         obj.a.b++;
      }
      setTimeout(function() {

         done();
      }, 1);
   });

});
