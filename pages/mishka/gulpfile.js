var gulp = require("gulp"); // подключение gulp
var less = require("gulp-less"); // подключение less
var plumber = require("gulp-plumber"); // подключение plumber
var postcss = require("gulp-postcss"); // подключение postcss
var autoprefixer = require("autoprefixer"); // подключение autoprefixer
var server = require("browser-sync"); // подключение browser-sync
var mqpacker = require("css-mqpacker"); // подключение css-mqpacker
var minify = require("gulp-csso"); // подключение gulp-csso
var rename = require("gulp-rename"); // подключение rename
var imagemin = require("gulp-imagemin"); // подключение imagemin
var svgstore = require("gulp-svgstore");
var svgSprite = require('gulp-svg-sprite'),
	  svgmin = require('gulp-svgmin'),
	  cheerio = require('gulp-cheerio'),
	  replace = require('gulp-replace');
var uglify = require("gulp-uglify");
var run = require("run-sequence"); // плагин для последовательного запуска задач
var del = require("del"); // плагин для удаления папок и файлов

gulp.task("clean", function () { // удаляет build
  return del("build");
});
gulp.task("copy", function() { // копирует необходимые файлы в build
  return gulp.src([
    "fonts/**/*.{woff,woff2,ttf}",
    "img/**",
    "js/**",
    "*.html"
  ], {
    base: "." // если не указать то все файлы будут лежать в корне, а не по папкам
  })
  .pipe(gulp.dest("build"));
});
gulp.task("copyhtml", function() { // копирует html в build
  return gulp.src([
    "*.html"
  ], {
    base: "." // если не указать то все файлы будут лежать в корне, а не по папкам
  })
  .pipe(gulp.dest("build"))
  .pipe(server.reload({stream: true})); // команда перезагрузки странички
});
gulp.task("style", function() { // создание таска style
  gulp.src('less/style.less') // путь к less файлам
  .pipe(plumber()) // чтобы не падал процесс автоматизации при ошибках
  .pipe(less()) // проганяем через компилятор less
  .pipe(postcss([
    autoprefixer({browsers: [
      'last 15 versions',
      '> 1%',
      'ie 8',
      'ie 7'
    ]}),
    mqpacker({
      sort: true
    })
  ]))
  .pipe(gulp.dest("build/css")) // исходный результат записываем в css
  .pipe(minify()) // минифицируем
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest("build/css"))
  .pipe(server.reload({stream: true})); // команда перезагрузки странички
});
gulp.task("normalize", function () {
  gulp.src('less/normalize.less')
  .pipe(less())
  .pipe(gulp.dest("build/css"))
  .pipe(minify()) // минифицируем
  .pipe(rename("normalize.min.css"))
  .pipe(gulp.dest("build/css"))
})
gulp.task("images", function() { // создание таска images
  return gulp.src("build/img/**/*.{png,jpg,gif}") // указываем откуда брать изображения
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}), // безопастное сжатие (1 - макс. сжатие, 10 - без сжатия)
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img")); // указываем куда ложить минифицированные изображения
})
gulp.task('svgSprite', function () {
	return gulp.src("build/img/svg/*.svg")
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						css: {
							dest:'../sprite.css',
							// template: assetsDir + "sass/templates/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('build/img'));
});
// gulp.task("sprite", function () { // таск для сборки svg-спрайта
//   return gulp.src("build/img/svg/*.svg") // указываем откуда брать изображения svg
//   .pipe(svgmin()) // минифицируем svg перед созданием спрайта
//   .pipe(svgstore({ // создаем спрайт
//     inlineSvg: true // уберет из файла все не нужное (doctype, xml и прочее)
//   }))
//   .pipe(rename("sprite.svg")) // переименовываем спрайт
//   .pipe(gulp.dest("build/img")); // указываем куда ложить готовый спрайт
// })
gulp.task('jsmin', function() {
  return gulp.src([
    'js/main.js'
    ]) // выбираем файлы для минификации
    .pipe(gulp.dest("build/js")) // исходный результат записываем в js
    .pipe(uglify()) //минифицируем
    .pipe(rename({suffix: '.min'})) //добавляем суффикс .min
    .pipe(gulp.dest('build/js')) // выгружаем в папку app/css
    .pipe(server.reload({stream: true})); // команда перезагрузки странички
});
gulp.task("serve", function () {
  server.init({
    server: "build" // откуда browser-sync будет смотреть на наш сайт
  });
  gulp.watch("less/**/*.less", ["style"]); // watch'ер который следит за изменениями файлов (если один из этих файлов изменился то выполняем необходимый таск)
  gulp.watch("*.html", ["copyhtml"]); // следим за html-файлами и при их изменении перегружаем страничку
  gulp.watch('js/**/*.js', ["jsmin"]); // Наблюдение за JS файлами в папке js
})
gulp.task("build", function (fn) {
  run("clean", "copy", "style", "normalize", "jsmin", "images", "svgSprite", fn);
})
