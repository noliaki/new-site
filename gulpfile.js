// =============================================
// gulp | plug-in
// 
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    cssnext     = require('gulp-cssnext'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    ejs         = require('gulp-ejs'),
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
}

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
// sass
// 
gulp.task('sass', () => {
  gulp.src([path.src + '/**/*.scss'])
      .pipe(plumber())
      .pipe(sass())
      .on('error', (error) => {
        console.error('Error!', error.message)
      })
      .pipe(cssnext({
        compress : true,
        browsers : 'last 2 versions'
      }))
      .pipe(gulp.dest(path.build))
      .pipe(browserSync.stream());
 });

// =============================================
// image min
// 
gulp.task('imagemin', () => {
  gulp.src([path.src + '/**/*.+(jpg|jpeg|png|gif|svg)'])
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest(path.build));
});

// =============================================
// js min
// 
gulp.task('jsmin', () => {
  gulp.src([path.src + '/**/*.js'])
      .pipe(plumber())
      .pipe(uglify())
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
  gulp.src([
        path.src + '/**/*',
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
    ['copy', 'sass', 'imagemin', 'jsmin'],
    'browser-sync'
  );
  gulp.watch([path.src + '/**/*.js'], ['jsmin']);
  gulp.watch([path.src + '/**/*.scss'], ['sass']);
  gulp.watch([path.src + '/**/*.html', path.src + '/**/*.css'], ['copy']);
});

// =============================================
// gulp build
// 
gulp.task('build', () => {
  runSequence(
    'clean',
    ['copy', 'sass', 'imagemin', 'jsmin']
  );
});