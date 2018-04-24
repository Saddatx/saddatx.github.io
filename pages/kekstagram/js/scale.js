'use strict';

(function () {
  var ResizeOption = {
    MIN: 25,
    MAX: 100,
    STEP: 25,
    DEFAULT: 100
  };

  var calculateScale = function (controlsValue, valueDirection) {
    var currentValue = parseInt(controlsValue.getAttribute('value'), 10);
    var newResizeValue = currentValue + (ResizeOption.STEP * valueDirection);

    if (newResizeValue >= ResizeOption.MIN && newResizeValue <= ResizeOption.MAX) {
      controlsValue.setAttribute('value', newResizeValue + '%');
      return newResizeValue;
    }
    return currentValue;
  };

  window.scale = {
    initialize: function (scaleElement, resizeCallback) {
      var controlsValue = scaleElement.querySelector('.upload-resize-controls-value');
      var controlInc = scaleElement.querySelector('.upload-resize-controls-button-inc');
      var controlDec = scaleElement.querySelector('.upload-resize-controls-button-dec');

      controlsValue.setAttribute('value', ResizeOption.DEFAULT + '%');

      controlInc.addEventListener('click', function () {
        resizeCallback(calculateScale(controlsValue, 1));
      });
      controlDec.addEventListener('click', function () {
        resizeCallback(calculateScale(controlsValue, -1));
      });
    },
    reset: function (scaleElement, resizeCallback) {
      var controlsValue = scaleElement.querySelector('.upload-resize-controls-value');
      controlsValue.setAttribute('value', ResizeOption.DEFAULT + '%');
      resizeCallback(ResizeOption.DEFAULT);
    }
  };
})();
