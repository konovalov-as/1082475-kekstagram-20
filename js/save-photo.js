'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HIDDEN_CLASS = 'hidden';
  var OPEN_MODAL = 'modal-open';
  var ESCAPE = window.const.Key.ESCAPE;
  var DEFAULT_SCALE = 100;
  var SCALE_STEP = 25;

  var body = document.querySelector('body');

  var photoSavingForm = body.querySelector('.img-upload__form');
  var closeButton = photoSavingForm.querySelector('#upload-cancel');

  var imageEditingBlock = photoSavingForm.querySelector('.img-upload__overlay');
  var preview = imageEditingBlock.querySelector('.img-upload__preview img');
  var slide = imageEditingBlock.querySelector('.effect-level__pin');
  var smallerButton = imageEditingBlock.querySelector('.scale__control--smaller');
  var biggerButton = imageEditingBlock.querySelector('.scale__control--bigger');
  var scaleValue = imageEditingBlock.querySelector('.scale__control--value');

  var fileChooser = photoSavingForm.querySelector('#upload-file');

  // reads an image selected by the user
  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (fileType) {
      return fileName.endsWith(fileType);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        // writes a new image url
        preview.src = reader.result;
        imageEditingBlock.classList.remove(HIDDEN_CLASS);
        body.classList.add(OPEN_MODAL);
      });

      reader.readAsDataURL(file);
    }

    // image loading window closing handler
    var onImageEditingBlockClose = function () {
      imageEditingBlock.classList.add(HIDDEN_CLASS);
      body.classList.remove(OPEN_MODAL);
      fileChooser.value = '';

      // removes handlers
      document.removeEventListener('keydown', isEscape);
      closeButton.removeEventListener('click', onImageEditingBlockClose);
      smallerButton.removeEventListener('click', onSmallerButtonClick);
      biggerButton.removeEventListener('click', onBiggerButtonClick);
    };

    var isEscape = function (evt) {
      if (evt.key === ESCAPE) {
        onImageEditingBlockClose();
      }
    };

    closeButton.addEventListener('click', onImageEditingBlockClose);
    document.addEventListener('keydown', isEscape);

    slide.addEventListener('mouseup', function (evt) {
      return evt;
      // console.log(evt);
    });

    var onSmallerButtonClick = function () {
      var scaleCurrentValue = Number(scaleValue.value.slice(0, -1));
      if (scaleCurrentValue > SCALE_STEP) {
        scaleCurrentValue -= SCALE_STEP;
        preview.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
        scaleValue.value = scaleCurrentValue + '%';
      }
    };

    var onBiggerButtonClick = function () {
      var scaleCurrentValue = Number(scaleValue.value.slice(0, -1));
      if (scaleCurrentValue < 100) {
        scaleCurrentValue += SCALE_STEP;
        preview.style.transform = 'scale(' + scaleCurrentValue / DEFAULT_SCALE + ')';
        scaleValue.value = scaleCurrentValue + '%';
      }
    };

    smallerButton.addEventListener('click', onSmallerButtonClick);
    biggerButton.addEventListener('click', onBiggerButtonClick);

    // sets a default value
    scaleValue.value = DEFAULT_SCALE + '%';
    preview.style.transform = 'scale(' + DEFAULT_SCALE / DEFAULT_SCALE + ')';
  });


})();
