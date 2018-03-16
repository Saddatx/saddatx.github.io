'use strict';

(function () {
  window.debounce = function (callback, interval) {
    var lastTimeout;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, args);
      }, interval);
    };
  };
})();
