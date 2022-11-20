const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const sassGlob = require("gulp-sass-glob");
const browserSync = require("browser-sync");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssvariables = require("postcss-css-variables");
const calc = require("postcss-calc");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const purgecss = require("gulp-purgecss");
const terser = require("gulp-terser");
const connect = require("gulp-connect-php");
const projectPath = "mara_danz_01.test"; // 👈 make sure to replace 'projectName' with the name of your project folder

// js file paths
const utilJsPath = "main/assets/js";
const componentsJsPath = "main/assets/js/components/*.js"; // component js files
const scriptsJsPath = "assets/js"; //folder for final scripts.js/scripts.min.js files

// css file paths
const cssFolder = "assets/css"; // folder for final style.css/style-fallback.css files
const scssFilesPath = "main/assets/scss/**/*.scss"; // scss files to watch

function reload(done) {
  browserSync.reload({ notify: false });
  done();
}

gulp.task("sass", function () {
  return (
    gulp
      .src(scssFilesPath)
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      // .pipe(
      //   purgecss({
      //     content: ["site/**/*.php"],
      //   })
      // )
      .pipe(gulp.dest(cssFolder))
      .pipe(
        browserSync.reload({
          stream: true,
          notify: false,
        })
      )
      .pipe(rename("style-fallback.css"))
      .pipe(postcss([cssvariables(), calc()]))
      .pipe(gulp.dest(cssFolder))
  );
});

gulp.task("scripts", function () {
  return gulp
    .src([utilJsPath + "/util.js", componentsJsPath])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(scriptsJsPath))
    .pipe(rename("scripts.min.js"))
    .pipe(terser())

    .pipe(gulp.dest(scriptsJsPath))
    .pipe(
      browserSync.reload({
        stream: true,
        notify: false,
      })
    );
});

gulp.task(
  "watch",
  gulp.series(["sass", "scripts"], function () {
    connect.server({}, function () {
      browserSync({
        proxy: projectPath,
        notify: false,
        browser: "firefox",
      });
    });
    gulp.watch("**/*.php", gulp.series(reload));
    gulp.watch(scssFilesPath, gulp.series(["sass"]));
    gulp.watch(componentsJsPath, gulp.series(["scripts"]));
  })
);
