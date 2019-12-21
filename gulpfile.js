const gulp = require('gulp');
const browserify = require('browserify');
const source = require("vinyl-source-stream");
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');

const outputDirectory = "./output";

function buildBackgroundJs() {
    return browserify("./src/js/main.js")
        .transform("babelify", {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source('background.js'))
        .pipe(gulp.dest(outputDirectory));
}

function buildPopupJs() {
    return browserify("./src/js/popup.js")
        .transform("babelify", {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source('popup.js'))
        .pipe(gulp.dest(outputDirectory));
}

function manifest() {
    return gulp
        .src("./src/manifest.json")
        .pipe(gulp.dest(outputDirectory));
}

function popupHtml() {
    return gulp
        .src("./src/popup.html")
        .pipe(gulp.dest(outputDirectory));
}

function images() {
    return gulp
        .src('./assets/**/*')
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(outputDirectory + "/assets"))
}

function buildCss() {
    return gulp
        .src(['./src/scss/**/*.scss'])
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end')
            }
        })))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('./out/stylesheets/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./out/stylesheets/'))
}

const buildJs = gulp.series(buildBackgroundJs, buildPopupJs);
const statics = gulp.series(manifest, popupHtml);
const assets = gulp.series(images, buildCss);


const build = gulp.series(buildJs, statics, assets);

exports.buildJs = buildJs;
exports.statics = statics;
exports.assets = assets;

exports.default = build;

