'use strict';

(function () {
  // get a container for inserting photos
  var photoContainer = document.querySelector('.pictures');

  // get a photo template
  var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  // create a photo
  var createPhoto = function (image) {
    var imageElement = photoTemplate.cloneNode(true);
    imageElement.querySelector('.picture__img').src = image.url;
    imageElement.querySelector('.picture__likes').textContent = image.likes;
    imageElement.querySelector('.picture__comments').textContent = image.comments.length;
    return imageElement;
  };

  // render photos on the page
  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo, indexPhoto) {
      fragment.appendChild(createPhoto(photo, indexPhoto));
    });
    photoContainer.appendChild(fragment);
  };

  // get photos from the server
  var onLoad = function (photos) {
    renderPhotos(photos);
    photoContainer.addEventListener('click', function (evt) {
      window.view.onPhotoContainerClick(evt, photos);
    });
  };

  // display an error message
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onLoad, onError);

})();
