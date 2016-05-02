// =============================================
// gulp | plug-in
//

// common
const gulp         = require('gulp');
const rimraf       = require('rimraf');
const uglify       = require('gulp-uglify');
const runSequence  = require('run-sequence');
const plumber      = require('gulp-plumber');
const data         = require('gulp-data');
const browserSync  = require('browser-sync').create();

// pug
const pug          = require('gulp-pug');

// css (sass)
const sass         = require('gulp-sass');
const csscomb      = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');

// image
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');

// js
const babel        = require('gulp-babel');


// =============================================
// config
//
const config = require('./config.js');


// =============================================
// browser-sync
//
gulp.task('browser-sync', () => {
  browserSync.init(config.browserSync);
});

// =============================================
// pug
//
gulp.task('pug', () => {
  return gulp.src([
      config.path.src + '/**/*.pug',
      '!' + config.path.src + '/**/_*'
    ])
    .pipe(plumber())
    .pipe(data(config.data))
    .pipe(pug(config.pug))
    .pipe(gulp.dest(config.path.dist))
    .pipe(browserSync.stream());
 });

 // =============================================
 // csscomb
 //
 gulp.task('csscomb', () => {
   return gulp.src([
       config.path.src + '/**/*.css' ,
       config.path.src + '/**/*.scss',
       '!' + config.path.src + '/**/_variables.scss'
     ])
     .pipe(plumber())
     .pipe(csscomb())
     .pipe(gulp.dest(config.path.src));
  });

// =============================================
// sass
//
gulp.task('sass', ['csscomb'], () => {
  return gulp.src([
      config.path.src + '/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass(config.sass))
    .on('error', (error) => {
      console.error('Error!', error.message)
    })
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.path.dist))
    .pipe(browserSync.stream());
 });

// =============================================
// prefix-css
//
gulp.task('prefix-css', () => {
  return gulp.src([
      config.path.src + '/**/*.css'
    ])
    .pipe(plumber())
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.path.dist))
    .pipe(browserSync.stream());
 });

// =============================================
// image min
//
gulp.task('imagemin', () => {
  return gulp.src([
      config.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)'
    ])
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.path.dist));
});

// =============================================
// babel
//
gulp.task('babel', () => {
  return gulp.src([
      config.path.src + '/**/*.js'
    ])
    .pipe(plumber())
    .pipe(babel(config.babel))
    .on('error', (error) => {
      console.error('Error!', error.message);
    })
    .pipe(gulp.dest(config.path.dist))
    .pipe(browserSync.stream());
});

// =============================================
// copy
//
gulp.task('copy', () => {
  return gulp.src([
      config.path.src + '/**/*'                              ,
      '!' + config.path.src + '/**/*.pug'                    ,
      '!' + config.path.src + '/**/*.js'                     ,
      '!' + config.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
      '!' + config.path.src + '/**/*.scss'                   ,
      '!' + config.path.src + '/**/*.css'                    ,
      '!' + config.path.src + '/_*/'                         ,
      '!' + config.path.src + '/**/_*'
    ])
    .pipe(gulp.dest(config.path.dist));
});

// =============================================
// clean dir
//
gulp.task('clean', (callBack) => {
  rimraf(config.path.dist, callBack);
});

// =============================================
// gulp default task
//
gulp.task('default', () => {
  runSequence(
    'clean'     ,
    'prefix-css',
    ['copy', 'pug', 'sass', 'imagemin', 'babel'],
    'browser-sync'
  );

  gulp.watch([config.path.src + '/**/*.pug'] , ['pug']);
  gulp.watch([config.path.src + '/**/*.js']  , ['babel']);
  gulp.watch([config.path.src + '/**/*.scss'], ['sass']);
  gulp.watch([config.path.src + '/**/*.css'] , ['prefix-css']);
  gulp.watch([config.path.src + '/**/*.html'], ['copy']);
});

// =============================================
// gulp build
//
gulp.task('build', (callBack) => {
  runSequence(
    'clean'     ,
    'prefix-css',
    ['copy', 'pug', 'sass', 'imagemin', 'babel'],
    callBack
  );
});
