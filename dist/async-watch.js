(function(isNode, Exports) {
   if (isNode) {
      Exports = module.exports;
   }
   // Make is compatable with node.js
   var nextTick = isNode ? process.nextTick : Exports.requestAnimationFrame;

   var fnIdCounter = 0;
   /**
    * Postpones execution until the next frame
    * Overrides keys with the newest callback
    */
   var AsyncTransaction = {
      jobs: {},
      _signed: {},
      scheduled: false,
      __digest: function() {
         var self = this;
         if (self.scheduled === false) {
            self.scheduled = true;
            nextTick(function() {
               for (var i in self.jobs) {
                  self.jobs[i]();
                  delete self.jobs[i];
               }
               for (var i in self._signed) {
                  var task = self._signed[i];
                  task.signed.apply(null, task.target())
                  delete self._signed[i];
               }
               self.scheduled = false;
            });
         }
      },
      sign: function(signed, target) {
         if (!signed.$id) {
            signed.$id = fnIdCounter++;
         }
         if (signed.$instant) {
            return signed.apply(null, target());
         }
         this._signed[signed.$id] = {
            target: target,
            signed: signed
         }
         return this.__digest();
      },
      add: function(job_id, cb, $scope) {
         cb = $scope ? cb.bind($scope) : cb;
         this.jobs[job_id] = cb;
         return this.__digest();
      }
   }

   /**
    * dotNotation - A helper to extract dot notation
    *
    * @param  {type} path string or array
    * @return {type}      Object { path : ['a','b'], str : 'a.b'}
    */
   function dotNotation(path) {
      if (path instanceof Array) {
         return {
            path: path,
            str: path.join('.')
         }
      }
      if (typeof path !== 'string') {
         return;
      }
      return {
         path: path.split('\.'),
         str: path
      }
   }

   /**
    * getPropertyValue - get a value from an object with dot notation
    *
    * @param  {type} obj  Target object
    * @param  {type} path dot notation
    * @return {type}      Target object
    */
   function getPropertyValue(obj, path) {

      if (path.length === 0 || obj === undefined) {
         return undefined;
      }
      var notation = dotNotation(path);
      if (!notation) {
         return;
      }
      path = notation.path;
      for (var i = 0; i < path.length; i++) {
         obj = obj[path[i]];
         if (obj === undefined) {
            return undefined;
         }
      }
      return obj;
   }

   /**
    * setHiddenProperty - description
    *
    * @param  {type} obj   target object
    * @param  {type} key   property name
    * @param  {type} value default value
    * @return {type}       target object
    */
   function setHiddenProperty(obj, key, value) {
      Object.defineProperty(obj, key, {
         enumerable: false,
         value: value
      });
      return obj;
   }

   var idCounter = 0;

   /**
    *  AsyncWatch
    *  AsyncWatch is a small library for watching javascript/node.js objects.
    *  It uses Object.defineProperty which makes it compatible with most browsers.
    *
    * @param  {type} self           Terget object
    * @param  {type} userPath       dot notation
    * @param  {type} callback       User callback
    * @param  {type} preventInitial System variable to prevent initial callback
    * @return {type}
    */
   var AsyncWatch = function(self, userPath, callback, instant) {

      if (typeof self !== 'object' || typeof callback !== 'function') {
         return;
      }
      var notation = dotNotation(userPath);
      if (!notation) {
         return;
      }
      callback.$id ? callback.$id : fnIdCounter++;

      if (instant) {
         callback.$instant = true;
      }

      var original = notation.path;
      var originStringUserPath = notation.str;;
      // root (a.b.c.d -> gives a)
      var root = original[0];

      // Copy of original array
      var keys = [];
      for (var i = 0; i < original.length; i++) {
         keys.push(original[i])
      }
      // Descendants
      var descendantsArray = keys.splice(1, keys.length);
      var descendantsPath = descendantsArray.join('.');
      var $isSingleProperty = root === originStringUserPath
      var $config = self.$$p;
      var $id;

      if (!$config) {
         // Creating configration
         setHiddenProperty(self, '$$p', {});
         // Creating a service callback
         $config = self.$$p;
         setHiddenProperty($config, '$properties', {});
         setHiddenProperty($config, '$id', ++idCounter);
      }
      if ($id === undefined) {
         $id = $config.$id;
      }

      var $prop = $config.$properties[root];

      if (!$prop) {

         // $prop = setHiddenProperty($config.$properties, root, {});
         // $prop.$self = [];
         // $prop.$descendants = {};
         $prop = $config.$properties[root] = {
            $self: [],
            $descendants: {}
         }
         var current = self[root];
         Object.defineProperty(self, root, {
            get: function() {
               return current;
            },
            set: function(newValue) {
               onRootPropertySet(newValue, current);
               current = newValue;
               return current;
            }
         });

         // Triggers when a root has changed
         // Here we need to verify
         // if we have an explicit callback to fire ($self)
         // Notify descendants
         var onRootPropertySet = function(value, oldValue) {

            // Trigger Descendants
            for (var descendantKey in $prop.$descendants) {
               if ($prop.$descendants.hasOwnProperty(descendantKey)) {

                  for (var i in $prop.$descendants[descendantKey].callbacks) {
                     // Job id has to have a callback index attached
                     var job_id = $id + descendantKey + i;
                     var descendantCallback = $prop.$descendants[descendantKey].callbacks[i];

                     AsyncTransaction.sign(descendantCallback, function() {
                        return [getPropertyValue(value, descendantKey), oldValue];
                     });
                  }

                  AsyncTransaction.add($id + descendantKey, function() {
                     $prop.$descendants[this.key].bindWatcher();
                  }, {
                     key: descendantKey
                  });
               }
            }
            if ($isSingleProperty) {
               // Trigger $self watchers
               for (var i = 0; i < $prop.$self.length; i++) {
                  var _cb = $prop.$self[i];
                  AsyncTransaction.sign(_cb, function() {
                     return [value, oldValue];
                  })
               }
            }
         }
      }

      // If we are watching explicitly for the root variable
      if ($isSingleProperty) {

         // Job id has to have a callback index attached
         AsyncTransaction.sign(callback, function() {
            return [self[root]];
         });

         $prop.$self.push(callback);
      } else {
         // We need to watch descendants
         if (!$prop.$descendants[descendantsPath]) {
            $prop.$descendants[descendantsPath] = {
               callbacks: [callback],
               bindWatcher: function() {

                  if (self.hasOwnProperty(root) && self[root] !== undefined) {
                     // we want NEW data only here.
                     // Initial callback has been triggered
                     AsyncWatch(self[root], descendantsArray, function(value, oldValue) {
                        for (var i = 0; i < $prop.$descendants[descendantsPath].callbacks.length; i++) {
                           var _cb = $prop.$descendants[descendantsPath].callbacks[i];
                           AsyncTransaction.sign(_cb, function() {
                              return [value, oldValue];
                           });
                        }
                     }, true); // We don't want to call another callback here
                  }
               }
            }

            $prop.$descendants[descendantsPath].bindWatcher();
         } else {

            $prop.$descendants[descendantsPath].callbacks.push(callback);
         }
         AsyncTransaction.sign(callback, function() {
            return [getPropertyValue(self[root], descendantsArray)];
         });
      }
   }
   Exports.AsyncWatch = AsyncWatch;
   Exports.AsyncTransaction = AsyncTransaction;
})(typeof module !== 'undefined' && module.exports, this);
