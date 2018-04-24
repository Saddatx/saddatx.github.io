'use strict';

(function () {

  var DEBOUNCE_FILTER_INTERVAL = 500;
  window.filters = {
    initialize: function (filterElement, photoElement, data) {

      var filterPopular = filterElement.querySelector('#filter-popular');
      var filterDiscussed = filterElement.querySelector('#filter-discussed');
      var filterRandom = filterElement.querySelector('#filter-random');

      // Переключает сортировку фотографий
      var switchFilters = function (evt) {
        var compareFunction = null;
        photoElement.innerHTML = '';
        switch (evt.target) {
          case filterPopular:
            compareFunction = function (first, second) {
              return second.likes - first.likes;
            };
            break;
          case filterDiscussed:
            compareFunction = function (first, second) {
              return second.comments.length - first.comments.length;
            };
            break;
          case filterRandom:
            compareFunction = function () {
              return 0.5 - Math.random();
            };
        }
        photoElement.appendChild(window.renderFragment(compareFunction ? data.slice().sort(compareFunction) : data));
      };

      var switchFilterDebounced = window.debounce(switchFilters, DEBOUNCE_FILTER_INTERVAL);
      filterElement.addEventListener('click', function (evt) {
        if (evt.target.tagName === 'INPUT') {
          switchFilterDebounced(evt);
        }
      });
    }
  };
})();
