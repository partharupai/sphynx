/**
 * Require dependencies
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var scsslint = require('gulp-scss-lint');
var coffeelint = require('gulp-coffeelint');
var phpcs = require('gulp-phpcs');
var livereload = require('gulp-livereload');

/**
 * Compile Sass
 */
gulp.task('sass', function() {
  gulp.src('assets/styles/**/*.scss')
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
  gulp.src('assets/scripts/**/*.coffee')
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(gulp.dest('assets/scripts/output/'))
  .pipe(livereload())
});

/**
 * LINT CoffeeScript
 */
gulp.task('coffeelint', function () {
  gulp.src('assets/scripts/**/*.coffee')
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
});

/**
 * LINT PHP
 */
gulp.task('phpcs', function() {
  gulp.src(['**/*.php', '!vendor/**/*.*', '!node_modules/**/*.*'])
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
var welcomeMessage = function() {
  console.log('                                 ');
  console.log('            ________             ');
  console.log('           //   |\\ \\\\            ');
  console.log('          //    | \\ \\\\           ');
  console.log('    |\\\\  //     |  \\ \\\\  //|     ');
  console.log('    ||\\\\//       —-—  \\\\//||     ');
  console.log('    || \\/______________\\/ ||     ');
  console.log('    ||                    ||     ');
  console.log('    ||                    ||     ');
  console.log('    ||    ( )      ( )    ||     ');
  console.log('    ||        ____        ||     ');
  console.log('    ||        \\  /        ||     ');
  console.log('    ||         ||         ||     ');
  console.log('    ||     \\__/  \\__/     ||     ');
  console.log('    ||                    ||     ');
  console.log('    ||                    ||     ');
  console.log('                                 ');
  console.log('  #   #  ###  #     #      ###   ');
  console.log('  #   # #   # #     #     #   #  ');
  console.log('  ##### ##### #     #     #   #  ');
  console.log('  #   # #   # #     #     #   #  ');
  console.log('  #   # #   # ##### #####  ###   ');
  console.log('                                 ');
};

/**
 * Watch
 */
gulp.task('default',function() {
  welcomeMessage();
  gulp.watch('assets/styles/**/*.scss',['sass']);
  gulp.watch('assets/scripts/**/*.coffee',['coffee', 'coffeelint']);
  gulp.watch(['**/*.php', '!vendor/**/*.*', '!node_modules/**/*.*'],['phpcs']);
  livereload.listen();
});
