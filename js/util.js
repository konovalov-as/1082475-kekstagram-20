'use strict';

(function () {
  var getRandomNumber = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
  };

  var isEscape = function (evt) {
    if (evt.key === window.const.Key.ESCAPE) {
      window.savePhoto.resetForm();
    }
  };


  window.util = {
    getRandomNumber: getRandomNumber,
    isEscape: isEscape,
  };

})();
