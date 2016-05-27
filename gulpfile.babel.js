// common
const gulp         = require('gulp');
const rimraf       = require('rimraf');
const uglify       = require('gulp-uglify');
const runSequence  = require('run-sequence');
const plumber      = require('gulp-plumber');
const data         = require('gulp-data');
const sitemap      = require('gulp-sitemap');
const browserSync  = require('browser-sync').create();

// pug
const pug          = require('gulp-pug');

// css (sass)
const sass         = require('gulp-sass');
const csscomb      = require('gulp-csscomb');
const pleeease     = require('gulp-pleeease');

// image
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');

// js
const babel        = require('gulp-babel');

// html hint
const htmlhint     = require('gulp-htmlhint');


// =============================================
// CONFIG
//
const CONFIG = require('./config.js');


// =============================================
// browser-sync
//
gulp.task('browser-sync', () => {
  browserSync.init(CONFIG.browserSync);
});

// =============================================
// pug
//
gulp.task('pug', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.pug',
      '!' + CONFIG.path.src + '/**/_*'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(data(CONFIG.data))
    .pipe(pug(CONFIG.pug))
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
});

 // =============================================
 // csscomb
 //
gulp.task('csscomb', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.css' ,
      CONFIG.path.src + '/**/*.scss',
      '!' + CONFIG.path.src + '/**/_variables.scss'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(csscomb())
    .pipe(gulp.dest(CONFIG.path.src))
  );
});

// =============================================
// sass
//
gulp.task('sass', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.scss'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(sass(CONFIG.sass).on('error', sass.logError))
    .pipe(pleeease(CONFIG.pleeease))
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
});

// =============================================
// pleeease
//
gulp.task('pleeease', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.css'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(pleeease(CONFIG.pleeease))
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
});

// =============================================
// image min
//
gulp.task('imagemin', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(imagemin(CONFIG.imagemin))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// babel
//
gulp.task('babel', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.js',
      '!' + CONFIG.path.src + '/**/_*',
      '!' + CONFIG.path.src + '/_*/'
    ])
    .pipe(plumber(CONFIG.plumber))
    .pipe(babel(CONFIG.babel))
    .on('error', (error) => {
      console.error('Error!', error.message);
    })
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
});

// =============================================
// copy
//
gulp.task('copy', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*'                              ,
      '!' + CONFIG.path.src + '/**/*.pug'                    ,
      '!' + CONFIG.path.src + '/**/*.js'                     ,
      '!' + CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
      '!' + CONFIG.path.src + '/**/*.scss'                   ,
      '!' + CONFIG.path.src + '/**/*.css'                    ,
      '!' + CONFIG.path.src + '/_*/'                         ,
      '!' + CONFIG.path.src + '/**/_*'
    ])
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// export-html
//
gulp.task('export-html', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.html'
    ])
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// sitemap
//
gulp.task('sitemap', () => {
  return (
    gulp.src(CONFIG.path.dist + '/**/*.html')
    .pipe(sitemap({
      siteUrl: '//' + CONFIG.SITE_INFO.domain,
      spacing: '  '
    }))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// clean dir
//
gulp.task('clean', (callBack) => {
  rimraf(CONFIG.path.dist, callBack);
});

// =============================================
// html hint
//
gulp.task('html-hint', () => {
  return (
    gulp.src(CONFIG.path.dist + '/**/*.html')
    .pipe(plumber(CONFIG.plumber))
    .pipe(htmlhint(CONFIG.htmlhint))
    .pipe(htmlhint.failReporter())
  );
});

// =============================================
// gulp default task
//
gulp.task('default', () => {
  runSequence(
    'clean'     ,
    'pleeease',
    ['copy', 'pug', 'sass', 'imagemin', 'babel'],
    'browser-sync',
    'html-hint'
  );

  gulp.watch([CONFIG.path.src + '/**/*.pug'], () => {
    runSequence(
      'pug',
      'html-hint'
    );
  });
  gulp.watch([CONFIG.path.src + '/**/*.html'], () => {
    runSequence(
      'export-html',
      'html-hint'
    );
  });
  gulp.watch([CONFIG.path.src + '/**/*.js']  , ['babel']);
  gulp.watch([CONFIG.path.src + '/**/*.scss'], ['sass']);
  gulp.watch([CONFIG.path.src + '/**/*.css'] , ['pleeease']);
});

// =============================================
// gulp build
//
gulp.task('build', (callBack) => {
  runSequence(
    'clean'    ,
    'pleeease' ,
    'csscomb'  ,
    ['copy', 'pug', 'sass', 'imagemin', 'babel'],
    'html-hint',
    'sitemap'  ,
    callBack
  );
});
