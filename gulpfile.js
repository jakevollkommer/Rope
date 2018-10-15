const gulp   = require('gulp'),
      concat = require('gulp-concat');

gulp.task('background', done => {
    return gulp.src([
            'js/background.js',
            'js/background/background-auth.js',
            'js/background/background-msg.js',
            'js/background/background-sync.js'
        ]).pipe(concat('background.js'))
          .pipe(gulp.dest('build/'))
});

gulp.task('inject', done => {
    return gulp.src([
            'js/inject.js',
            'js/inject/inject-sync.js'
        ]).pipe(concat('inject.js'))
          .pipe(gulp.dest('build/'))
});

gulp.task('popup', done => {
    return gulp.src([
            'js/popup.js',
            'js/popup/popup-events.js',
            'js/popup/popup-auth.js',
            'js/popup/popup-ui.js'
        ]).pipe(concat('popup.js'))
          .pipe(gulp.dest('build/'))
});

gulp.task('default', ['background', 'inject', 'popup']);
