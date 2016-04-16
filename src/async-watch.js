(function(isNode, Exports) {
   if (isNode) {
      Exports = module.exports;
   }
   var nextTick = isNode ? process.nextTick : Exports.requestAnimationFrame;

   function getPropertyValue(obj, path) {
      if (path.length === 0 || obj === undefined) {
         return undefined;
      }
      path = path instanceof Array ? path : path.split('\.');
      for (var i = 0; i < path.length; i++) {
         obj = obj[path[i]];
         if (obj === undefined) {
            return undefined;
         }
      }
      return obj;
   }

   function setHiddenProperty(obj, key, value) {
      Object.defineProperty(obj, key, {
         enumerable: false,
         value: value
      });
      return obj;
   }

   var TaskPool = {
      jobs: {},
      scheduled: false,
      add: function(k, cb, $scope) {
         var self = this;
         //console.log("JOB ADDED", k);

         self.jobs[k] = $scope ? cb.bind($scope) : cb;
         if (self.scheduled === false) {
            self.scheduled = true;
            nextTick(function() {
               self.scheduled = false;
               //console.log("@@@ EXEC >>>>>")
               for (var i in self.jobs) {
                  if (self.jobs.hasOwnProperty(i)) {
                     //console.log("\t * " + i);
                     self.jobs[i]();
                     delete self.jobs[i];
                  }
               }
            });
         }
      }
   }

   var idCounter = 0;
   var AsyncWatch = function(self, userPath, callback, preventInitial) {
      if (typeof self !== 'object' || typeof callback !== 'function') {
         return;
      }
      var original;
      var originStringUserPath = userPath;
      if (userPath instanceof Array) {
         original = userPath;
         originStringUserPath = userPath.join(".");
      } else {
         if (typeof userPath === "string") {
            original = userPath.split('\.')
         } else {
            return;
         }
      }
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
                     var descendantCallback = $prop.$descendants[descendantKey].callbacks[i];
                     var job_id = $id + descendantKey + i;

                     TaskPool.add(job_id, function() {
                        this.cb(getPropertyValue(value, this.key), oldValue);
                     }, {
                        key: descendantKey,
                        cb: descendantCallback
                     });
                  }
                  TaskPool.add($id + descendantKey, function() {
                     this.$prop.$descendants[this.descendantKey].bindWatcher();
                  }, {
                     $prop: $prop,
                     descendantKey: descendantKey
                  });
               }
            }
            if ($isSingleProperty) {
               // Trigger $self watchers
               TaskPool.add($id + root, function() {
                  for (var i = 0; i < this.$prop.$self.length; i++) {
                     if (this.$prop.$self.hasOwnProperty(i)) {
                        this.$prop.$self[i](value, oldValue);
                     }
                  }
               }, {
                  $prop: $prop
               });
            }
         }
      }

      // If we are watching explicitly for the root variable
      if ($isSingleProperty) {
         $prop.$self.push(callback);
         if (!preventInitial) {
            callback(self[root]);
         }
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
                           $prop.$descendants[descendantsPath].callbacks[i](value, oldValue);
                        }
                     }, true); // We don't want to call another callback here
                  }
               }
            }
            $prop.$descendants[descendantsPath].bindWatcher();
         } else {
            $prop.$descendants[descendantsPath].callbacks.push(callback);
         }
         if (!preventInitial) {
            callback(getPropertyValue(self[root], descendantsArray))
         }
      }
   }
   Exports.AsyncWatch = AsyncWatch;
})(typeof module !== 'undefined' && module.exports, this);
