'use strict';

(function () {
  var galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  var galleryLikesCount = document.querySelector('.likes-count');
  var galleryCommentsCount = document.querySelector('.comments-count');
  window.preview = {
    showGalleryOverlay: function (photoObjects) {
      galleryOverlayImage.setAttribute('src', photoObjects.url);
      galleryLikesCount.textContent = photoObjects.likes;
      galleryCommentsCount.textContent = photoObjects.comments.length;
    }
  };
})();
