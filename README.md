[![Build Status](https://travis-ci.org/wiresjs/async-watch.svg?branch=master)](https://travis-ci.org/wiresjs/async-watch)

# async-watch

AsyncWatch is a small library for watching javascript/node.js objects. It is using Object.defineProperty which makes it compatible with most browsers. 

## Features

 * Asynchronous execution (trigges changes on animationFrame)
 * Nested object watching
 * Restoring watchers after an object is destroyed
 * No dirty watchers
 * Suitable for angular-like frameworks
 
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
 ```
 
 The output will look like this:
 ```
 set undefined
 set 3
 ```
 First set happens when AsyncWatch is initialized, after that the program waits for next available frame to trigger changes.
 
 
