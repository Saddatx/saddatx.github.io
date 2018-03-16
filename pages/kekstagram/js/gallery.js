'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  var filters = document.querySelector('.filters');

  // Функция закрытие фото при нажатии на Esc
  var onPopupKeyPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closePhoto();
    }
  };

  // Функция открытия фото
  var openPhoto = function () {
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onPopupKeyPress);
  };

  // Функция закрытия фото
  var closePhoto = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onPopupKeyPress);
  };

  // Функция открытия фото при нажатии на ENTER, когда фото в фокусе
  var onPhotoKeyPress = function (evt) {
    if (window.utils.isEnterEvent(evt)) {
      openPhoto();
    }
  };

  // Функция закрытия фото при нажатии на ENTER, когда "крестик" в фокусе
  var onCrossKeyPress = function (evt) {
    if (window.utils.isEnterEvent(evt)) {
      closePhoto();
    }
  };

  // Получает данные атрибута src при клике на img
  var onPhotoClick = function (evt) {
    var target = evt.target;
    if (evt.target !== picturesContainer) {
      openPhoto();
      evt.preventDefault(); // Отменяет привычное поведение ссылок
      while (!target.classList.contains('picture')) {
        target = target.parentNode;
      }
      var photoId = target.children[0].getAttribute('id');
      window.preview.showGalleryOverlay(loadedData[photoId]);
    }
  };

  // Добавляет данные с сервера
  var loadedData = null;
  var onLoad = function (data) {
    loadedData = data.map(function (item, index) {
      item.id = index;
      return item;
    });
    picturesContainer.appendChild(window.renderFragment(loadedData));
    filters.classList.remove('filters-inactive');
    window.filters.initialize(filters, picturesContainer, loadedData);
  };

  window.backend.load(onLoad, window.error.show);

  // Обработчик открытия фото на ENTER
  picturesContainer.addEventListener('keydown', onPhotoKeyPress);

  // Обработчик закрытия фото по крестику
  galleryOverlayClose.addEventListener('click', closePhoto);

  // Обработчик закрытия фото на Enter
  galleryOverlayClose.addEventListener('keydown', onCrossKeyPress);

  // Открывает увеличенное фото при клике на уменьшенное
  picturesContainer.addEventListener('click', onPhotoClick);
})();
