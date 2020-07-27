'use strict';

(function () {
  var DEFAULT_EFFECT_LEVEL = 100;
  var BLUR_MAX_VALUE = 3;
  var BRIGHTNESS_MAX_VALUE = 2;

  var XBound = {
    LEFT: 0,
    RIGHT: 453,
  };
  var Effect = {
    BLUR: 'blur',
    BRIGHTNESS: 'brightness',
  };

  var imageContainer = document.querySelector('.img-upload__overlay');
  var previewImg = imageContainer.querySelector('.img-upload__preview img');

  var effectLevelInput = imageContainer.querySelector('.effect-level__value');
  var slidePin = imageContainer.querySelector('.effect-level__pin');
  var effectDepth = imageContainer.querySelector('.effect-level__depth');

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

        var effectName = EffectToNameMap[window.selectedEffect];

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


  window.pin = {
    onSlideLineMousedown: onSlideLineMousedown,
  };

})();
