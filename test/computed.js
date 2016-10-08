var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js");
var AsyncComputed = watch.AsyncComputed;
var AsyncWatch = watch.AsyncWatch;

describe('Computed test', function(done) {

   it("should define computed property", function(done) {
      var obj = {
         firstName : "Bob",
         lastName : "Marley"
      }
      
      var results = [];
      AsyncComputed(obj, 'fullName', ['firstName', 'lastName'],
         self => `Name is ${self.firstName} ${self.lastName}`);

      obj.lastName = "Foo";
      obj.lastName = "Foo1";
      AsyncWatch(obj, 'fullName', (value) => {
         results.push(value);
      });
      setTimeout(function(){
         results.should.deepEqual([ undefined, 'Name is Bob Foo1' ]);
         done();
      },2)
   });
})
