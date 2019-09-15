const { task, src, dest, parallel, series, watch, start } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();
const watchify = require("watchify");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const fs = require('fs');
const spawn = require('child_process').spawn;
const ts = require("gulp-typescript/release/main");
const tsProject = ts.createProject("tsconfig.json");

/*
------------------------------
SRC PATH
------------------------------
*/
const srcPaths = {
    html: ['./src/*.html'],
    tsFile: ['./src/ts/main.ts'],
    scss: ['./src/scss/*.scss'],
    img: ['./src/img/*.']
};

/*
------------------------------
DIST PATH
------------------------------
*/
const distPaths = {
    dist: ['./dist']
};

/*
------------------------------
NODE FILE PATH
------------------------------
*/
const vendorFile = ['./node_modules/gsap/src/minified/TweenMax.min.js',
                    './node_modules/normalize.css/normalize.css'];

/*
------------------------------
WATCHED WITH BROWSERIFY
watch ts file such as main.ts
tsify it
babelify it
PS: SOMEHOW HE WATCHED ALSO other .ts file
and not only main.ts
------------------------------
*/

const watchedBrowserify = watchify ( //done
    browserify({
        basedir: '.',
        debug: true,
        entries: srcPaths.tsFile,
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "node": "current"
                        }
                    }
                ]
            ], extensions: ['.ts']}
        )
);

/*
------------------------------
BUNDLE
after babelify
name the file to bundle
save it in buffer
load sourcemaps
write sourcemaps
send it to dist
stream to the browser and reload it
------------------------------
*/

function bundleJs() { //done
    // body omitted
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(distPaths.dist)) // go to de app dist
        .pipe(browserSync.stream());
}

/*
------------------------------
SASS
send sass file to dist
add plumber
add sourcemaps
add error log
add auto prefix
send it to dist
stream to browser and reload
------------------------------
*/

function all_sass() { //done
    // body omitted
    return src(srcPaths.scss, {allowEmpty: true})
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist : [ "> 1%",
                "ie >= 8",
                "edge >= 15",
                "ie_mob >= 10",
                "ff >= 45",
                "chrome >= 45",
                "safari >= 7",
                "opera >= 23",
                "ios >= 7",
                "android >= 4",
                "bb >= 10"]
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(distPaths.dist)) // go to de app dist
        .pipe(browserSync.stream());
}

/*
------------------------------
APP HTML INDEX
send html file to dist
------------------------------
*/

function indexHtml() { //done
    // body omitted
    return src(srcPaths.html)
        .pipe(dest(distPaths.dist)) // go to de app dist
        .pipe(browserSync.stream());
}

/*
------------------------------
IMG
send IMG template file to dist
------------------------------
*/

function img() { //done
    // body omitted
    return src(srcPaths.img)
        .pipe(dest(distPaths.dist)) // go to de app dist
}

/*
------------------------------
ALL VENDOR
add GSAP to the app folder
add bootstrap to the app folder
------------------------------
*/

function allVendor() { // done
    // body omitted
    return src(vendorFile)
        .pipe(dest(distPaths.dist)) // go to de app dist
}

/*
------------------------------
SERVE BROWSERSYNC
start browser - with local host
------------------------------
*/

function serve() {
    // body omitted
    browserSync.init({
        server: {
            baseDir: distPaths.dist,
            /*directory: true,*/	//show directory
            proxy: "grqbge-nwx7013:3000"
        },
        port: 9999
    });

    /*
    ------------------------------
    WATCH
    with gulp.watch - the normal one
    ------------------------------
    */
    watch(srcPaths.tsFile,{ queue: false, events: 'all' }, series(bundleJs));
    watch(srcPaths.scss,{ queue: false, events: 'all' }, series(all_sass));
    watch(srcPaths.html,{ queue: false, events: 'all' }, series(indexHtml));

    // IF U WANT TO FULL REFRESH ON SCSS WATCH PLEASE REPLACE IT WITH THIS
    //watch(srcPaths.scss,{ queue: false, events: 'all' }, series(all_sass)).on('change', browserSync.reload());
}

exports.allVendor = allVendor;
exports.img = img;
exports.indexHtml = indexHtml;
exports.all_sass = all_sass;
exports.bundleJs = bundleJs;
exports.serve = serve;

exports.default = series(
    indexHtml,
    parallel(
        allVendor,
        img,
        all_sass,
        bundleJs,
    ),
    serve
);