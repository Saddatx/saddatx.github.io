'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/kekstagram';
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    }
  };
})();
