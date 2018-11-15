const gulp   = require('gulp'),
      concat = require('gulp-concat');
      watch = require('gulp-watch');

gulp.task('stream', function () {
    // Endless stream mode
    return watch('css/**/*.css', { ignoreInitial: false })
        .pipe(gulp.dest('build'));
});

gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('css/**/*.css', function () {
        gulp.src('css/**/*.css')
            .pipe(gulp.dest('build'));
    });
});

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
            'js/inject/inject-msg.js',
            'js/inject/inject-store.js',
            'js/inject/inject-events.js'
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

gulp.task('default', ['background', 'inject', 'popup'], function() {
    gulp.watch('js/**/*.js', function() {
        gulp.run('background');
        gulp.run('inject');
        gulp.run('popup');

    });

});
