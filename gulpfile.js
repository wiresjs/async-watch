var gulp = require('gulp');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

gulp.task('copyFiles', function() {
   return gulp.src(['src/async-watch.js'])
      .pipe(gulp.dest('dist/'))
});
gulp.task('uglify', function() {
   return gulp.src(['dist/async-watch.js'])
      .pipe(rename("dist/async-watch.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("./"));
});

gulp.task('build', function() {
   runSequence(
      'copyFiles',
      'uglify'
   );

});
