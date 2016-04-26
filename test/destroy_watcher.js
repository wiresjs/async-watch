var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch

describe('destroy test', function() {

   it("Should destroy a simple watcher", function(done) {
      var results = [];
      var obj = {
         age: 1
      }
      var results = [];
      var watcher1 = watch(obj, 'age', function(value) {
         results.push(value);

      });
      setTimeout(function() {
         obj.age = 2
         watcher1.destroy();
      }, 1)
      setTimeout(function() {
         obj.age = 3;
      }, 2)

      setTimeout(function() {
         results.should.deepEqual([1, 2])
         done();
      }, 10)

   });
   it("Should destroy a nested watcher", function(done) {
      var results = [];
      var obj = {
         age: 1,
         user: {
            age: 100
         }
      }
      var results = [];
      var watcher1 = watch(obj, 'user.age', function(value) {
         results.push(value);

      });
      setTimeout(function() {
         obj.user.age = 200
         watcher1.destroy();
      }, 1)
      setTimeout(function() {
         obj.age = 300
      }, 2)

      setTimeout(function() {
         results.should.deepEqual([100, 200])
         done();
      }, 10)

   });
})
