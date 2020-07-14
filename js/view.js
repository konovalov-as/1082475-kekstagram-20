'use strict';

(function () {
  // gets a big photo block
  var bigPhotoBlock = document.querySelector('.big-picture');
  // gets a body tag
  var body = document.querySelector('body');

  var createComment = function (comment, commentsBlock) {
    var commentTemplate = commentsBlock.querySelector('.social__comment').cloneNode(true);
    commentTemplate.querySelector('.social__picture').src = comment.avatar;
    commentTemplate.querySelector('.social__picture').alt = comment.name;
    commentTemplate.querySelector('.social__text').textContent = comment.message;
    return commentTemplate;
  };

  var renderComments = function (comments, commentsBlock) {
    var fragment = document.createDocumentFragment();
    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment, commentsBlock));
    });
    // cleans a container for comments
    commentsBlock.textContent = '';
    // inserts comments into a container
    commentsBlock.appendChild(fragment);
  };

  // creates a big photo
  var createView = function (photo) {
    var photoElement = bigPhotoBlock.cloneNode(true);
    photoElement.classList.remove('hidden');

    photoElement.querySelector('.big-picture__img img').src = photo.url;
    photoElement.querySelector('.likes-count').textContent = photo.likes;
    photoElement.querySelector('.comments-count').textContent = photo.comments.length;
    photoElement.querySelector('.social__caption').textContent = photo.description;

    var commentsBlock = photoElement.querySelector('.social__comments');
    renderComments(photo.comments, commentsBlock);

    return photoElement;
  };

  // displays a big photo
  var renderView = function (photo) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createView(photo));

    bigPhotoBlock.parentNode.appendChild(fragment);
    bigPhotoBlock.remove();

    body.classList.add('modal-open');
  };

  // creates a photos block handler
  var onPhotoBlockClick = function (evt, photos) {
    if (evt.target && evt.target.matches('.picture') || evt.target.matches('.picture__img')) {
      renderView(photos[0]);
    }
  };


  window.view = {
    onPhotoBlockClick: onPhotoBlockClick,
  };


})();
