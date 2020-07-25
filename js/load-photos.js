'use strict';

(function () {
  var PHOTOS_COUNT = 10;

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
    filter(photos);
  };

  // display an error message
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onLoad, onError);

  var getRandomNumber = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
  };

  var setActiveButton = function (evt) {
    Array.from(evt.target.parentElement).forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    evt.target.classList.add('img-filters__button--active');
  };

  var setFiltersPhotos = function (evt, photos) {
    var filterPhotos = [];
    if (evt.target.matches('#filter-default')) {
      setActiveButton(evt);
      filterPhotos = photos.slice();
    }

    if (evt.target.matches('#filter-random')) {
      setActiveButton(evt);
      while (filterPhotos.length < PHOTOS_COUNT) {
        var randomNumber = getRandomNumber(0, photos.length - 1);
        if (!filterPhotos.includes(photos[randomNumber])) {
          filterPhotos.push(photos[randomNumber]);
        }
      }
    }

    if (evt.target.matches('#filter-discussed')) {
      setActiveButton(evt);
      var photosCopy = photos.slice();
      photosCopy.sort(function (first, second) {
        if (first.comments.length < second.comments.length) {
          return 1;
        }
        if (first.comments.length > second.comments.length) {
          return -1;
        }
        return 0;
      });
      filterPhotos = photosCopy;
    }

    var pictures = photoContainer.querySelectorAll('.picture');
    pictures.forEach(function (picture) {
      picture.remove();
    });

    renderPhotos(filterPhotos);
  };

  var filterContainer = document.querySelector('.img-filters');
  var filterForm = filterContainer.querySelector('.img-filters__form');

  var filter = function (photos) {
    filterContainer.classList.remove('img-filters--inactive');

    var onFilterFormClick = function (evt) {
      if (!evt.target.matches('.img-filters__button')) {
        return;
      }
      window.debounce(function () {
        setFiltersPhotos(evt, photos);
      });
    };
    filterForm.addEventListener('click', onFilterFormClick);
  };

})();
