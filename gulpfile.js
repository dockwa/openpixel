// include plug-ins
var gulp   = require('gulp');
var concat = require('gulp-concat');
var iife   = require("gulp-iife");
var inject = require('gulp-inject-string')
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babel  = require('gulp-babel');

var HEADER_COMMENT = '// Open Pixel v1.0.0 | Created By Stuart Yamartino | MIT License | Copyright (c) 2016 Dockwa, Inc.\n';
var DESTINATION = '.';
var PIXELFUNCNAME = 'opix';
var PIXELENDPOINT = 'http://stu.ngrok.io/pixel.gif';

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
    params: ['window', 'document', 'pixelFunc', 'pixelFuncName', 'pixelEndpoint'],
    args: ['window', 'document', 'window["'+PIXELFUNCNAME+'"]', '"'+PIXELFUNCNAME+'"', '"'+PIXELENDPOINT+'"']
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION))

  // This will minify and rename to pressure.min.js
  .pipe(uglify())
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION));
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['openpixel']);
});
