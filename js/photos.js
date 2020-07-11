'use strict';

(function () {
  // gets a block for inserting photos
  var photo = document.querySelector('.pictures');

  // gets a photo template
  var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  // creates a photo
  var createPin = function (image) {
    var imageElement = photoTemplate.cloneNode(true);
    imageElement.querySelector('.picture__img').src = image.url;
    imageElement.querySelector('.picture__likes').textContent = image.likes;
    imageElement.querySelector('.picture__comments').textContent = image.comments.length;
    return imageElement;
  };

  // renders photos on the page
  var renderPhotos = function (images) {
    var fragment = document.createDocumentFragment();
    images.forEach(function (itemImage, indexImages) {
      fragment.appendChild(createPin(itemImage, indexImages));
    });
    photo.appendChild(fragment);
  };


  window.photo = {
    renderPhotos: renderPhotos,
  };

})();
