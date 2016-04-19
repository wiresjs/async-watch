[![Build Status](https://travis-ci.org/wiresjs/async-watch.svg?branch=master)](https://travis-ci.org/wiresjs/async-watch)
[![Documentation Status](https://readthedocs.org/projects/async-watch/badge/?version=latest)](http://async-watch.readthedocs.org/en/latest/?badge=latest)

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
var watch = require('async-watch').AsyncWatch; // not needed for browsers
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


## Contribution
 Contribution is greatly appreciated! Please, run tests before submitting a pool request.  

### Known issues
 https://github.com/wiresjs/async-watch/blob/master/test/corner_case.js#L54
