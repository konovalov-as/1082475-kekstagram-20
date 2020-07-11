'use strict';

(function () {
  // creates an empty array for photos
  var photos;

  // receives photos from the server
  var onLoad = function (images) {
    photos = images;
    window.photo.renderPhotos(photos);
  };

  // displays an error message
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onLoad, onError);

})();
