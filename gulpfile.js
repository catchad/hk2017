var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var compass = require('gulp-compass');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');

// videos
gulp.task('clean-videos', function() {
    return gulp.src('build/assets/videos/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('videos', ['clean-videos'], function() {
    return gulp.src('src/assets/videos/**')
        .pipe(gulp.dest('build/assets/videos/'));
});


// image
gulp.task('clean-images', function() {
    return gulp.src('build/assets/images/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('images', ['clean-images'], function() {
    return gulp.src('src/assets/images/**')
        .pipe(gulp.dest('build/assets/images/'));
});

// css
gulp.task('clean-css', function() {
    return gulp.src('build/assets/styles/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('css', ['clean-css'], function() {
    return gulp.src('src/assets/styles/*.scss')
        .pipe(compass({
            css: 'src/assets/styles/',
            sass: 'src/assets/styles/',
            image: 'src/assets/images/',
            sourcemap: false,
            style: 'nested', // nested, expanded, compact, compressed
            comments: false
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        // .pipe(uglifycss())
        .pipe(gulp.dest('build/assets/styles/'))
});

// js
gulp.task('clean-js', function() {
    return gulp.src('build/assets/scripts/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('concat-js', function() {
    gulp.src(['src/assets/scripts/lib/jquery-3.2.1.min.js', 'src/assets/scripts/lib/TweenMax.min.js', 'src/assets/scripts/lib/device.min.js', 'src/assets/scripts/lib/imagesloaded.pkgd.min.js', 'src/assets/scripts/lib/hammer.min.js', 'src/assets/scripts/lib/pixi.min.js'])
      .pipe(concat('lib.js'))
      .pipe(gulp.dest('build/assets/scripts/'));

    gulp.src(['src/assets/scripts/lib/numeric-1.2.6.min.js', 'src/assets/scripts/lib/keyframedata.js', 'src/assets/scripts/lib/mv.js'])
      .pipe(concat('mv.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/scripts/'));
});

gulp.task('js', ['clean-js', 'concat-js'], function() {
    return gulp.src('src/assets/scripts/*.js')
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/scripts/'));
});

// JADE to HTML
gulp.task('clean-html', function() {
    return gulp.src('build/*.html', {
            read: false
        })
        .pipe(clean());
});
gulp.task('html', ['clean-html'], function() {
    gulp.src('src/[^_]*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('build/'))
})

// 監聽檔案
gulp.task('watch', function() {
    gulp.watch('src/assets/styles/*.scss', ['css']);
    gulp.watch('src/assets/scripts/**/*.js', ['js']);
    gulp.watch('src/assets/images/**', ['images']);
    gulp.watch('src/assets/videos/**', ['videos']);
    gulp.watch('src/*', ['html']);
});

// 本機伺服器
gulp.task('webserver', function() {
    gulp.src('build/')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 9527,
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: '/index.html'
        }));
});

gulp.task('default', ['html', 'css', 'js', 'images', 'videos'], function() {
    gulp.start('webserver');
    gulp.start('watch');
});