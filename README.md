[![Build Status](https://travis-ci.org/wiresjs/async-watch.svg?branch=master)](https://travis-ci.org/wiresjs/async-watch)

# async-watch

AsyncWatch is a small library for watching javascript/node.js objects. It uses Object.defineProperty which makes it compatible with most browsers. Any changes happening within present tick will be called on the next available one.

## Features

 * Asynchronous execution (Changes are triggerd on requestAnimationFrame)
 * Nested object watching
 * Restoring watchers after objects are destroyed
 * No dirty hacks
 * Suitable for angular-like frameworks
 * Good test coverage

## Install

For browser:

    bower install async-watch --save

For Node.js projects

    npm install async-watch --save

## Examples

```js
var AsyncWatch = require('async-watch').AsyncWatch; // not needed for browsers
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

## Watching many objects

watchAll is not implemented yet, however subscriptions are introduced. Each watcher returns a "transaction" / watcher.
If you want to track the changes, watchers' callback should return an object;
 ```js
var obj = {
   a : 1,
   b : 2
}
var watcher1 = AsyncWatch(obj, 'a', function(value) {
   return {
      aValue: value
   };
});
var watcher2 = AsyncWatch(obj, 'b', function(value) {
   return {
      bValue: value
   };
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
{aValue : 1, bValue: 2 }
```

Unfortunately, subscriptions won't clean up themselves, you need to do it manually.

```js
subscription.unsubscribe();
```

To have better understanding check these [test/sync_test.js](test/sync_test.js)
## Contribution
 Contribution is greatly appreciated! Please, run tests before submitting a pull request.  
