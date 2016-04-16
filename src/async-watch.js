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

   var nextFrame = {
      jobs: {},
      scheduled: false,
      register: function(k, cb) {
         var self = this;
         //console.log("JOB ADDED", k);
         self.jobs[k] = cb;
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
                  for (var i = 0; i < $prop.$descendants[descendantKey].length; i++) {
                     var descendant = $prop.$descendants[descendantKey][i];
                     descendant.callback(getPropertyValue(value, descendantKey), oldValue)
                     var job_id = $id + descendantKey;

                     // register a binder (an object was destroyed)
                     // Postpone the binding (cuz at this moment object is undefined)
                     nextFrame.register(job_id, function() {
                        descendant.bindWatcher();
                     });
                  }
               }
            }
            if ($isSingleProperty) {
               // Trigger $self watchers
               var job_id = $id + root;
               nextFrame.register(job_id, function() {
                  for (var i = 0; i < $prop.$self.length; i++) {
                     if ($prop.$self.hasOwnProperty(i)) {
                        $prop.$self[i](value, oldValue);
                     }
                  }
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
            $prop.$descendants[descendantsPath] = [];
         }
         // myDescendant
         // If initial request is a.b.c.d
         // myDescendant is b.c.d
         var myDescendant = {
            callback: callback,
            bindWatcher: function() {
               // The actual watcher that is need for us
               if (self.hasOwnProperty(root) && self[root] !== undefined) {
                  // we want NEW data only here.
                  // Initial callback has been triggered
                  AsyncWatch(self[root], descendantsArray, function(value, oldValue) {
                     for (var i = 0; i < $prop.$descendants[descendantsPath].length; i++) {
                        $prop.$descendants[descendantsPath][i].callback(value, oldValue);
                     }
                  }, true); // We don't want to call another callback here
               }

            }
         }
         $prop.$descendants[descendantsPath].push(myDescendant);
         if (!preventInitial) {
            myDescendant.callback(getPropertyValue(self[root], descendantsArray))
         }
         myDescendant.bindWatcher();
      }
   }
   Exports.AsyncWatch = AsyncWatch;
})(typeof module !== 'undefined' && module.exports, this);
