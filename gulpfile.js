// include plug-ins
var gulp   = require('gulp');
var concat = require('gulp-concat');
var iife   = require("gulp-iife");
var inject = require('gulp-inject-string')
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babel  = require('gulp-babel');

// ---------- Configurations for your custom build of open pixel ---------- //
var HEADER_COMMENT     = '// Open Pixel v1.0.0 | Published By Dockwa, Inc. | Created By Stuart Yamartino | MIT License\n';
var DESTINATION_FOLDER = './dist';
var PIXEL_FUNC_NAME    = 'dckw';
var PIXEL_ENDPOINT     = 'https://tracker.dockwa.com/pixel.gif';
var JS_ENDPOINT        = 'https://static.dockwa-analytics.net/v1/openpixel.js';
var VERSION            = '1';
// ------------------------------------------------------------------------//

// ---- Compile openpixel.js and openpixel.min.js files ---- //
gulp.task('openpixel', function() {
  gulp.src([
    './src/config.js',
    './src/helpers.js',
    './src/browser.js',
    './src/cookie.js',
    './src/url.js',
    './src/pixel.js',
    './src/setup.js',
  ])
  .pipe(concat('openpixel.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(iife({
    useStrict: false,
    params: ['window', 'document', 'pixelFunc', 'pixelFuncName', 'pixelEndpoint', 'versionNumber'],
    args: ['window', 'document', 'window["'+PIXEL_FUNC_NAME+'"]', '"'+PIXEL_FUNC_NAME+'"', '"'+PIXEL_ENDPOINT+'"', VERSION]
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION_FOLDER))
  // This will minify and rename to openpixel.min.js
  .pipe(uglify())
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION_FOLDER));
});


// ---- Compile snippet.html file ---- //
gulp.task('snippet', function() {
  gulp.src('./src/snippet.js')
  .pipe(inject.replace('js_url', JS_ENDPOINT))
  .pipe(inject.replace('opix_func', PIXEL_FUNC_NAME))
  // This will minify and rename to pressure.min.js
  .pipe(uglify())
  .pipe(inject.prepend('<!-- Start Open Pixel Snippet -->\n<script>\n'))
  .pipe(inject.append('\n</script>\n<!-- End Open Pixel Snippet -->'))
  .pipe(rename({ extname: '.html' }))
  .pipe(gulp.dest(DESTINATION_FOLDER));
});

// watch files and run gulp
gulp.task('watch', function() {
  gulp.watch('src/*', ['openpixel', 'snippet']);
});

// run all tasks once
gulp.task('run', function() {
  gulp.start('openpixel', 'snippet');
})
