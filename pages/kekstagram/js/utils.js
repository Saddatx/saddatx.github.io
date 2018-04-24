'use strict';

(function () {
  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  window.utils = {
    isEscEvent: function (evt) {
      return evt.keyCode === KeyCode.ESC;
    },
    isEnterEvent: function (evt) {
      return evt.keyCode === KeyCode.ENTER;
    }
  };
})();
