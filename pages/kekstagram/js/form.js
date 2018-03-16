'use strict';

(function () {
  // Переменные для формы кадрирования
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var formClose = uploadForm.querySelector('.upload-form-cancel');
  var formSubmit = uploadOverlay.querySelector('.upload-form-submit');
  var uploadEffectNone = uploadOverlay.querySelector('#upload-effect-none');

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');
  var effectControls = uploadOverlay.querySelector('.upload-effect-controls');
  var imagePreview = uploadOverlay.querySelector('.effect-image-preview');

  var imageCommentField = uploadOverlay.querySelector('.upload-form-description');
  var imageHashtagsField = uploadOverlay.querySelector('.upload-form-hashtags');

  var HashtagsOption = {
    FIRST_SYMBOL: '#',
    MAX_LENGTH: 20,
    MAX_AMOUNT: 5
  };

  var CommentOption = {
    MAX_LENGTH: 140
  };

  var Effect = {
    CHROME: 'effect-chrome',
    SEPIA: 'effect-sepia',
    MARVIN: 'effect-marvin',
    PHOBOS: 'effect-phobos',
    HEAT: 'effect-heat'
  };


  var resetForm = function () {
    uploadFile.value = '';
    imageHashtagsField.value = '';
    imageCommentField.value = '';
    imagePreview.className = 'effect-image-preview';
    imagePreview.style.filter = 'none';
    uploadEffectNone.checked = true;
    window.scale.reset(resizeControls, adjustScale);
    window.effects.reset(effectControls);
  };

  // Открывает форму кадрирования
  var openUploadForm = function () {
    window.error.hide();
    uploadOverlay.classList.remove('hidden');
    uploadImage.classList.add('hidden');
    document.addEventListener('keydown', onUploadFormKeyPress);
  };

  // Закрывает форму кадрирования
  var closeUploadForm = function () {
    uploadOverlay.classList.add('hidden');
    uploadImage.classList.remove('hidden');
    document.removeEventListener('keydown', onUploadFormKeyPress);
    resetForm();
  };

  // Закрывает форму кадрирования при нажатии на ESC
  var onUploadFormKeyPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeUploadForm();
    }
  };

  imageCommentField.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onUploadFormKeyPress);
  });

  imageCommentField.addEventListener('focusout', function () {
    document.addEventListener('keydown', onUploadFormKeyPress);
  });

  // Открывает форму кадрирования после загрузки фото
  window.imageLoader(uploadFile, imagePreview, openUploadForm);
  // Закрывает форму кадрировании при клике по крестику
  formClose.addEventListener('click', closeUploadForm);

  // Применение эффекта к изображению

  var setEffectValue = function (currentEffect, value) {
    switch (currentEffect) {
      case Effect.CHROME:
        imagePreview.style.filter = 'grayscale(' + value / 100 + ')';
        break;
      case Effect.SEPIA:
        imagePreview.style.filter = 'sepia(' + value / 100 + ')';
        break;
      case Effect.MARVIN:
        imagePreview.style.filter = 'invert(' + value + '%)';
        break;
      case Effect.PHOBOS:
        imagePreview.style.filter = 'blur(' + value * 3 / 100 + 'px)';
        break;
      case Effect.HEAT:
        imagePreview.style.filter = 'brightness(' + value * 3 / 100 + ')';
        break;
      default:
        imagePreview.style.filter = 'none';
    }
  };

  var applyEffect = function (newEffect, oldEffect, value) {
    if (newEffect !== oldEffect) {
      imagePreview.classList.remove(oldEffect);
      imagePreview.classList.add(newEffect);
    }
    setEffectValue(newEffect, value);
  };

  window.effects.initialize(effectControls, applyEffect);

  // Изменение масштаба изображения
  var adjustScale = function (value) {
    imagePreview.style.transform = 'scale(' + value / 100 + ')';
  };

  window.scale.initialize(resizeControls, adjustScale);

  // Проверка правильности заполнения поля хэш-тегов
  var imageHashtagsValidity = function () {
    var hashtagsValue = imageHashtagsField.value.trim();
    var hashtagsList = hashtagsValue.toLowerCase().split(' ');
    var errorMessage = '';
    if (hashtagsList.length > HashtagsOption.MAX_AMOUNT) {
      errorMessage = 'Количество хэш-тегов не может быть больше 5.';
    } else if (imageHashtagsField.value !== '') {
      hashtagsList.sort();
      for (var i = 0; i < hashtagsList.length; i++) {
        if (hashtagsList[i].charAt(0) !== HashtagsOption.FIRST_SYMBOL) {
          errorMessage = 'Хэш-теги должны начинаться со знака решетки (#).';
        } else if (hashtagsList[i].indexOf('#', 1) > 0) {
          errorMessage = 'Хэш-теги должны разделяться пробелом.';
        } else if (hashtagsList[i].length > HashtagsOption.MAX_LENGTH) {
          errorMessage = 'Название хэш-тегов не может превышать 20 символов.';
        } else if (i !== hashtagsList.length - 1 && hashtagsList[i] === hashtagsList[i + 1]) {
          errorMessage = 'Хэш-теги не должны повторяться!';
        }
      }
    }
    imageHashtagsField.setCustomValidity(errorMessage);
  };

  imageHashtagsField.addEventListener('input', imageHashtagsValidity);

  // Проверка правильности заполнения поля описания фотографии
  var imageCommentValidity = function () {
    var errorMessage = 'Комментарий должен содержать не более 140 символов.';
    imageCommentField.setCustomValidity(imageCommentField.value.length > CommentOption.MAX_LENGTH ? errorMessage : '');
  };

  imageCommentField.addEventListener('input', imageCommentValidity);

  // Подсветка неправильно заполненных полей
  var validateField = function (formField) {
    formField.style.outlineColor = formField.validity.valid ? '-webkit-focus-ring-color' : 'red';
  };

  formSubmit.addEventListener('click', function () {
    validateField(imageHashtagsField);
    validateField(imageCommentField);
  });

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var closeResetForm = function () {
      closeUploadForm();
    };
    window.backend.save(new FormData(uploadForm), closeResetForm, window.error.show);
  });

})();
