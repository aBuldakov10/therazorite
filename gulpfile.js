/*** Variables ***/
const gulp = require('gulp'), // Include gulp
      plumber = require('gulp-plumber'), // Show error without stop gulp
      postcss = require('gulp-postcss'), // Use several CSS plugins
      sass = require('gulp-sass'), // Include SASS
      mqpacker = require('css-mqpacker'), // Media query optimization
      csso = require('gulp-csso'), // Minify CSS
      scsslint = require('gulp-scss-lint'), // Check code style
      autoprefixer = require('autoprefixer'), // Add vendor prefixes CSS for old browsers
      unprefix = require('postcss-unprefix'), // Remove prefixes
      fileinclude = require('gulp-file-include'), // Include HTML into HTML
      webpHtml = require('gulp-webp-html'), // Auto add webp for img
      pug = require('gulp-pug'), // Include Pug
      remember = require('gulp-remember'),
      imagemin = require('gulp-imagemin'), // Minify images
      imagewebp = require('gulp-webp'), // Minify images
      uglifyJS = require('gulp-uglify'), // Minify JS
      babel = require('gulp-babel'), // Transform ES6 into ES5
      ttf2woff = require('gulp-ttf2woff'), // Convert ttf to woff
      ttf2woff2 = require('gulp-ttf2woff2'), // Convert ttf to woff2
      sourcemaps = require('gulp-sourcemaps'), // Add site map
      concat = require('gulp-concat'), // Files concatination
      clean = require('gulp-clean'), // Clean destination directory
      browserSync = require('browser-sync'); // Include Browser Sync

/*** Path ***/
let path = {
  src: {
    html: ['app/templates_html/*.html', '!app/templates_html/assets/_*.html'],
    pug: 'app/templates_pug/*.pug',
    scss: 'app/scss/**/main.scss',
    js: ['app/js/main.js'], // If there are many js files use src(['filename.js', 'filename1.js','filename2.js'])
    img: 'app/img/**/*.*',
    fonts_ttf: 'app/fonts/**/*.ttf',
    fonts_woff: ['app/fonts/**/*.*', '!app/fonts/**/*.ttf']
  },
  watch: {
    html: 'app/templates_html/**/*.html',
    pug: 'app/templates_pug/**/*.pug',
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
      prefix: '@', // Prefix before include file ex. @include('path/_head.html', {})
      basepath: '@file'
    }))
    .pipe(webpHtml()) // Add webp for img
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true})) // Update html after change
});

// PUG task
gulp.task('pug', function () {
  return gulp.src(path.src.pug)
    .pipe(pug({pretty: true})) // Transform html easy reading
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true})) // Update html after change
});

// SCSS task
gulp.task('sass', function () {
  return gulp.src(path.src.scss)
    .pipe(sourcemaps.init()) // Site map init
    .pipe(sass({outputStyle: 'expanded'})) // Transform sass/scss into css
    .pipe(postcss([ // Add prefixes, move media queries to the end of the file
        unprefix(),
        autoprefixer(),
        mqpacker({sort: true})
    ]))
    .pipe(sourcemaps.write('.')) // SourceMaps path write
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.reload({stream: true})) // Update CSS after change
});

// JS task
gulp.task('js', function () {
  return gulp.src(path.src.js) // If there are many js files use src(['filename.js', 'filename1.js','filename2.js'])
    .pipe(sourcemaps.init()) // Site map init
    .pipe(concat('main.js')) // Files concatination
    .pipe(babel({presets: [["@babel/preset-env"]]})) // Transform ES6 into ES5
    .pipe(gulp.dest('dest/js'))
    .pipe(browserSync.reload({stream: true})) // Update images after change
});

// IMG task
gulp.task('images', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({ // Minify images
      progressive: true,
      optimizationLevel: 3
    }))
    .pipe(gulp.dest('dest/img'))
    .pipe(imagewebp({
      quality: 70
    }))
    .pipe(gulp.dest('dest/img'))
    .pipe(browserSync.reload({stream: true})) // Update images after change
});

// Fonts
gulp.task('ttf2woff', function () { // Convert ttf to woff
  return gulp.src(path.src.fonts_ttf)
    .pipe(ttf2woff())
    .pipe(gulp.dest('dest/fonts'))
});
gulp.task('ttf2woff2', function () { // Convert ttf to woff2
  return gulp.src(path.src.fonts_ttf)
    .pipe(ttf2woff2())
    .pipe(gulp.dest('dest/fonts'))
});
gulp.task('woff2', function () { // Move woff from app to dest
  return gulp.src(path.src.fonts_woff)
    .pipe(gulp.dest('dest/fonts'))
});

// Browser Sync task
gulp.task('browser-sync', function () {
  browserSync({
    server: { // Set server parameters
      baseDir: 'dest' // Server directory - app
    },
    notify: false // Notification off
    // online: false, // Work offline without internet
    // tunnel: true, tunnel: 'projectname' // Demonstration page: http://projectname.localtunnel.me
  });
});

// Watchers
gulp.task('watch', function () {
  // gulp.watch(path.watch.pug, gulp.parallel('pug')); // Watch Pug files
  gulp.watch(path.watch.html, gulp.parallel('html')); // Watch HTML files
  gulp.watch(path.watch.scss, gulp.parallel('sass')); // Watch SASS files
  gulp.watch(path.watch.js, gulp.parallel('js')); // Watch JS files
  gulp.watch(path.watch.img, gulp.parallel('images')); // Watch image files
});

// Run tasks
gulp.task('fonts', gulp.parallel('ttf2woff', 'ttf2woff2', 'woff2')); // Convert and move fonts to dest before run gulp

gulp.task('compile', gulp.parallel('html', 'sass', 'js', 'images')); // Run with HTML
// gulp.task('compile', gulp.parallel('pug', 'sass', 'js', 'images')); // Run with Pug

gulp.task('watch-changes', gulp.parallel('browser-sync', 'watch'));

gulp.task('default', gulp.series('compile', 'watch-changes')); // Default task for run gulp


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
