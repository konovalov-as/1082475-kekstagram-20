'use strict';

(function () {
  var photoSavingForm = document.querySelector('.img-upload__form');

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

    window.addPhoto.resetForm();
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

})();
