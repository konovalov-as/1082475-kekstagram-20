'use strict';

(function () {
  var MAX_COMMENTS_COUNT = 5;
  var HIDDEN_CLASS = 'hidden';

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

  var showComments = function (commentsContainer, photoElement) {
    var showedComments = MAX_COMMENTS_COUNT;
    var allComments = commentsContainer.children;
    var commentsLoadBtn = photoElement.querySelector('.comments-loader');
    var commentsCount = photoElement.querySelector('.comments-showed');

    var getNextComments = function () {
      for (var i = 0; i < allComments.length; i++) {
        if (i < showedComments) {
          allComments[i].classList.remove(HIDDEN_CLASS);
          continue;
        }
        allComments[i].classList.add(HIDDEN_CLASS);
      }
      commentsCount.textContent = showedComments;
    };

    if (allComments.length < MAX_COMMENTS_COUNT) {
      commentsLoadBtn.classList.add(HIDDEN_CLASS);
      commentsCount.textContent = allComments.length;
    } else {
      commentsLoadBtn.classList.remove(HIDDEN_CLASS);
      getNextComments();
    }

    commentsLoadBtn.addEventListener('click', function () {
      showedComments += MAX_COMMENTS_COUNT;

      if (showedComments < allComments.length) {
        commentsLoadBtn.classList.remove(HIDDEN_CLASS);
      } else {
        commentsLoadBtn.classList.add(HIDDEN_CLASS);
        showedComments = allComments.length;
      }
      getNextComments();
    });
  };


  window.comments = {
    render: renderComments,
    show: showComments,
  };

})();
