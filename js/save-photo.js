'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HIDDEN_CLASS = 'hidden';
  var OPEN_MODAL = 'modal-open';
  var DEFAULT_SCALE = 100;
  var SCALE_STEP = 25;
  var REGULAR_EXPRESSION = /[^A-Za-z0-9А-Яа-я]/;

  var body = document.querySelector('body');

  var photoSavingForm = body.querySelector('.img-upload__form');
  var closeButton = photoSavingForm.querySelector('#upload-cancel');

  var imageEditingContainer = photoSavingForm.querySelector('.img-upload__overlay');
  var effectFieldset = photoSavingForm.querySelector('.effect-level');
  var previewImg = imageEditingContainer.querySelector('.img-upload__preview img');
  var previewImgDefault = previewImg.attributes.src.value;

  var slidePin = imageEditingContainer.querySelector('.effect-level__pin');
  var slideLine = imageEditingContainer.querySelector('.effect-level__line');
  var effectDepth = imageEditingContainer.querySelector('.effect-level__depth');

  var effectList = imageEditingContainer.querySelector('.effects__list');
  var effectLevelValue = imageEditingContainer.querySelector('.effect-level__value');

  var smallerButton = imageEditingContainer.querySelector('.scale__control--smaller');
  var biggerButton = imageEditingContainer.querySelector('.scale__control--bigger');
  var scaleValueInput = imageEditingContainer.querySelector('.scale__control--value');

  var fileChooser = photoSavingForm.querySelector('#upload-file');

  var hashtagsInput = photoSavingForm.querySelector('.text__hashtags');
  var commentText = photoSavingForm.querySelector('.text__description');

  // read an image selected by the user
  fileChooser.addEventListener('change', function () {
    effectFieldset.classList.add('hidden');

    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (fileType) {
      return fileName.endsWith(fileType);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        // write a new image url
        previewImg.src = reader.result;
        imageEditingContainer.classList.remove(HIDDEN_CLASS);
        body.classList.add(OPEN_MODAL);
      });

      reader.readAsDataURL(file);
    }

    // ---------------------- close a popup ---------------------
    // an image loading window closing handler
    var onImageEditingContainerClose = function () {
      imageEditingContainer.classList.add(HIDDEN_CLASS);
      body.classList.remove(OPEN_MODAL);
      fileChooser.value = '';

      previewImg.className = '';

      previewImg.style.filter = '';

      slidePin.style.left = '453px';
      effectDepth.style.width = '453px';
      effectList.querySelector('#effect-none').checked = true;

      // remove handlers
      document.removeEventListener('keydown', isEscape);
      closeButton.removeEventListener('click', onImageEditingContainerClose);
      smallerButton.removeEventListener('click', onSmallerButtonClick);
      biggerButton.removeEventListener('click', onBiggerButtonClick);
      photoSavingForm.removeEventListener('submit', onPhotoSavingFormSubmit);
    };

    var isEscape = function (evt) {
      if (evt.key === window.const.Key.ESCAPE) {
        onImageEditingContainerClose();
      }
    };

    closeButton.addEventListener('click', onImageEditingContainerClose);
    document.addEventListener('keydown', isEscape);
    // ---------------------- close a popup ---------------------


    // ---------------------- change a scale --------------------
    var onSmallerButtonClick = function () {
      var scaleCurrentValue = Number(scaleValueInput.value.slice(0, -1));
      if (scaleCurrentValue > SCALE_STEP) {
        scaleCurrentValue -= SCALE_STEP;
        previewImg.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
        scaleValueInput.value = scaleCurrentValue + '%';
      }
    };

    var onBiggerButtonClick = function () {
      var scaleCurrentValue = Number(scaleValueInput.value.slice(0, -1));
      if (scaleCurrentValue < 100) {
        scaleCurrentValue += SCALE_STEP;
        previewImg.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
        scaleValueInput.value = scaleCurrentValue + '%';
      }
    };

    smallerButton.addEventListener('click', onSmallerButtonClick);
    biggerButton.addEventListener('click', onBiggerButtonClick);

    // set a default scale value
    scaleValueInput.value = DEFAULT_SCALE + '%';
    previewImg.style.transform = 'scale(' + DEFAULT_SCALE / DEFAULT_SCALE + ')';
    // ---------------------- change a scale --------------------


    // ---------------------- move a slide --------------------
    var EffectToNameMap = {
      chrome: 'grayscale',
      sepia: 'sepia',
      marvin: 'invert',
      phobos: 'blur',
      heat: 'brightness',
    };

    slidePin.style.left = '453px';
    effectDepth.style.width = '453px';
    effectLevelValue.value = '100';

    var xCoord;
    var onSlideLineMousedown = function (evt) {
      if (!(evt.button === window.const.MOUSE_LEFT_BUTTON)) {
        return;
      }

      evt.preventDefault();
      var startX = evt.clintX;

      var onSlideLineMousemove = function (moveEvt) {
        moveEvt.preventDefault();
        var shiftX = startX - moveEvt.clientX;
        startX = moveEvt.clientX;
        xCoord = slidePin.offsetLeft - shiftX;
        if (xCoord >= 0 && xCoord <= 453) {
          slidePin.style.left = xCoord + 'px';
          effectDepth.style.width = xCoord + 'px';

          var effectValue = Math.round((xCoord / 453) * 100);
          effectLevelValue.value = effectValue;

          var effectName = EffectToNameMap[selectedEffect];

          if (effectName === 'blur') {
            var effectValue1 = Math.round((effectValue / 100 * 3) * 100) / 100 + 'px';
            previewImg.style.filter = effectName + '(' + effectValue1 + ')';
            return;
          }
          if (effectName === 'brightness') {
            var effectValue2 = effectValue / 100 * 2 + 1;
            previewImg.style.filter = '';
            previewImg.style.filter = effectName + '(' + effectValue2 + ')';
            return;
          }
          previewImg.style.filter = effectName + '(' + effectValue / 100 + ')';
        }
      };

      var onSlideLineMouseup = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onSlideLineMousemove);
        document.removeEventListener('mouseup', onSlideLineMouseup);
      };

      document.addEventListener('mousemove', onSlideLineMousemove);
      document.addEventListener('mouseup', onSlideLineMouseup);
    };

    slideLine.addEventListener('mousedown', onSlideLineMousedown);
  });
  // ---------------------- move a slide --------------------


  // ---------------------- set an effect -------------------
  var setPictureEffect = function (effect) {
    if (effect === 'none') {
      effectFieldset.classList.add('hidden');
      previewImg.className = '';
      previewImg.style.filter = 'none';
      return;
    }

    effectFieldset.classList.remove('hidden');
    previewImg.className = '';
    previewImg.style.filter = '';

    previewImg.classList.add('effects__preview--' + effect);

    slidePin.style.left = '453px';
    effectDepth.style.width = '453px';
    effectLevelValue.value = '100';
  };

  var selectedEffect;
  var onEffectListClick = function (evt) {
    if (!(evt.target.matches('input[name="effect"]'))) {
      return;
    }
    selectedEffect = evt.target.value;
    setPictureEffect(selectedEffect);
  };
  effectList.addEventListener('click', onEffectListClick);
  // ---------------------- set an effect -------------------


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


  // ---------------------- submit a form -------------------
  // get a container to insert a popup
  var mainContainer = document.querySelector('main');

  // get a success popup template
  var successPopupTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  // get a error popup template
  var errorPopupTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  // create an ad label
  var renderPopup = function (popup) {
    var popupElement = popup.cloneNode(true);
    mainContainer.appendChild(popupElement);
  };

  var resetPhotoSavingForm = function () {
    previewImg.src = previewImgDefault;

    imageEditingContainer.classList.add(HIDDEN_CLASS);
    body.classList.remove(OPEN_MODAL);

    // effectFieldset.classList.add('hidden');
    effectList.querySelector('#effect-none').checked = true;
    previewImg.className = '';
    previewImg.style.filter = 'none';

    scaleValueInput.value = DEFAULT_SCALE + '%';
    previewImg.style.transform = 'scale(' + DEFAULT_SCALE / DEFAULT_SCALE + ')';
  };

  // send an ad to the server
  var closePopupByKey = function (evt, popup) {
    if (!evt.key === window.const.Key.ESCAPE) {
      return;
    }
    if (popup) {
      popup.remove();
    }
  };

  // success callback for send an offer to the server
  var onFormSuccess = function () {
    renderPopup(successPopupTemplate);

    // close a popup by a click
    var successContainer = mainContainer.querySelector('.success');

    successContainer.addEventListener('click', function (evt) {
      if (!(evt.target.matches('.success') || evt.target.matches('.success__button'))) {
        return;
      }
      successContainer.remove();
      document.removeEventListener('keydown', onSuccessPopupPress);
    });

    // close a popup by an Esc key
    var onSuccessPopupPress = function (evt) {
      closePopupByKey(evt, successContainer);
      document.removeEventListener('keydown', onSuccessPopupPress);
    };

    // success popup close handler
    document.addEventListener('keydown', onSuccessPopupPress);

    resetPhotoSavingForm();
  };

  // error callback for send an offer to the server
  var onFormError = function () {
    renderPopup(errorPopupTemplate);

    // close a popup by a click
    var errorContainer = mainContainer.querySelector('.error');

    // addListeners(errorContainer);
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

  var onPhotoSavingFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(photoSavingForm), onFormSuccess, onFormError);
  };

  // submit a photo saving form
  photoSavingForm.addEventListener('submit', onPhotoSavingFormSubmit);
  // ---------------------- submit a form -------------------

})();
