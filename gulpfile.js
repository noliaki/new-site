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
      jsonminify     = require("gulp-jsonminify"),
      minifyHTML     = require('gulp-minify-html'),
      rimraf         = require('rimraf'),
      ejs            = require('gulp-ejs'),
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
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.stream());
  });

  // =============================================
  // image min
  // 
  gulp.task("imagemin", function(){
    gulp.src([srcDir + "/**/*.png", srcDir + "/**/*.jpg", srcDir + "/**/*.gif"])
        .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });


  // =============================================
  // js min
  // 
  gulp.task("jsmin", function() {
    gulp.src([srcDir + "/**/*.js"])
        .pipe(yuicompressor({
          type: 'js'
        }))
        .on('error', function (err) {
          console.error('Error!', err.message);
        })
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });

  // =============================================
  // json min
  // 
  gulp.task("jsonmin", function() {
    gulp.src([srcDir + "/**/*.json"])
        .pipe(jsonminify())
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });


  // =============================================
  // json min
  // 
  gulp.task("minify-html", function() {
    var opts = {
      conditionals: true,
      spare:true
    };
   
    gulp.src([srcDir + "/**/*.html"])
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });

  // =============================================
  // ECT
  // 
  gulp.task("ejs", function() {  
    gulp.src([srcDir + "/**/*.ejs", "!" + srcDir + "/**/_*.ejs"])
        .pipe(ejs())
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });

  // =============================================
  // clean dir
  // 
  gulp.task("clean", function(cb) {
    rimraf(buildDir, cb);
  });

  gulp.task("default", ["clean", "ejs", "sass", "imagemin", "jsmin", "jsonmin", "minify-html", "browser-sync"], function(){
    gulp.watch([srcDir + "/**/*.html"], ["minify-html"]);
    gulp.watch([srcDir + "/**/*.json"], ["jsonmin"]);
    gulp.watch([srcDir + "/**/*.js"], ["jsmin"]);
    gulp.watch([srcDir + "/**/*.scss"], ["sass"]);
    gulp.watch([srcDir + "/**/*.ejs"], ["ejs"]);

  });
})();