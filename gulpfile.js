var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    del         = require('del');

var deploy      = require('gulp-gh-pages');

var reload      = browserSync.reload;


gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: './app'
    },
    browser: 'google chrome'
  });

  gulp.watch(['app/**/*.css'], reload);
  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/**/*.js'], reload);
});

// gh-pages integration
gulp.task('deploy', function () {
  return gulp.src('app/**/*')
    .pipe(deploy());
});

gulp.task('default', function (cb) {
  runSequence('serve', cb);
});