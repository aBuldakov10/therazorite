/*** Variables ***/
const gulp = require('gulp'),
      postcss = require('gulp-postcss'),
      sass = require('gulp-sass'),
      mqpacker = require('css-mqpacker'),
      csso = require('gulp-csso'),
      autoprefixer = require('autoprefixer'),
      unprefix = require('postcss-unprefix'),
      fileinclude = require('gulp-file-include'),
      webpHtml = require('gulp-webp-html'),
      imagemin = require('gulp-imagemin'),
      imagewebp = require('gulp-webp'),
      uglifyJS = require('gulp-uglify'),
      babel = require('gulp-babel'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      clean = require('gulp-clean'),
      browserSync = require('browser-sync');

/*** Path ***/
let path = {
  src: {
    html: ['app/templates_html/*.html', '!app/templates_html/assets/_*.html'],
    scss: 'app/scss/**/main.scss',
    js: ['app/js/swiper-bundle.min.js', 'app/js/main.js'],
    img: 'app/img/**/*.*',
    fonts_woff: ['app/fonts/**/*.*']
  },
  watch: {
    html: 'app/templates_html/**/*.html',
    scss: 'app/scss/**/*.scss',
    js: 'app/js/*.js',
    img: 'app/img/**/*.*'
  },
  build: {
    html: 'dest/*.html',
    css: 'dest/css/**/*.css',
    js: 'dest/js/*.js',
    img: 'dest/img/**/*.*',
    fonts: 'dest/fonts/**/*.*'
  }
}

/*** Dev tasks ***/
// HTML task
gulp.task('html', function () {
  return gulp.src(path.src.html)
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(webpHtml())
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true}))
});

// SCSS task
gulp.task('sass', function () {
  return gulp.src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([
        unprefix(),
        autoprefixer(),
        mqpacker({sort: true})
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.reload({stream: true}))
});

// JS task
gulp.task('js', function () {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(babel({presets: [["@babel/preset-env"]]}))
    .pipe(gulp.dest('dest/js'))
    .pipe(browserSync.reload({stream: true}))
});

// IMG task
gulp.task('images', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 3
    }))
    .pipe(gulp.dest('dest/img'))
    .pipe(imagewebp({
      quality: 70
    }))
    .pipe(gulp.dest('dest/img'))
    .pipe(browserSync.reload({stream: true}))
});

// Fonts
gulp.task('woff2', function () {
  return gulp.src(path.src.fonts_woff)
    .pipe(gulp.dest('dest/fonts'))
});

// Browser Sync task
gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'dest'
    },
    notify: false
  });
});

// Watchers
gulp.task('watch', function () {
  gulp.watch(path.watch.html, gulp.parallel('html')); // Watch HTML files
  gulp.watch(path.watch.scss, gulp.parallel('sass')); // Watch SASS files
  gulp.watch(path.watch.js, gulp.parallel('js')); // Watch JS files
  gulp.watch(path.watch.img, gulp.parallel('images')); // Watch image files
});

// Run tasks
gulp.task('fonts', gulp.parallel('woff2'));

gulp.task('compile', gulp.parallel('html', 'sass', 'js', 'images'));

gulp.task('watch-changes', gulp.parallel('browser-sync', 'watch'));

gulp.task('default', gulp.series('compile', 'watch-changes'));


/*** Build tasks ***/
// Clean build directory task
gulp.task('build-clean', function () {
  return gulp.src('build')
    .pipe(clean()) // Clean build directory
});

// Task for moving all HTML files from dest to build directory
gulp.task ('build-html', function () {
  return gulp.src(path.build.html)
    .pipe(gulp.dest('build'))
});

// Task for moving all CSS files from dest to build directory
gulp.task ('build-css', function () {
  return gulp.src(path.build.css)
    .pipe(csso()) // Minify CSS
    .pipe(gulp.dest('build/css'))
});

// Task for moving all JS files from dest to build directory
gulp.task ('build-js', function () {
  return gulp.src(path.build.js)
    .pipe(uglifyJS()) // Minify JS
    .pipe(gulp.dest('build/js'))
});

// Task for moving all images from dest to build directory
gulp.task ('build-images', function () {
  return gulp.src(path.build.img)
    .pipe(gulp.dest('build/img'))
});

// Task for moving all fonts from dest to build directory
gulp.task ('build-fonts', function () {
  return gulp.src(path.build.fonts)
    .pipe(gulp.dest('build/fonts'))
});

// Run build
gulp.task ('build', gulp.series('build-clean', 'build-html', 'build-css', 'build-js', 'build-images', 'build-fonts'));
