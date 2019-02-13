// ---------- Configurations for your custom build of open pixel ---------- //

// This is the header comment that will be included at the top of the "dist/openpixel.js" file
var HEADER_COMMENT     = process.env.OPIX_HEADER_COMMENT || '// Open Pixel v1.0.2 | Published By Dockwa | Created By Stuart Yamartino | MIT License\n';

// This is where the compiled snippet and openpixel.js files will be dropped
var DESTINATION_FOLDER = process.env.OPIX_DESTINATION_FOLDER || './dist';

// The name of the global function and the cookie prefix that will be included in the snippet and is the client to fire off custom events
var PIXEL_FUNC_NAME    = process.env.OPIX_PIXEL_FUNC_NAME || 'opix';

// The remote URL of the pixel.gif file that will be pinged by the browser to send tracking information
var PIXEL_ENDPOINT     = process.env.OPIX_PIXEL_ENDPOINT || 'https://tracker.example.com/pixel.gif';

// The core openpixel.min.js file that the snippet will loaded asynchronously into the browser
var JS_ENDPOINT        = process.env.OPIX_JS_ENDPOINT || 'https://static.example.com/v1/openpixel.js';

// The current version of your openpixel configuration
var VERSION            = process.env.OPIX_VERSION || '1';

// ------------------------------------------------------------------------//


// include plug-ins
var gulp   = require('gulp');
var concat = require('gulp-concat');
var iife   = require('gulp-iife');
var inject = require('gulp-inject-string');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babel  = require('gulp-babel');

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
  .pipe(babel())
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
gulp.task('default', function() {
  gulp.start('openpixel', 'snippet');
});
