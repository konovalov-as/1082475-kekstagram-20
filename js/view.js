'use strict';

(function () {
  var OPEN_MODAL = 'modal-open';

  // get a big photo container
  var bigPhotoContainer = document.querySelector('.big-picture');
  // get a body tag
  var body = document.querySelector('body');

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
    photoElement.classList.remove('hidden');

    photoElement.querySelector('.big-picture__img img').src = photo.url;
    photoElement.querySelector('.likes-count').textContent = photo.likes;
    photoElement.querySelector('.comments-count').textContent = photo.comments.length;
    photoElement.querySelector('.social__caption').textContent = photo.description;

    var commentsContainer = photoElement.querySelector('.social__comments');
    renderComments(photo.comments, commentsContainer);

    return photoElement;
  };

  // display a big photo
  var renderView = function (photo) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createView(photo));

    bigPhotoContainer.parentNode.appendChild(fragment);
    bigPhotoContainer.remove();

    body.classList.add(OPEN_MODAL);
  };

  // create a photos block handler
  var onPhotoContainerClick = function (evt, photos) {
    if (evt.target && evt.target.matches('.picture') || evt.target.matches('.picture__img')) {
      renderView(photos[0]);
    }
  };


  window.view = {
    onPhotoContainerClick: onPhotoContainerClick,
  };

})();
