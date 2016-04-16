[![Build Status](https://travis-ci.org/wiresjs/async-watch.svg?branch=master)](https://travis-ci.org/wiresjs/async-watch)

# async-watch

AsyncWatch is a small library for watching javascript/node.js objects. It is using Object.defineProperty which makes it compatible with most browsers. 

## Features

 * Asynchronous execution (trigges changes on animationFrame)
 * Nested object watching
 * Restoring watchers after an object is destroyed
 
## Install

For browser:

    bower install async-watch --save
    
For Node.js projects
  
    npm install async-watch --save
    
To run tests

    npm test
or:

    mocha
    
## Examples
