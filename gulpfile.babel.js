'use strict';

const fs           = require('fs');
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
const autoprefixer = require('gulp-autoprefixer');

// image
const imagemin     = require('gulp-imagemin');

// js
const babel        = require('gulp-babel');
const eslint       = require('gulp-eslint');

// html hint
const htmlhint     = require('gulp-htmlhint');

// minimist
const argv         = require('minimist')(process.argv.slice(2));

// cached
const cached       = require('gulp-cached');


// =============================================
// CONFIG
//
const CONFIG = require('./config.js');

let IS_PROD = false;

// =============================================
// WATCH SOURCE FILES
//
const beginWatch = () => {
  console.log('-----------------------------');
  console.log(`BEGIN WATCHING : ${CONFIG.path.src}`);
  console.log('-----------------------------');

  fs.watch(CONFIG.path.src, { recursive : true }, (event, filename) => {
    console.log(`${event} | ${filename}`);

    if (event !== 'rename') {
      return runGulpTask(event, filename);
    }

    const distFile = filename.replace(/(\.pug)$/, '.html').replace(/(\.scss)$/, '.css');
    const distFilePath  = `${CONFIG.path.dist}/${distFile}`;
    fs.exists(distFilePath, (exists) => {
      if (!exists) {
        runGulpTask(event, filename);
        return;
      }

      rimraf(CONFIG.path.dist + '/' + distFile, (callBack) => {
        runGulpTask(event, filename);
      });
    });
  });
};

// =============================================
// run gulp task when file changed
//
const runGulpTask = (event, filename) => {
  if( /(\.pug)$/.test(filename) ) {
    return runSequence(
      'pug',
      'html-hint'
    );
  }

  if( /(\.html)$/.test(filename) ) {
    return runSequence(
      'copy',
      'html-hint'
    );
  }

  if( /(\.js)$/.test(filename) ) {
    return runSequence('babel');
  }

  if( /(\.scss)$/.test(filename) ) {
    return runSequence('sass');
  }

  if( /(\.css)$/.test(filename) ) {
    return runSequence('autoprefixer');
  }

  if( /(\.(jpg|jpeg|png|gif|svg))$/.test(filename) ) {
    return runSequence('imagemin');
  }

  runSequence('copy');
};

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
      '!' + CONFIG.path.src + '/_*/',
      '!' + CONFIG.path.src + '/**/_*'
    ])
    .pipe(cached('pug'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
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
    .pipe(cached('csscomb'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
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
    .pipe(cached('sass'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(sass(CONFIG.sass).on('error', sass.logError))
    .pipe(autoprefixer(CONFIG.autoprefixer))
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
});

// =============================================
// autoprefixer
//
gulp.task('autoprefixer', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*.css'
    ])
    .pipe(cached('autoprefixer'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(autoprefixer(CONFIG.autoprefixer))
    .pipe(csscomb())
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
      CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
      '!' + CONFIG.path.src + '/**/*-no-compress.+(jpg|jpeg|png|gif|svg)'
    ])
    .pipe(cached('imagemin'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(imagemin(CONFIG.imagemin.plugins, CONFIG.imagemin.verbose))
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
      '!' + CONFIG.path.src + '/**/*.min.js'
    ])
    .pipe(cached('babel'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(eslint(CONFIG.eslint))
    .pipe(eslint.format())
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
gulp.task('copy-excepted-files', () => {
  return (
    gulp.src([
      CONFIG.path.src + '/**/*-no-compress.+(jpg|jpeg|png|gif|svg)',
      CONFIG.path.src + '/**/*.min.js'
    ])
    .pipe(cached('copy-excepted-files'))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

gulp.task('copy', ['copy-excepted-files'], () => {
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
    .pipe(cached('copy'))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// sitemap
//
gulp.task('sitemap', () => {
  return (
    gulp.src(CONFIG.path.dist + '/**/*.html')
    .pipe(sitemap(CONFIG.sitemap))
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
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(htmlhint(CONFIG.htmlhint))
    .pipe(htmlhint.reporter())
  );
});

// =============================================
// gulp default task
//
gulp.task('default', ['build'], () => {
  runSequence(
    'browser-sync',
    'html-hint',
    beginWatch
  );
});

// =============================================
// gulp build
//
gulp.task('build', (callBack) => {
  runSequence(
    'clean'    ,
    'autoprefixer' ,
    'csscomb'  ,
    ['copy', 'pug', 'sass', 'imagemin', 'babel'],
    'html-hint',
    'sitemap'  ,
    callBack
  );
});
