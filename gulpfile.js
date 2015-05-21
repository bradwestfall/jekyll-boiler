var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var cp          = require('child_process');
var bs          = require('browser-sync').create();

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    bs.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    bs.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    bs.init({
        server: "_site"
    });
});

/**
 * Move normalize and renmave so it can be a sass partial
 */
gulp.task('normalize.css', function() {
    return gulp.src(['vendor/normalize.css/normalize.css'])
        .pipe(rename('_normalize.scss'))
        .pipe(gulp.dest('./_scss/base/'));
});

/**
 * Sass
 */
gulp.task('sass', ['normalize.css'], function () {
    return gulp.src('./_scss/main.scss')
        .pipe(sass({
            includePaths: ['_scss']
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('./css')) // For a normal Jekyll workflow
        .pipe(gulp.dest('_site/css'))
        .pipe(bs.stream());
});

gulp.task('watch', function () {
    gulp.watch(['./_scss/main.scss', './_scss/**/*.scss', './vendor/normalize.css/normalize.css'], ['sass']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('default', ['browser-sync', 'watch']);