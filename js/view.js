'use strict';

(function () {
  var HIDDEN_CLASS = 'hidden';
  var OPEN_MODAL = 'modal-open';

  // get a big photo container
  var bigPhotoContainer = document.querySelector('.big-picture');
  // get a body tag
  var body = document.querySelector('body');
  // get a main tag
  var mainContainer = document.querySelector('main');

  var createComment = function (comment, commentsContainer) {
    var commentTemplate = commentsContainer.querySelector('.social__comment').cloneNode(true);
    commentTemplate.querySelector('.social__picture').src = comment.avatar;
    commentTemplate.querySelector('.social__picture').alt = comment.name;
    commentTemplate.querySelector('.social__text').textContent = comment.message;
    return commentTemplate;
  };

  var renderComments = function (comments, commentsContainer) {
    var fragment = document.createDocumentFragment();
    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment, commentsContainer));
    });
    // clean a container for comments
    commentsContainer.textContent = '';
    // insert comments into a container
    commentsContainer.appendChild(fragment);
  };

  // create a big photo
  var createView = function (photo) {
    var photoElement = bigPhotoContainer.cloneNode(true);
    photoElement.classList.remove(HIDDEN_CLASS);

    photoElement.querySelector('.big-picture__img img').src = photo.url;
    photoElement.querySelector('.likes-count').textContent = photo.likes;
    photoElement.querySelector('.comments-count').textContent = photo.comments.length;
    photoElement.querySelector('.social__caption').textContent = photo.description;

    var commentsContainer = photoElement.querySelector('.social__comments');
    renderComments(photo.comments, commentsContainer);

    // a big photo close callback by a click
    var onCloseButtonClick = function () {
      photoElement.classList.add(HIDDEN_CLASS);
      body.classList.remove(OPEN_MODAL);
      document.removeEventListener('keydown', onDocumentPress);
    };

    var closeButton = photoElement.querySelector('.big-picture__cancel');
    closeButton.addEventListener('click', onCloseButtonClick);

    // a big photo close callback by an Esc key
    var onDocumentPress = function (evt) {
      if (!(evt.key === window.const.Key.ESCAPE)) {
        return;
      }
      onCloseButtonClick();
    };
    document.addEventListener('keydown', onDocumentPress);

    return photoElement;
  };

  // display a big photo
  var renderView = function (photo) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createView(photo));

    mainContainer.appendChild(fragment);
    bigPhotoContainer.remove();

    body.classList.add(OPEN_MODAL);
  };

  // create a photos block handler
  var onPhotoContainerClick = function (evt, photos) {
    if (!(evt.target && evt.target.matches('.picture') || evt.target.matches('.picture__img'))) {
      return;
    }

    // get a photo
    var picture = photos.find(function (photo) {
      return photo.url === evt.target.attributes.src.value;
    });

    // render a photo
    renderView(picture);
  };


  window.view = {
    onPhotoContainerClick: onPhotoContainerClick,
  };

})();
