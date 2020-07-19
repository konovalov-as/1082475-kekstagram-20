'use strict';

(function () {
  var RESPONSE_TYPE = 'json';
  var TIMEOUT_IN_MS = 5000;

  var Url = {
    POST: 'https://javascript.pages.academy/kekstagram',
    GET: 'https://javascript.pages.academy/kekstagram/data',
  };
  var StatusCode = {
    OK: 200
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
        return;
      }
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);

    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Данные не получены за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', Url.GET);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
        return;
      }
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Данные не отправлены за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('POST', Url.POST);
    xhr.send(data);
  };


  window.backend = {
    load: load,
    save: save,
  };

})();
