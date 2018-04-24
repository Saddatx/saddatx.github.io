'use strict';

(function () {
  var PinValue = {
    MIN: 0,
    MAX: 100
  };

  window.effects = {
    initialize: function (effectElement, resizeCallback) {
      var effectLevel = effectElement.querySelector('.upload-effect-level');
      var effectLevelPin = effectElement.querySelector('.upload-effect-level-pin');
      var effectLevelVal = effectElement.querySelector('.upload-effect-level-val');
      var effectLevelValue = effectElement.querySelector('.upload-effect-level-value');
      var effectLevelLine = effectElement.querySelector('.upload-effect-level-line');

      var currentEffect;
      var oldEffect;

      PinValue.DEFAULT = parseInt(window.getComputedStyle(effectLevelPin).left, 10);

      effectElement.addEventListener('click', function (evt) {
        var target = evt.target;
        if (target.tagName === 'INPUT') {
          var effectName = target.value;
          oldEffect = currentEffect;
          currentEffect = 'effect-' + effectName;

          // Значения фильтра и ползунка по умолчанию
          if (currentEffect !== 'effect-none') {
            effectLevel.classList.remove('hidden');
            effectLevelPin.style.left = PinValue.DEFAULT + '%';
            effectLevelVal.style.width = effectLevelPin.style.left;
            effectLevelValue.setAttribute('value', PinValue.DEFAULT.toString());
          } else {
            effectLevel.classList.add('hidden');
          }
          resizeCallback(currentEffect, oldEffect, PinValue.DEFAULT);
        }
      });
      // Работа с ползунком
      effectLevelPin.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        var startCoord = evt.clientX;

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();

          var shift = startCoord - moveEvt.clientX;

          startCoord = moveEvt.clientX;

          var pinWidth = parseInt(window.getComputedStyle(effectLevelLine).width, 10);

          var value = (effectLevelPin.offsetLeft - shift) / pinWidth * 100;

          if (value <= PinValue.MIN) {
            effectLevelPin.style.left = PinValue.MIN + '%';
            effectLevelValue.setAttribute('value', '0');
            value = PinValue.MIN;
          } else if (value >= PinValue.MAX) {
            effectLevelPin.style.left = PinValue.MAX + '%';
            effectLevelValue.setAttribute('value', '100');
            value = PinValue.MAX;
          } else {
            effectLevelPin.style.left = (value) + '%';
            effectLevelValue.setAttribute('value', Math.round(value).toString());
          }

          effectLevelVal.style.width = effectLevelPin.style.left;
          resizeCallback(currentEffect, oldEffect, value);
        };

        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      effectLevel.classList.add('hidden');
    },
    reset: function (effectElement) {
      var effectLevel = effectElement.querySelector('.upload-effect-level');
      var effectLevelPin = effectElement.querySelector('.upload-effect-level-pin');
      var effectLevelVal = effectElement.querySelector('.upload-effect-level-val');
      var effectLevelValue = effectElement.querySelector('.upload-effect-level-value');

      effectLevelPin.style.left = PinValue.DEFAULT + '%';
      effectLevelVal.style.width = effectLevelPin.style.left;
      effectLevelValue.setAttribute('value', PinValue.DEFAULT.toString());
      effectLevel.classList.add('hidden');
    }
  };
})();
