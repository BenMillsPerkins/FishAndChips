var gulp = require("gulp");
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var named = require('vinyl-named');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var config = require('./webpack.config.js');

gulp.task("compile", function() {
    var stream =
        gulp.src(['src/index.jsx'])
        .pipe(named())
        .pipe(plumber())
        .pipe(webpack( config ))
        .pipe(gulp.dest("build/src"));
    return stream;
})

gulp.task('develop', ['watch'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:80",
        files: ["/./build/**/*.*"],
        browser: "google chrome",
        port: 80,
	});
    gulp.watch('src/**/*', ['compile-watch']);
});
gulp.task('compile-watch', ['compile'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', ['compile',], function () {
  var stream = nodemon(
      {
         script: 'public/backend.js', // run ES5 code
         ext: 'js html css jsx',
         watch: ['src/**/*','public/'], // watch ES2015 code
         tasks: ['compile-watch'] // compile synchronously onChange
       }
   )
});