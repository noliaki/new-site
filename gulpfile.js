// =============================================
// gulp | plug-in
//
const gulp         = require('gulp'),
      jade         = require('gulp-jade'),
      sass         = require('gulp-sass'),
      csscomb      = require('gulp-csscomb'),
      autoprefixer = require('gulp-autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      pngquant     = require('imagemin-pngquant'),
      rimraf       = require('rimraf'),
      babel        = require('gulp-babel'),
      plumber      = require('gulp-plumber'),
      runSequence  = require('run-sequence'),
      uglify       = require('gulp-uglify'),
      browserSync  = require('browser-sync').create();

// =============================================
// path
//
const path = {
  src   : './src',
  build : './build'
};

// =============================================
// prefix option
//
const autoprefixerOpt = {
  browsers: [
    '> 1% in JP',
    'last 2 versions',
    'ie >= 7',
    'last 2 Firefox versions'
  ]
};

// =============================================
// browser-sync
//
gulp.task('browser-sync', () => {
  browserSync.init({
    server : {
      baseDir : path.build
    }
  });
});

// =============================================
// jade
//
gulp.task('jade', () => {
  return gulp.src([path.src + '/**/*.jade', '!' + path.src + '/**/_*'])
    .pipe(plumber())
    .pipe(jade({
      pretty  : true,
      basedir : path.src
    }))
    .pipe(gulp.dest(path.build))
    .pipe(browserSync.stream());
 });

 // =============================================
 // csscomb
 //
 gulp.task('csscomb', () => {
   return gulp.src([
       path.src + '/**/*.css',
       path.src + '/**/*.scss',
       '!' + path.src + '/**/_variables.scss'
     ])
     .pipe(plumber())
     .pipe(csscomb())
     .pipe(gulp.dest(path.src));
  });

// =============================================
// sass
//
gulp.task('sass', ['csscomb'], () => {
  return gulp.src([path.src + '/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .on('error', (error) => {
      console.error('Error!', error.message)
    })
    .pipe(autoprefixer(autoprefixerOpt))
    .pipe(gulp.dest(path.build))
    .pipe(browserSync.stream());
 });

// =============================================
// prefix-css
//
gulp.task('prefix-css', () => {
  return gulp.src([path.src + '/**/*.css'])
    .pipe(plumber())
    .pipe(autoprefixer(autoprefixerOpt))
    .pipe(gulp.dest(path.build))
    .pipe(browserSync.stream());
 });

// =============================================
// image min
//
gulp.task('imagemin', () => {
  return gulp.src([path.src + '/**/*.+(jpg|jpeg|png|gif|svg)'])
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(path.build));
});

// =============================================
// babel
//
gulp.task('babel', () => {
  return gulp.src([path.src + '/**/*.js'])
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', (error) => {
      console.error('Error!', error.message);
    })
    .pipe(gulp.dest(path.build))
    .pipe(browserSync.stream());
});

// =============================================
// copy
//
gulp.task('copy', () => {
  return gulp.src([
      path.src + '/**/*',
      '!' + path.src + '/**/*.jade',
      '!' + path.src + '/**/*.js',
      '!' + path.src + '/**/*.+(jpg|jpeg|png|gif|svg)',
      '!' + path.src + '/**/*.scss',
      '!' + path.src + '/**/*.css',
      '!' + path.src + '/_*/',
      '!' + path.src + '/**/_*'
    ])
    .pipe(gulp.dest(path.build));
});

// =============================================
// clean dir
//
gulp.task('clean', (callBack) => {
  rimraf(path.build, callBack);
});

// =============================================
// gulp default task
//
gulp.task('default', () => {
  runSequence(
    'clean',
    'prefix-css',
    ['copy', 'jade', 'sass', 'imagemin', 'babel'],
    'browser-sync'
  );

  gulp.watch([path.src + '/**/*.jade'], ['jade']);
  gulp.watch([path.src + '/**/*.js'], ['babel']);
  gulp.watch([path.src + '/**/*.scss'], ['sass']);
  gulp.watch([path.src + '/**/*.css'], ['prefix-css']);
  gulp.watch([path.src + '/**/*.html'], ['copy']);
});

// =============================================
// gulp build
//
gulp.task('build', (callBack) => {
  runSequence(
    'clean',
    'prefix-css',
    ['copy', 'jade', 'sass', 'imagemin', 'babel'],
    callBack
  );
});
