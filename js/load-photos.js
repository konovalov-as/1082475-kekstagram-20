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
    photos.forEach(function (photo, index) {
      fragment.appendChild(createPhoto(photo, index));
    });
    photoContainer.appendChild(fragment);
  };

  // get photos from the server
  var onLoad = function (photos) {
    renderPhotos(photos);
    photoContainer.addEventListener('click', function (evt) {
      window.view.openPhoto(evt, photos);
    });
    filter(photos);
  };

  // get a container to insert a popup
  var mainContainer = document.querySelector('main');

  // get a error popup template
  var errorPopupTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  // send an ad to the server
  var closePopupByKey = function (evt, popup) {
    if (!evt.key === window.const.Key.ESCAPE) {
      return;
    }
    if (popup) {
      popup.remove();
    }
  };

  var renderPopup = function (popup, errorMessage) {
    var popupElement = popup.cloneNode(true);
    popupElement.querySelector('.error__title').textContent = errorMessage;
    popupElement.querySelector('.error__button').textContent = 'Попробовать снова';
    popupElement.addEventListener('click', function () {
      window.backend.load(onLoad, onError);
    });
    mainContainer.appendChild(popupElement);
  };

  // display an error message
  var onError = function (errorMessage) {
    renderPopup(errorPopupTemplate, errorMessage);

    // close a popup by a click
    var errorContainer = mainContainer.querySelector('.error');

    // close a popup by a click
    errorContainer.addEventListener('click', function (evt) {
      if (!(evt.target.matches('.error') || evt.target.matches('.error__button'))) {
        return;
      }
      errorContainer.remove();
      document.removeEventListener('keydown', onErrorPopupPress);
    });

    // close a popup by an Esc key
    var onErrorPopupPress = function (evt) {
      closePopupByKey(evt, errorContainer);
      document.removeEventListener('keydown', onErrorPopupPress);
    };

    // error popup close handler
    document.addEventListener('keydown', onErrorPopupPress);
  };

  window.backend.load(onLoad, onError);

  var setActiveButton = function (target) {
    Array.from(target.parentElement).forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    target.classList.add('img-filters__button--active');
  };

  var setFiltersPhotos = function (target, photos) {
    var filterPhotos = [];
    if (target.matches('#filter-default')) {
      setActiveButton(target);
      filterPhotos = photos.slice();
    }

    if (target.matches('#filter-random')) {
      setActiveButton(target);
      while (filterPhotos.length < PHOTOS_COUNT) {
        var randomNumber = window.util.getRandomNumber(0, photos.length - 1);
        if (!filterPhotos.includes(photos[randomNumber])) {
          filterPhotos.push(photos[randomNumber]);
        }
      }
    }

    if (target.matches('#filter-discussed')) {
      setActiveButton(target);
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
        setFiltersPhotos(evt.target, photos);
      });
    };
    filterForm.addEventListener('click', onFilterFormClick);
  };

})();
