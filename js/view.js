'use strict';

(function () {
  var HIDDEN_CLASS = 'hidden';
  var OPENED_POPUP_CLASS = 'modal-open';

  // get a big photo container
  var bigPhotoContainer = document.querySelector('.big-picture');
  // get a body tag
  var indexBody = document.querySelector('body');
  // get a main tag
  var mainContainer = document.querySelector('main');

  // create a big photo
  var createView = function (photo) {
    var photoElement = bigPhotoContainer.cloneNode(true);
    photoElement.classList.remove(HIDDEN_CLASS);

    photoElement.querySelector('.big-picture__img img').src = photo.url;
    photoElement.querySelector('.likes-count').textContent = photo.likes;
    photoElement.querySelector('.comments-count').textContent = photo.comments.length;
    photoElement.querySelector('.social__caption').textContent = photo.description;

    var commentsContainer = photoElement.querySelector('.social__comments');
    window.comments.render(photo.comments, commentsContainer);
    window.comments.show(commentsContainer, photoElement);

    var closeBigPhoto = function () {
      photoElement.classList.add(HIDDEN_CLASS);
      indexBody.classList.remove(OPENED_POPUP_CLASS);
      document.removeEventListener('keydown', onPhotoPopupPress);
    };

    // a big photo close callback by a click
    var onCloseButtonClick = function () {
      closeBigPhoto();
    };

    var closeButton = photoElement.querySelector('.big-picture__cancel');
    closeButton.addEventListener('click', onCloseButtonClick);

    // a big photo close callback by an Esc key
    var onPhotoPopupPress = function (evt) {
      if (!(evt.key === window.const.Key.ESCAPE)) {
        return;
      }
      closeBigPhoto();
    };
    document.addEventListener('keydown', onPhotoPopupPress);

    photoElement.addEventListener('click', function (evt) {
      if (!evt.target.matches('.overlay')) {
        return;
      }
      closeBigPhoto();
    });
    return photoElement;
  };

  // display a big photo
  var renderView = function (photo) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createView(photo));

    mainContainer.appendChild(fragment);
    bigPhotoContainer.remove();

    indexBody.classList.add(OPENED_POPUP_CLASS);
  };

  // create a photos block handler
  var openPhoto = function (evt, photos) {
    if (!(evt.target && evt.target.matches('.picture') || evt.target.matches('.picture__img'))) {
      return;
    }

    // get a photo
    var picture = photos.find(function (photo) {
      return photo.url === evt.target.closest('.picture').children[0].attributes.src.value;
    });

    // render a photo
    renderView(picture);
  };


  window.view = {
    openPhoto: openPhoto,
  };

})();
