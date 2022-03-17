const del = require("del");
const gulp = require("gulp");
const babel = require("gulp-babel");
 
gulp.task("clear", function (cb) {
    del([
        "../public/workers/**/*",
    ], cb);
});

gulp.task("build", function () {
    return gulp.src(["./*.ts", "./**/*.ts", "!./node_modules/**"])
        .pipe(babel());
});

gulp.task("copy", function () {
    return gulp.src(["./*.js", "./**/*.js", "./**/*.onnx", "./**/*.json", "./**/*.wasm", "!./node_modules/**"])
    .pipe(gulp.dest("../public/workers"));
});

gulp.task("default", gulp.series("build", "copy"));
