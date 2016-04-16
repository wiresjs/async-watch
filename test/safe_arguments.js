var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('Argument safety test', function() {
   it("Should be fine without an object", function() {
      watch();
   });
   it("Should be fine without a callback", function() {
      var a = {};
      watch(a, '');
   });
   it("Should be fine without an object but with path and callback", function() {
      var a = {};
      watch(undefined, '', function() {

      });
   });

   it("Should be fine with not object", function() {
      var a = {};
      watch(1, '1.1.1', function() {

      });
   });

   it("Should be fine with proper object but wrong path", function() {
      var a = {};
      watch(a, {}, function() {

      });
   });
})
