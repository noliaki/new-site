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
const pleeease     = require('gulp-pleeease');

// image
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');

// js
const babel        = require('gulp-babel');
const eslint       = require('gulp-eslint');

// html hint
const htmlhint     = require('gulp-htmlhint');

// git
const git          = require('gulp-git');

// minimist
const argv         = require('minimist')(process.argv.slice(2));

// gulpssh
const gulpssh      = require('gulp-ssh');

// =============================================
// CONFIG
//
const CONFIG = require('./config.js');

let IS_PROD = false;

// =============================================
// WATCH SOURCE FILES
//
const watchSourceFiles = () => {
  console.log('-----------------------------');
  console.log(`START WATCHING : ${CONFIG.path.src}`);
  console.log('-----------------------------');

  fs.watch(CONFIG.path.src, { recursive : true }, (event, filename) => {
    console.log(`${event} | ${filename}`);

    if(event === 'rename'){
      const distFile = filename.replace(/(\.pug)$/, '.html').replace(/(\.scss)$/, '.css');

      rimraf(CONFIG.path.dist + '/' + distFile, (callBack) => {
        runGulpTask(event, filename);
      });

      return;
    }
    runGulpTask(event, filename);
  });
};

// =============================================
// run gulp task when file changed
//
const runGulpTask = (event, filename) => {
  if( /(\.pug)$/.test(filename) ) {
    runSequence(
      'pug',
      'html-hint'
    );
    return;
  }

  if( /(\.html)$/.test(filename) ) {
    runSequence(
      'export-html',
      'html-hint'
    );
    return;
  }

  if( /(\.js)$/.test(filename) ) {
    runSequence('babel');
    return;
  }

  if( /(\.scss)$/.test(filename) ) {
    runSequence('sass');
    return;
  }

  if( /(\.css)$/.test(filename) ) {
    runSequence('pleeease');
    return;
  }

  if( /(\.(jpg|jpeg|png|gif|svg))$/.test(filename) ) {
    runSequence('imagemin');
    return;
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
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(sass(CONFIG.sass).on('error', sass.logError))
    .pipe(pleeease(CONFIG.pleeease))
    .pipe(csscomb())
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
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(pleeease(CONFIG.pleeease))
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
      CONFIG.path.src + '/**/*.+(jpg|jpeg|png|gif|svg)'
    ])
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
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
      '!' + CONFIG.path.src + '/_*/',
      '!' + CONFIG.path.src + '/**/_*'
    ])
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
    .pipe(htmlhint.failReporter())
  );
});

// =============================================
// gulp default task
//
gulp.task('default', ['build'], () => {
  runSequence(
    'browser-sync',
    watchSourceFiles
  );
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

// =============================================
// deploy
//
const deploy = () => {
  runSequence (
    'checkout',
    'pull',
    'dest-remote'
  );
};

gulp.task('checkout', () => {
  let branch = argv.branch || 'master';
  let version = argv.version || 'master';
  return new Promise((resolve, reject) => {
    git.checkout(IS_PROD? `refs/tags/${version}` : branch, (error) => {
      if(error) {
        throw new Error(error);
        reject();
      }
      resolve();
    });
  });
});

gulp.task('pull', () => {
  return new Promise((resolve, reject) => {
    git.pull('', '', (error) => {
      if(error) {
        throw new Error(error);
        reject();
      }
      resolve();
    });
  });
});

gulp.task('dest-remote', ['build'], () => {
  let config = IS_PROD? CONFIG.deploy.production : CONFIG.deploy.staging;
  let ssh = new gulpssh(config);
  return (
    gulp.src(CONFIG.path.dist + '/**/*')
    .pipe(ssh.dest(config.dest))
  );
});

gulp.task('deploy:staging', () => {
  deploy();
});

gulp.task('deploy:production', () => {
  if (!argv.version) {
    throw new Error('"version" is required');
    return;
  }
  IS_PROD = true;
  deploy();
});
