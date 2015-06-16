;(function(){
  "use strict";

  // =============================================
  // gulp | plig-in
  // 
  var gulp           = require("gulp"),
      sass           = require("gulp-ruby-sass"),
      imagemin       = require("gulp-imagemin"),
      pngquant       = require("imagemin-pngquant"),
      yuicompressor  = require("gulp-yuicompressor"),
      rimraf         = require('rimraf'),
      ejs            = require('gulp-ejs'),
      plumber        = require("gulp-plumber"),
      runSequence    = require('run-sequence'),
      browserSync    = require('browser-sync').create();

  // =============================================
  // path
  // 
  var srcDir   = "./src",
      buildDir = "./build";

  // =============================================
  // browser-sync
  // 
  gulp.task("browser-sync", function() {
    browserSync.init({
      server: {
        baseDir: buildDir
      },
      ui: {
        port: 8080,
        weinre: {
          port: 9090
        }
      }
    });
  });

  // =============================================
  // sass
  // 
  gulp.task("sass", function() {
    sass(srcDir, {
      "style": "nested",
      "compass": true
    })
    .pipe(plumber())
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.reload({ stream: true }));
  });

  // =============================================
  // image min
  // 
  gulp.task("imagemin", function(){
    gulp.src([srcDir + "/**/*.png", srcDir + "/**/*.jpg", srcDir + "/**/*.gif"])
        .pipe(plumber())
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.reload({ stream: true }));
  });


  // =============================================
  // js min
  // 
  gulp.task("jsmin", function() {
    gulp.src([srcDir + "/**/*.js"])
        .pipe(plumber())
        .pipe(yuicompressor({
          type: 'js'
        }))
        .on('error', function (err) {
          console.error('Error!', err.message);
        })
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.reload({ stream: true }));
  });


  // =============================================
  // copy
  // 
  gulp.task("copy", function() {   
    gulp.src([
          srcDir + "/**/*",
          "!" + srcDir + "/**/*.js",
          "!" + srcDir + "/**/*.ejs",
          "!" + srcDir + "/**/*.png",
          "!" + srcDir + "/**/*.gif",
          "!" + srcDir + "/**/*.jpg",
          "!" + srcDir + "/**/*.scss",
          "!" + srcDir + "/_*/",
          "!" + srcDir + "/**/_*"
        ])
        .pipe(gulp.dest(buildDir));
  });

  // =============================================
  // ejs
  // 
  gulp.task("ejs", function() {  
    gulp.src([srcDir + "/**/*.ejs", "!" + srcDir + "/**/_*.ejs"])
        .pipe(plumber())
        .pipe(ejs())
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.reload({ stream: true }));
  });

  // =============================================
  // clean dir
  // 
  gulp.task("clean", function(cb) {
    rimraf(buildDir, cb);
  });

  // =============================================
  // gulp default task
  // 
  gulp.task("default", function(){
    runSequence(
      "clean",
      ["copy", "ejs", "sass", "imagemin", "jsmin"],
      "browser-sync"
    );
    gulp.watch([srcDir + "/**/*.js"], ["jsmin"]);
    gulp.watch([srcDir + "/**/*.scss"], ["sass"]);
    gulp.watch([srcDir + "/**/*.ejs"], ["ejs"]);

  });

  // =============================================
  // gulp build
  // 
  gulp.task("build", function(){
    runSequence(
      "clean",
      ["copy", "ejs", "sass", "imagemin", "jsmin"]
    );
  });

})();