'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var HIDDEN_CLASS = 'hidden';
  var OPENED_POPUP_CLASS = 'modal-open';

  var indexBody = document.querySelector('body');

  var photoSavingForm = indexBody.querySelector('.img-upload__form');
  var imageContainer = photoSavingForm.querySelector('.img-upload__overlay');
  var previewImg = imageContainer.querySelector('.img-upload__preview img');

  var effectFieldset = imageContainer.querySelector('.effect-level');
  var slideLine = effectFieldset.querySelector('.effect-level__line');
  var effectPreviewImgs = imageContainer.querySelectorAll('.effects__preview');

  var fileChooser = photoSavingForm.querySelector('#upload-file');

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

  fileChooser.addEventListener('change', function () {
    window.addPhoto.setDefaultScale();

    readFile();

    slideLine.addEventListener('mousedown', window.pin.onSlideLineMousedown);
  });

})();
