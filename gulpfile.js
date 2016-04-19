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
var PIXEL_FUNC_NAME    = 'opix';
var PIXEL_ENDPOINT     = 'http://stu.ngrok.io/pixel.gif';
var JS_ENDPOINT        = 'http://stu.ngrok.io/pixel.gif';
var VERSION            = '1';
// ------------------------------------------------------------------------//

// JS concat, strip debugging and minify
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

// JS concat, strip debugging and minify
gulp.task('snippet', function() {
  gulp.src('./src/snippet.html')
  .pipe(inject.replace('replacejsendpoint', JS_ENDPOINT))
  .pipe(inject.replace('replacefuncname', PIXEL_FUNC_NAME))
  // This will minify and rename to pressure.min.js
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION_FOLDER));
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['openpixel']);
});
