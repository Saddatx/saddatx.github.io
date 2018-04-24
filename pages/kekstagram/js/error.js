'use strict';

(function () {
  var messageContainer = document.createElement('div');
  messageContainer.classList.add('error-message');
  messageContainer.classList.add('hidden');
  document.body.appendChild(messageContainer);
  window.error = {
    show: function (message) {
      messageContainer.classList.remove('hidden');
      messageContainer.textContent = message;
    },
    hide: function () {
      messageContainer.classList.add('hidden');
    }
  };
})();
