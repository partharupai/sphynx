"use strict"

/**
 * Require dependencies
 */
var gulp = require('gulp'),
    cache = require('gulp-cached'),
    beep = require('beepbeep'),
    colors = require('colors'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    rimraf = require('gulp-rimraf'),

    // Sass
    scsslint = require('gulp-scss-lint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minify = require('gulp-minify-css'),
    cssBase64 = require('gulp-css-base64'),
    
    // Coffee
    coffeelint = require('gulp-coffeelint'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    // PHP
    phplint = require('phplint').lint,
    phpcs = require('gulp-phpcs');

/**
 * Setup files to watch
 */
var files = {
  sass: 'assets/styles/**/*.scss',
  coffee: 'assets/scripts/**/*.coffee',
  php: ['**/*.php', '!vendor/**/*.*', '!node_modules/**/*.*']
};

/**
 * Error handling
 */
var gulp_src = gulp.src;

gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
  .pipe(plumber(function(error) {
    beep();
  }));
}

/**
 * Lint Sass
 */
gulp.task('scsslint', function(cb) {
  return gulp.src(files.sass)
  // Lint
  .pipe(scsslint({
    'config': 'config/lint/scss.yml'
  }))

  // Make the reporter fail task on error
  .pipe(scsslint.failReporter())
});

/**
 * Compile Sass
 */
gulp.task('sass', ['scsslint'], function() {
  return gulp.src(files.sass)

  // Don't stop watch on error (just log it)
  .pipe(sass().on('error', sass.logError))

  // Autoprefixer
  .pipe(autoprefixer())

  // Minify
  .pipe(rename({suffix: '.min'}))
  .pipe(minify())

  // Write output
  .pipe(gulp.dest('assets/styles/output/'))
});

/**
 * Copy Fancybox assets
 */
gulp.task('copy-fancybox-assets', ['sass'], function() {
  return gulp.src('bower_components/fancybox/source/*.{png,gif}')
  .pipe(gulp.dest('assets/styles/output/'))
});

/**
 * Base64 images in CSS
 */
gulp.task('base64', ['copy-fancybox-assets'], function() {
  return gulp.src('assets/styles/output/*.css')
  // Base64 images
  .pipe(cssBase64())

  // Write output
  .pipe(gulp.dest('assets/styles/output/'))

  // Reload
  .pipe(livereload())
});

/**
 * Remove Fancybox assets
 */
gulp.task('remove-fancybox-assets', ['base64'], function() {
  gulp.src('assets/styles/output/*.{png,gif}')
  .pipe(rimraf())
});

/**
 * Lint CoffeeScript
 */
gulp.task('coffeelint', function() {
  return gulp.src(files.coffee)

  // Lint
  .pipe(coffeelint())

  // Report errors
  .pipe(coffeelint.reporter())

  // Make reporter fail task on error
  .pipe(coffeelint.reporter('fail'))
});

/**
 * Compile CoffeeScript
 */
gulp.task('coffee', ['coffeelint'], function() {
  gulp.src(files.coffee)

  // Init sourcemaps
  .pipe(sourcemaps.init())

  // Compile
  .pipe(coffee({bare: true}))

  // Concat
  .pipe(concat('all.js'))

  // Uglify
  .pipe(uglify())

  // Write sourcemaps
  .pipe(sourcemaps.write('.'))

  // Write output
  .pipe(gulp.dest('assets/scripts/output/'))

  // Reload
  .pipe(livereload())
});

/**
 * Lint PHP
 */
gulp.task('phplint', function(cb) {
  phplint(files.php, {limit: 10}, function(err, stdout, stderr) {
    if(err) {
      cb(err);
      beep();
    } else {
      cb();
    }
  })
});

/**
 * PHP CodeSniffer (PSR)
 */
gulp.task('phpcs', ['phplint'], function() {
  gulp.src(files.php)

  // Use cache to filter out unmodified files
  .pipe(cache('phpcs'))

  // Sniff code
  .pipe(phpcs({
    bin: '~/.composer/vendor/bin/phpcs',
    standard: 'PSR2',
    warningSeverity: 0
  }))

  // Log errors and fail afterwards
  .pipe(phpcs.reporter('log'))
  .pipe(phpcs.reporter('fail'))

  // Reload
  .pipe(livereload())
});

/**
 * Welcome message
 */
var welcomeMessage = [
  '',
  '',
  '                     ________',
  '                    //   |\\ \\\\',
  '                   //    | \\ \\\\',
  '             |\\\\  //     |  \\ \\\\  //|',
  '             ||\\\\//       —-—  \\\\//||',
  '             || \\/______________\\/ ||',
  '             ||                    ||',
  '             ||                    ||',
  '             ||    ( )      ( )    ||',
  '             ||        ____        ||',
  '             ||        \\  /        ||',
  '             ||         ||         ||',
  '             ||     \\__/  \\__/     ||',
  '             ||                    ||',
  '             ||                    ||',
  '',
  '',
  ' $$\\   $$\\  $$$$$$\\  $$\\       $$\\       $$$$$$\\',
  ' $$ |  $$ |$$  __$$\\ $$ |      $$ |     $$  __$$\\',
  ' $$ |  $$ |$$ /  $$ |$$ |      $$ |     $$ /  $$ |',
  ' $$$$$$$$ |$$$$$$$$ |$$ |      $$ |     $$ |  $$ |',
  ' $$  __$$ |$$  __$$ |$$ |      $$ |     $$ |  $$ |',
  ' $$ |  $$ |$$ |  $$ |$$ |      $$ |     $$ |  $$ |',
  ' $$ |  $$ |$$ |  $$ |$$$$$$$$\\ $$$$$$$$\\ $$$$$$  |',
  ' \\__|  \\__|\\__|  \\__|\\________|\\________|\\______/',
  '',
  ''
].join("\n");

/**
 * Watch
 */
gulp.task('default', function() {
  console.log(welcomeMessage.cyan);
  gulp.watch(files.sass, ['scsslint', 'sass', 'copy-fancybox-assets', 'base64', 'remove-fancybox-assets']);
  gulp.watch(files.coffee, ['coffeelint', 'coffee']);
  gulp.watch(files.php, ['phplint', 'phpcs']);
  livereload.listen();
  beep([0, 250, 150, 150, 250, 600, 250]);
});
