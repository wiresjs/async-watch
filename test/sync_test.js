var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch

describe('Sync test', function() {

   it("Should give an automatic output", function(done) {
      var results = [];
      var obj = {
         user: {
            name: "John",
            age: 1,
            phone: "my phone"
         }
      }
      var thread1 = watch(obj, 'user.name', function(value) {});
      var thread2 = watch(obj, 'user.age', function(value) {});
      watch.subscribe([thread1, thread2], function(changes) {
         results.push(changes);
      });
      setTimeout(function() {
         results.should.deepEqual([{
            'user.name': 'John',
            'user.age': 1
         }]);
         done();
      }, 1)

   });
   it("Should sync 2 objects callback", function(done) {
      var results = [];
      var obj = {
         user: {
            name: "John",
            age: 1,
            phone: "my phone"
         }
      }
      obj.user.age = 2;
      obj.user.age = 3;
      obj.user.age = 4;
      obj.user = {
         name: "John1",
         age: 100,
         phone: "my phone1"
      }

      var thread1 = watch(obj, 'user.name', function(value) {});
      var thread2 = watch(obj, 'user.age', function(value) {});
      watch.subscribe([thread1, thread2], function(changes) {
         results.push(changes);
      });

      setTimeout(function() {
         obj.user.age = 3;
         obj.user.age = 4;
         obj.user.age = 5;
      }, 0)

      setTimeout(function() {

         results.should.deepEqual([{
            'user.name': 'John1',
            'user.age': 100
         }, {
            'user.age': 5
         }])
         done();
      }, 2)

   });

   it("Should unsubscribe", function(done) {
      var results = [];
      var obj = {
         a: 1
      }
      var thread = watch(obj, 'a', function(value) {
         return {
            a: value
         };
      });
      var subscription = watch.subscribe([thread], function(changes) {
         results.push(changes);
      });

      setTimeout(function() {
         obj.a = 2;
      }, 1);
      setTimeout(function() {
         subscription.unsubscribe();
         obj.a = 3;
      }, 2);

      setTimeout(function() {
         results.should.deepEqual([{
            a: 1
         }, {
            a: 2
         }]);
         done();
      }, 10)
   });

   it("Should unsubscribe and destroy defined watchers", function(done) {
      var results = [];
      var obj = {
         a: 1
      }
      var watcherResults = [];
      var watcher = watch(obj, 'a', function(value) {
         watcherResults.push(value);
      });
      var subscription = watch.subscribe([watcher], function(changes) {
         results.push(changes);
      });

      setTimeout(function() {
         obj.a = 2;
      }, 1);
      setTimeout(function() {
         subscription.destroy();
         obj.a = 3;
      }, 2);

      setTimeout(function() {
         results.should.deepEqual([{
            a: 1
         }, {
            a: 2
         }]);
         watcherResults.should.deepEqual([1, 2]);
         done();
      }, 10)
   });

})
