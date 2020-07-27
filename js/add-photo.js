'use strict';

(function () {
  var HIDDEN_CLASS = 'hidden';
  var OPENED_POPUP_CLASS = 'modal-open';
  var DEFAULT_SCALE = 100;
  var SCALE_STEP = 25;
  var DEFAULT_EFFECT_LEVEL = 100;
  var XBound = {
    LEFT: 0,
    RIGHT: 453,
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

  var slidePin = effectFieldset.querySelector('.effect-level__pin');
  var effectDepth = effectFieldset.querySelector('.effect-level__depth');

  var effectList = imageContainer.querySelector('.effects__list');


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

  // close a popup
  var onCloseButtonClick = function () {
    resetPhotoSavingForm();
  };
  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', window.util.isEscape);

  // change a scale
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


  window.addPhoto = {
    resetForm: resetPhotoSavingForm,
    resetFilter: resetFilter,
    setDefaultSlide: setDefaultSlide,
    setDefaultScale: setDefaultScale
  };

})();
