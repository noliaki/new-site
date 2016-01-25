// =============================================
// gulp | plug-in
// 
var gulp        = require('gulp'),
    jade        = require('gulp-jade'),
    sass        = require('gulp-sass'),
    cssnext     = require('gulp-cssnext'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    babel       = require('gulp-babel'),
    plumber     = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    uglify      = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

// =============================================
// path
// 
var path = {
  src   : './src',
  build : './build'
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
        pretty: true,
        basedir: path.src
      }))
      .pipe(gulp.dest(path.build))
      .pipe(browserSync.stream());
 });

// =============================================
// sass
// 
gulp.task('sass', () => {
  return gulp.src([path.src + '/**/*.scss'])
      .pipe(plumber())
      .pipe(sass())
      .on('error', (error) => {
        console.error('Error!', error.message)
      })
      .pipe(cssnext({
        browsers : '> 1% in JP, last 2 versions, ie >= 7, last 2 Firefox versions'
      }))
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
    ['copy', 'jade', 'sass', 'imagemin', 'babel'],
    'browser-sync'
  );

  gulp.watch([path.src + '/**/*.jade'], ['jade']);
  gulp.watch([path.src + '/**/*.js'], ['babel']);
  gulp.watch([path.src + '/**/*.scss'], ['sass']);
  gulp.watch([path.src + '/**/*.html', path.src + '/**/*.css'], ['copy']);
});

// =============================================
// gulp build
//
gulp.task('build', (callBack) => {
  runSequence(
    'clean',
    ['copy', 'jade', 'sass', 'imagemin', 'babel'],
    callBack
  );
});
