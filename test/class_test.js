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

         it('Should hande #2', function(done) {
            class Todo {
            }
            let todo = new Todo();
            var results = [];
            AsyncWatch(todo, `user.name`, (newVal) => {
               results.push(newVal);
            })
            setTimeout(() => {
               todo.user = {}
               todo.user.name = "Bob";
            }, 1)
            setTimeout(() => {
               todo.user.name = "Foo";
               todo.user = {};
               todo.user.name = "Marley"
            }, 2)

            setTimeout(() => {

               results.should.deepEqual([ undefined, 'Bob', 'Marley' ])
               done();
            },20)



         });

      it('Should hande ctor', function(done) {
         class Todo {
            constructor()
            {
               this.user = { name : "Test"}
            }
         }
         let todo = new Todo();
         var results = [];
         AsyncWatch(todo, `user.name`, (newVal) => {
            results.push(newVal);
         })
         setTimeout(() => {
            todo.user = {}
            todo.user.name = "Bob";
         }, 1)
         setTimeout(() => {
            todo.user.name = "Foo";
            todo.user = {};
            todo.user.name = "Marley"
         }, 2)

         setTimeout(() => {
            
            results.should.deepEqual([ 'Test', 'Bob', 'Marley' ])
            done();
         },20)
      });
});
