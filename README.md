# async-watch

[![Build Status](https://travis-ci.org/wiresjs/async-watch.svg?branch=master)](https://travis-ci.org/wiresjs/async-watch)
[![IHateReact](https://badges.gitter.im/owner/repo.png)](https://gitter.im/I-Hate-React/Lobby)

AsyncWatch is a small library for watching javascript/node.js objects. It uses Object.defineProperty which makes it compatible with most browsers. Any changes happening within present tick will be called on the next available one.

![Diagramm](diagramm.png)

## Features

 * Asynchronous execution (Changes are triggered on `requestAnimationFrame` in browser and on `process.nextTick` in Node)
 * Being Asynchronous means we don’t have to worry about the execution flow, details below
 * Works in Node and Browser
 * No Dirty Checking or `Object.observe`
 * Using `Object.defineProperty()` makes it compatible with all modern browser down to IE 9
 * Order of watchers is preserved
 * Deep watch properties
 * Ability to inspect change type for Arrays (`init`,`splice`, `push`)
 * Computed Properties
 * Get old and new values in the change callback
 * Can watch any type of Object for example Watching `DOM` `Node` properties and attributes
 * Restoring watchers after objects are destroyed
 * Can be used as the back-bone to create a custom efficient two-way binding system
 * Comprehensive test coverage

## Install

    npm install async-watch --save

## Examples

```js
var AsyncWatch = require('async-watch').AsyncWatch;
var obj = {}; // creating an empty object
AsyncWatch(obj, 'a.b.c', function(value){
    console.log('set', value);
});
// You can pass an array as well
//AsyncWatch(obj, ['a', 'b', 'c'])
```

 As you can see here, we start with an empty object. AsyncWatch will set a watcher on property "a", which knows about its descendands

 ```js
  obj.a = {
   b : {
    c : 1
   }
  };
  obj.a.b.c = 2;
  obj.a.b.c = 3;
  setTimeout(function(){
     obj.a.b.c = 4;
  },0)
 ```

 The output will look like this:

 ```js
 set 3
 set 4
 ```

Callback is called on "transaction commit". Each transaction is a requestAnimationFrame tick. Surely, initial
transaction loop happens when first value is changed.

Worth mentioning: Transactions happen on demand, without "perpetual" loop or/and any other dirty checkers.

## Destroying a watcher

Destroys a watcher (does not destroy its descendants or similar watchers)
 ```js
var watcher = AsyncWatch(obj, 'a', function(value) {
});
watcher.destroy();
 ```

## Watching many objects

watchAll is not implemented yet, however subscriptions are introduced. Each watcher returns a "transaction" / watcher.

 ```js
var obj = {
   a : 1,
   b : 2
}
var watcher1 = AsyncWatch(obj, 'a', function(value) {
});
var watcher2 = AsyncWatch(obj, 'b', function(value) {
});
 ```

```js
var subscription = AsyncWatch.subscribe([watcher1, watcher2], function(changes){
   console.log(changes)
})
```
Subscribers' callback guarantees all watchers to be in sync.

Outputs:
```js
{a : 1, b: 2 }
```

Unfortunately, subscriptions won't clean up themselves, you need to do it manually.

```js
subscription.unsubscribe();
```

If you want to unsubscribe and destroy corresponding watchers:

```js
subscription.destroy();
```


## Computed properties
You can define a computed property.

```js
var obj = {
   firstName : "Bob",
   lastName : "Marley"
}

AsyncComputed(obj, 'fullName', ['firstName', 'lastName'],
	self =>`Name is ${self.firstName} ${self.lastName}`);


obj.lastName = "Foo";
obj.lastName = "Foo1";
AsyncWatch(obj, 'fullName', (value) => {
   // Name is Bob Foo1
});
```
## Watching arrays
```js
var obj = {
   users : [{name : "John"}, {name : "Bob"}]
}


AsyncWatchArray(obj, 'users', function(array,events){
   console.log(events);
});

Triggers events: "init" "push" "splice"
```


To have better understanding check these [test/sync_test.js](test/sync_test.js)
## Contribution
 Contribution is greatly appreciated! Please, run tests before submitting a pull request.  
