'use strict';

(function () {
  // Функцию воазращения блока DOM-элементов
  window.renderFragment = function (photoData) {
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture-template').content.querySelector('.picture');
    photoData.forEach(function (item) {
      var element = template.cloneNode(true);
      element.querySelector('img').setAttribute('id', item.id);
      element.querySelector('img').setAttribute('src', item.url);
      element.querySelector('.picture-comments').textContent = item.comments.length;
      element.querySelector('.picture-likes').textContent = item.likes;
      fragment.appendChild(element);
    });
    return fragment;
  };
})();
