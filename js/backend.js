'use strict';

(function () {
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.const.StatusCode.OK) {
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

    xhr.timeout = window.const.TIMEOUT_IN_MS;

    xhr.open('GET', window.const.Url.GET);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.const.StatusCode.OK) {
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

    xhr.timeout = window.const.TIMEOUT_IN_MS;

    xhr.open('POST', window.const.Url.POST);
    xhr.send(data);
  };


  window.backend = {
    load: load,
    save: save,
  };

})();
