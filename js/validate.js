'use strict';

(function () {
  var REGULAR_EXPRESSION = /[^A-Za-z0-9А-Яа-я]/;
  var hashtagsInput = document.querySelector('.text__hashtags');
  var commentText = document.querySelector('.text__description');

  // validate hashtags
  var checkHashtags = function () {
    var hashtags = (hashtagsInput.value.trim()).split(' ');

    // collect unique hashtags
    var uniqueHashtags = [];
    var isOneHashtags = function (hashtag) {
      var hashtagLowerCase = hashtag.toLowerCase();
      var isOne = false;
      if (uniqueHashtags.indexOf(hashtagLowerCase) !== -1) {
        isOne = true;
      }
      uniqueHashtags.push(hashtagLowerCase);
      return isOne;
    };

    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      if (hashtag === '') {
        return;
      }
      if (hashtag[0] !== '#') {
        hashtagsInput.setCustomValidity(i + 1 + '-ый хэш-тег (' + hashtag + ') должен начинаться с символа # (решётка)');
        return;
      }
      if (hashtag.slice(-1) === ',') {
        hashtagsInput.setCustomValidity('Хэш-теги разделяются пробелами');
        return;
      }
      if (REGULAR_EXPRESSION.test(hashtag.replace('#', ''))) {
        hashtagsInput.setCustomValidity('Строка после символа # (решётка) должна состоять только из букв и чисел. Пробелы, эмодзи, спецсимволы (#, @, $, - и т. п.) не допустимы. ' + (i + 1) + '-ый хэш-тег с ошибкой');
        return;
      }
      if (hashtag[0] === '#' && hashtag.length === 1) {
        hashtagsInput.setCustomValidity(i + 1 + '-ый хэш-тег (' + hashtag + ') не может состоять только из одной символа ' + hashtag + ' (решётка)');
        return;
      }
      if (hashtag.length > 20) {
        hashtagsInput.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
        return;
      }
      if (i > 4) {
        hashtagsInput.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
        return;
      }
      if (isOneHashtags(hashtag)) {
        hashtagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды. Хэш-теги нечувствительны к регистру. #ХэшТег и #хэштег считаются одним и тем же тегом');
        return;
      }
      hashtagsInput.setCustomValidity('');
    }
  };
  checkHashtags();

  hashtagsInput.addEventListener('invalid', function () {
    checkHashtags();
  });

  hashtagsInput.addEventListener('input', function () {
    checkHashtags();
  });

  hashtagsInput.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });

  // validate a user comment
  var maxCommentTextLength = commentText.maxLength;
  commentText.addEventListener('input', function () {
    if (commentText.validity.tooLong) {
      commentText.setCustomValidity('Пожалуйста, не меньше ' + maxCommentTextLength);
      return;
    }
  });

  commentText.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });

})();
