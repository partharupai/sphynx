"use strict"

/**
 * Require dependencies
 */
var gulp = require('gulp');
var cache = require('gulp-cached');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var coffeelint = require('gulp-coffeelint');
var phplint = require('phplint').lint;
var phpcs = require('gulp-phpcs');
var livereload = require('gulp-livereload');

/**
 * Setup files to watch
 */
var files = {
  sass: 'assets/styles/**/*.scss',
  coffee: 'assets/scripts/**/*.coffee',
  php: ['**/*.php', '!vendor/**/*.*', '!node_modules/**/*.*']
};

/**
 * Compile Sass
 */
gulp.task('sass', function() {
  gulp.src(files.sass)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('/'))
  .pipe(gulp.dest('assets/styles/output/'))
  .pipe(livereload())
});

/**
 * Compile CoffeeScript
 */
gulp.task('coffee', function() {
  gulp.src(files.coffee)
  .pipe(cache('coffee'))
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
  .pipe(coffeelint.reporter('fail'))
  .on('error', function(error) {
    this.end();
  })
  .pipe(sourcemaps.init())
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('assets/scripts/output/'))
  .pipe(livereload())
});

/**
 * Lint PHP
 */
gulp.task('phplint', function(cb) {
  phplint(files.php, {limit: 10}, function(err, stdout, stderr) {
    if (err) {
      cb(err);
      gutil.beep();
    } else {
      cb();
    }
  })
});

/**
 * PHP CodeSniffer (PSR)
 */
gulp.task('phpcs', function() {
  gulp.src(files.php)
  .pipe(cache('phpcs'))
  .pipe(phpcs({
    bin: '~/.composer/vendor/bin/phpcs',
    standard: 'PSR2',
    warningSeverity: 0
  }))
  .pipe(phpcs.reporter('log'))
  .pipe(livereload())
});

/**
 * Welcome message
 */
var welcomeMessage = [
  '',
  '',
  '                    ________',
  '                   //   |\\ \\\\',
  '                  //    | \\ \\\\',
  '            |\\\\  //     |  \\ \\\\  //|',
  '            ||\\\\//       —-—  \\\\//||',
  '            || \\/______________\\/ ||',
  '            ||                    ||',
  '            ||                    ||',
  '            ||    ( )      ( )    ||',
  '            ||        ____        ||',
  '            ||        \\  /        ||',
  '            ||         ||         ||',
  '            ||     \\__/  \\__/     ||',
  '            ||                    ||',
  '            ||                    ||',
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
  gutil.log(gutil.colors.cyan(welcomeMessage));
  gulp.watch(files.sass, ['sass']);
  gulp.watch(files.coffee, ['coffee']);
  gulp.watch(files.php, ['phplint', 'phpcs']);
  livereload.listen();
});
