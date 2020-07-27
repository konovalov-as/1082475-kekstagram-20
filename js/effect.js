'use strict';

(function () {
  var NO_EFFECT = 'none';
  var HIDDEN_CLASS = 'hidden';

  var imageContainer = document.querySelector('.img-upload__overlay');
  var previewImg = imageContainer.querySelector('.img-upload__preview img');

  var effectFieldset = imageContainer.querySelector('.effect-level');
  var effectList = imageContainer.querySelector('.effects__list');

  var setPictureEffect = function (effect) {
    if (effect === NO_EFFECT) {
      effectFieldset.classList.add(HIDDEN_CLASS);
      window.addPhoto.resetFilter();
      return;
    }
    effectFieldset.classList.remove(HIDDEN_CLASS);

    window.addPhoto.resetFilter();

    previewImg.classList.add('effects__preview--' + effect);

    window.addPhoto.setDefaultSlide();
  };

  var selectedEffect;
  var onEffectListClick = function (evt) {
    if (!(evt.target.matches('input[name="effect"]'))) {
      return;
    }
    selectedEffect = evt.target.value;
    window.selectedEffect = selectedEffect;
    setPictureEffect(selectedEffect);
  };
  effectList.addEventListener('click', onEffectListClick);

})();
