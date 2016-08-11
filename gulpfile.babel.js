'use strict';

const fs           = require('fs');
const gulp         = require('gulp');
const rimraf       = require('rimraf');
const uglify       = require('gulp-uglify');
const runSequence  = require('run-sequence');
const plumber      = require('gulp-plumber');
const data         = require('gulp-data');
const sitemap      = require('gulp-sitemap');

// pug
const pug          = require('gulp-pug');

// css (sass)
const sass         = require('gulp-sass');
const csscomb      = require('gulp-csscomb');
const pleeease     = require('gulp-pleeease');

// image
const imagemin     = require('gulp-imagemin');

// html hint
const htmlhint     = require('gulp-htmlhint');

// git
const git          = require('gulp-git');

// minimist
const argv         = require('minimist')(process.argv.slice(2));

// cached
const cached       = require('gulp-cached');

// gulpssh
const gulpssh      = require('gulp-ssh');

// =============================================
// CONFIG
//
const CONFIG = require('./config.js');

let IS_PROD = false;

const gulpBabel = require('./options/gulp-babel.js')
const browserSync = require('./options/browser-sync.js')

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
    rimraf(CONFIG.path.dist + '/' + distFile, (callBack) => {
      runGulpTask(event, filename);
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
    return runSequence('pleeease');
  }

  if( /(\.(jpg|jpeg|png|gif|svg))$/.test(filename) ) {
    return runSequence('imagemin');
  }

  runSequence('copy');
};

// =============================================
// browser-sync
//
gulp.task('browser-sync', browserSync)

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
    .pipe(cached('pleeease'))
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
    .pipe(cached('imagemin'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(imagemin(CONFIG.imagemin.plugins, CONFIG.imagemin.verbose))
    .pipe(gulp.dest(CONFIG.path.dist))
  );
});

// =============================================
// babel
//
gulp.task('babel', gulpBabel);

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
  }
  IS_PROD = true;
  deploy();
});
