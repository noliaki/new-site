'use strict';

const gulp         = require('gulp');
const rimraf       = require('rimraf');
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

// cached
const cached       = require('gulp-cached');

// watch
const watch        = require('gulp-watch')

// =============================================
// CONFIG
//
const CONFIG = require('./config.js');

const filePath = {
  pug: [
    CONFIG.path.src + '/**/*.pug',
    '!' + CONFIG.path.src + '/_*/',
    '!' + CONFIG.path.src + '/**/_*'
  ],
  csscomb: [
    CONFIG.path.src + '/**/*.css' ,
    CONFIG.path.src + '/**/*.scss',
    '!' + CONFIG.path.src + '/**/_variables.scss'
  ],
  sass: [
    CONFIG.path.src + '/**/*.scss'
  ],
  autoprefixer: [
    CONFIG.path.src + '/**/*.css'
  ],
  imagemin: [
    CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
    '!' + CONFIG.path.src + '/**/*-no-compress.+(jpg|jpeg|png|gif|svg)'
  ],
  babel: [
    CONFIG.path.src + '/**/*.js',
    '!' + CONFIG.path.src + '/**/*.min.js'
  ],
  copyExceptedFiles: [
    CONFIG.path.src + '/**/*-no-compress.+(jpg|jpeg|png|gif|svg)',
    CONFIG.path.src + '/**/*.min.js'
  ],
  copy: [
    CONFIG.path.src + '/**/*'                              ,
    '!' + CONFIG.path.src + '/**/*.pug'                    ,
    '!' + CONFIG.path.src + '/**/*.js'                     ,
    '!' + CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
    '!' + CONFIG.path.src + '/**/*.scss'                   ,
    '!' + CONFIG.path.src + '/**/*.css'                    ,
    '!' + CONFIG.path.src + '/_*/'                         ,
    '!' + CONFIG.path.src + '/**/_*'
  ]
}

let IS_PROD = false;

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
    gulp.src(filePath.pug)
    // .pipe(cached('pug'))
    // .pipe(watch(filePath))
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
    gulp.src(filePath.csscomb)
    // .pipe(cached('csscomb'))
    // .pipe(watch(filePath))
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
    gulp.src(filePath.sass)
    // .pipe(cached('sass'))
    // .pipe(watch(filePath))
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
    gulp.src(filePath.autoprefixer)
    // .pipe(cached('autoprefixer'))
    // .pipe(watch(filePath))
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
    gulp.src(filePath.imagemin)
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
    gulp.src(filePath.babel)
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
    gulp.src(filePath.copyExceptedFiles)
    .pipe(cached('copy-excepted-files'))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

gulp.task('copy', ['copy-excepted-files'], () => {
  return (
    gulp.src(filePath.copy)
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
// watch
//
gulp.task('watch', () => {
  watch(filePath.pug, () => {
    runSequence('pug')
  })

  watch(filePath.csscomb, () => {
    runSequence('csscomb')
  })

  watch(filePath.sass, () => {
    runSequence('sass')
  })

  watch(filePath.autoprefixer, () => {
    runSequence('autoprefixer')
  })

  watch(filePath.imagemin, () => {
    runSequence('imagemin')
  })

  watch(filePath.babel, () => {
    runSequence('babel')
  })

  watch(filePath.copyExceptedFiles, () => {
    runSequence('copy-excepted-files')
  })

  watch(filePath.copy, () => {
    runSequence('copy')
  })
})

// =============================================
// gulp default task
//
gulp.task('default', ['build'], () => {
  runSequence(
    'browser-sync',
    // 'html-hint'
    'watch'
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
    callBack
  );
});
