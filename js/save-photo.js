'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HIDDEN_CLASS = 'hidden';
  var OPENED_POPUP_CLASS = 'modal-open';
  var DEFAULT_SCALE = 100;
  var SCALE_STEP = 25;
  var DEFAULT_EFFECT_LEVEL = 100;
  var BLUR_MAX_VALUE = 3;
  var BRIGHTNESS_MAX_VALUE = 2;
  var NO_EFFECT = 'none';
  var XBound = {
    LEFT: 0,
    RIGHT: 453,
  };
  var Effect = {
    BLUR: 'blur',
    BRIGHTNESS: 'brightness',
  };

  var indexBody = document.querySelector('body');

  var photoSavingForm = indexBody.querySelector('.img-upload__form');
  var closeButton = photoSavingForm.querySelector('#upload-cancel');

  var fileChooser = photoSavingForm.querySelector('#upload-file');

  var imageContainer = photoSavingForm.querySelector('.img-upload__overlay');
  var previewImg = imageContainer.querySelector('.img-upload__preview img');
  var previewImgDefault = previewImg.attributes.src.value;

  var smallerButton = imageContainer.querySelector('.scale__control--smaller');
  var biggerButton = imageContainer.querySelector('.scale__control--bigger');
  var scaleValueInput = imageContainer.querySelector('.scale__control--value');

  var effectFieldset = imageContainer.querySelector('.effect-level');
  var effectLevelInput = effectFieldset.querySelector('.effect-level__value');
  var slideLine = effectFieldset.querySelector('.effect-level__line');
  var slidePin = effectFieldset.querySelector('.effect-level__pin');
  var effectDepth = effectFieldset.querySelector('.effect-level__depth');

  var effectList = imageContainer.querySelector('.effects__list');
  var effectPreviewImgs = effectList.querySelectorAll('.effects__preview');

  var setDefaultScale = function () {
    scaleValueInput.value = DEFAULT_SCALE + window.const.CssUnit.PERCENT;
    previewImg.style.transform = 'scale(' + DEFAULT_SCALE / DEFAULT_SCALE + ')';
  };

  var setDefaultSlide = function () {
    slidePin.style.left = XBound.RIGHT + window.const.CssUnit.PX;
    effectDepth.style.width = XBound.RIGHT + window.const.CssUnit.PX;
    effectLevelInput.value = DEFAULT_EFFECT_LEVEL;
  };

  var resetFilter = function () {
    previewImg.className = '';
    previewImg.style.filter = '';
  };

  var resetPhotoSavingForm = function () {
    indexBody.classList.remove(OPENED_POPUP_CLASS);
    imageContainer.classList.add(HIDDEN_CLASS);
    fileChooser.value = '';
    previewImg.src = previewImgDefault;
    effectList.querySelector('#effect-none').checked = true;
    setDefaultScale();
    setDefaultSlide();
    resetFilter();
    photoSavingForm.reset();
  };

  var readFile = function () {
    effectFieldset.classList.add(HIDDEN_CLASS);

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

        effectPreviewImgs.forEach(function (image) {
          image.style.backgroundImage = 'url(' + reader.result + ')';
        });

        imageContainer.classList.remove(HIDDEN_CLASS);
        indexBody.classList.add(OPENED_POPUP_CLASS);
      });

      reader.readAsDataURL(file);
    }
  };

  // ---------- read an image selected by the user ----------
  fileChooser.addEventListener('change', function () {
    setDefaultScale();

    readFile();

    slideLine.addEventListener('mousedown', onSlideLineMousedown);
  });

  // ---------------------- close a popup ---------------------
  var onCloseButtonClick = function () {
    resetPhotoSavingForm();
  };
  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', window.util.isEscape);
  // ---------------------- close a popup ---------------------

  // ---------------------- change a scale --------------------
  var onSmallerButtonClick = function () {
    var scaleCurrentValue = Number(scaleValueInput.value.slice(0, -1));
    if (!(scaleCurrentValue > SCALE_STEP)) {
      return;
    }
    scaleCurrentValue -= SCALE_STEP;
    previewImg.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
    scaleValueInput.value = scaleCurrentValue + '%';
  };

  var onBiggerButtonClick = function () {
    var scaleCurrentValue = Number(scaleValueInput.value.slice(0, -1));
    if (!(scaleCurrentValue < DEFAULT_SCALE)) {
      return;
    }
    scaleCurrentValue += SCALE_STEP;
    previewImg.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
    scaleValueInput.value = scaleCurrentValue + '%';
  };

  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
  // ---------------------- change a scale --------------------

  // ---------------------- move a slide --------------------
  var EffectToNameMap = {
    chrome: 'grayscale',
    sepia: 'sepia',
    marvin: 'invert',
    phobos: 'blur',
    heat: 'brightness',
  };

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

      if (xCoord >= XBound.LEFT && xCoord <= XBound.RIGHT) {
        slidePin.style.left = xCoord + window.const.CssUnit.PX;
        effectDepth.style.width = xCoord + window.const.CssUnit.PX;

        var effectValue = Math.round((xCoord / XBound.RIGHT) * DEFAULT_EFFECT_LEVEL);
        effectLevelInput.value = effectValue;

        var effectName = EffectToNameMap[selectedEffect];

        if (effectName === Effect.BLUR) {
          effectValue = Math.round((effectValue / DEFAULT_EFFECT_LEVEL * BLUR_MAX_VALUE) * DEFAULT_EFFECT_LEVEL) / DEFAULT_EFFECT_LEVEL + window.const.CssUnit.PX;
          previewImg.style.filter = effectName + '(' + effectValue + ')';
          return;
        }
        if (effectName === Effect.BRIGHTNESS) {
          effectValue = effectValue / DEFAULT_EFFECT_LEVEL * BRIGHTNESS_MAX_VALUE + 1;
          previewImg.style.filter = effectName + '(' + effectValue + ')';
          return;
        }
        previewImg.style.filter = effectName + '(' + effectValue / DEFAULT_EFFECT_LEVEL + ')';
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
  // ---------------------- move a slide --------------------

  // ---------------------- set an effect -------------------
  var setPictureEffect = function (effect) {
    if (effect === NO_EFFECT) {
      effectFieldset.classList.add(HIDDEN_CLASS);
      resetFilter();
      return;
    }
    effectFieldset.classList.remove(HIDDEN_CLASS);

    resetFilter();

    previewImg.classList.add('effects__preview--' + effect);

    setDefaultSlide();
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

  window.savePhoto = {
    resetForm: resetPhotoSavingForm
  };

})();
