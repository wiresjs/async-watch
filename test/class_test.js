"use strict";
var should = require('should');
var AsyncWatch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Class test', function() {
   it('SHould properly watch class properties', function(done) {

      class Foo {

      }

      let foo = new Foo();
      foo.bar = "wop"
      let results = [];
      var watcher1 = AsyncWatch(foo, `bar`, function(v) {
         results.push(v);
      })
      setTimeout(() => {
         foo.bar = "coo"
      }, 1)

      setTimeout(() => {
         results.should.deepEqual(['wop', 'coo'])
         done();
      }, 30)
   });

});
