var should = require('should');
var AsyncWatchArray = require(__dirname + "/../src/async-watch.js").AsyncWatchArray;

describe('Arrays', function(done) {
   it('Should handle instant watch', function(done) {
      let boo = {
         a: `a`,
         list: [1, 2, 3]
      }
      var results = [];
      AsyncWatchArray(boo, `list`, (newVal, events) => {
         results.push(events[0].name);
      }, true);
      boo.list.splice(0, 1);
      setTimeout(() => {
         results.should.deepEqual(["init", "splice"])
         done();
      }, 1)
   });

});
