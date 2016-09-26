"use strict";
var should = require('should');
var watch = require(__dirname + "/../src/async-watch.js").AsyncWatch;

describe('It should give old values', function() {
    it('SHould properly handle old value (simple case)', function(done) {
        let obj = {
            a: 0
        };
        obj.a++;
        let oldValue = obj.a;
        setTimeout(() => {
            obj.a++
        }, 1)
        let results = [];
        watch(obj, 'a', function(newVal, oldVal) {
            results.push(oldVal);
        });

        setTimeout(() => {
            results.should.deepEqual([undefined, 1])
        }, 2)
        done();
    });

    it('SHould properly handle old value when in a loop', function(done) {
        let obj = {
            a: 0
        };

        for (let i = 0; i <= 200; i++) {
            obj.a++;
        }

        setTimeout(() => {
            obj.a++
        }, 1)
        let results = [];
        watch(obj, 'a', function(newVal, oldVal) {
            results.push(oldVal);
        });

        setTimeout(() => {
            results.should.deepEqual([undefined, 201])
            done();
        }, 2)

    });


    it('SHould properly handle the old value when destroying an object', function(done) {
        let obj = {
            a: 0
        };
        obj.a++;
        obj.a = {
            a: 100
        }
        setTimeout(() => {
            obj.a = {
                somethingElse: -100
            }
        }, 1)
        let results = [];
        watch(obj, 'a', function(newVal, oldVal) {
            results.push(oldVal);
        });

        setTimeout(() => {
            results.should.deepEqual([undefined, 100])
            done();
        }, 2);
    });

    it('SHould properly handle the old value when destroying an object and assiging a different type', function(done) {
        let obj = {
            a: 0
        };
        obj.a++;
        obj.a = 1
        setTimeout(() => {
            obj.a = 2
        }, 1)
        let results = [];
        watch(obj, 'a', function(newVal, oldVal) {
            results.push(oldVal);
        });

        setTimeout(() => {
            results.should.deepEqual([undefined, 1])
            done();
        }, 2)

    });


       
});
