var should = require('should');
var AsyncWatchArray = require(__dirname + "/../src/async-watch.js").AsyncWatchArray;
var AsyncWatch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Arrays', function(done) {
   it('Should handle instant watch', function(done) {
      var boo = {
         a: `a`,
         list: [1, 2, 3]
      }
      var results = [];
      AsyncWatchArray(boo, `list`, (newVal, events) => {
        events.forEach((event)=> results.push(event.name))
      }, true);
      boo.list.splice(0, 1);
      boo.list.shift();
      setTimeout(() => {
         results.should.deepEqual(["init", "splice","shift"])
         done();
      }, 1)
   });
});
