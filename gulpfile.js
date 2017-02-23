/**
 * Created by Gaurav MphRx on 2/16/2015.
 */
var gulp = require('gulp');
var replace = require('gulp-replace-task');
var fs = require('fs');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
require('es6-promise').polyfill(); // Added  because promise was not found for gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var argv = require('yargs').argv

gulp.task("minify:css", function () {
    var packageVersion = require("./package.json").version
    var injectCss = function (sources) {
        return target.pipe(require('gulp-inject')(sources))

            .pipe(gulp.dest('app'));
    }
    var css_files = require("./config/dependencies.json").css
    var sources = css_files.thirdParty.concat(css_files.self)

    var target = gulp.src('app/index.html');
    if (argv.production) {
        var minified_stream = gulp.src(sources).pipe(minifyCSS({relativeTo:"app",target:"src/css"}))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
            .pipe(concat('style.min.' + packageVersion + '.css'))
            .pipe(concat.header("\n/**\n" + sources + "\n*/\n"))
            .pipe(minifyCSS())
            .pipe(gulp.dest('app/src/css/'))
        minified_stream.on("end", function () {

            injectCss(gulp.src('app/src/css/style.min.' + packageVersion + '.css'))
        })
    } else {

        injectCss(gulp.src(sources))

    }


})


gulp.task("minify:js", function () {
    var packageVersion = require("./package.json").version
    var injectJs = function (sources) {
        return target.pipe(require('gulp-inject')(sources))

            .pipe(gulp.dest('app'));
    }
    var js_files = require("./config/dependencies.json").js
    var third_party_sources = js_files.thirdParty
    var self_sources = js_files.self

    var target = gulp.src('app/index.html');
    if (argv.production) {
        var minified_third_party_stream = gulp.src(third_party_sources)
            .pipe(concat('app.min.external.' + packageVersion + '.js'))
            .pipe(concat.header("\n/**\n" + third_party_sources + "\n*/\n")).pipe(uglify())
            .pipe(gulp.dest('app/src/JS/'))
        minified_third_party_stream.on("end", function () {
            var self_source_stream = gulp.src(self_sources)
                .pipe(concat("app.min.internal." + packageVersion + ".js"))
                .pipe(concat.header("\n/**\n" + self_sources + "\n*/\n")).pipe(uglify())
                .pipe(gulp.dest('app/src/JS/'))
            self_source_stream.on("end", function () {
                var clientSpecificFileContent = "/**\nThis file is reserved for client specific changes.\nUse the redirect rule to do the client level customization \n*/"
                fs.writeFileSync("app/src/JS/app.client.js" , clientSpecificFileContent)
                injectJs(gulp.src([('app/src/JS/app.min.external.' + packageVersion + '.js'), ('app/src/JS/app.min.internal.' + packageVersion + '.js'), ('app/src/JS/app.client.js')]))
            })
        })
    } else {
        injectJs(gulp.src(third_party_sources.concat(self_sources)))
    }


})