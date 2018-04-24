'use strict';

(function () {
  var FILE_TYPES = ['gif', 'png', 'jpg', 'jpeg'];

  window.imageLoader = function (fileInput, preview, callback) {
    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
      callback();
    });
  };

})();
