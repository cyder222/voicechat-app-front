
const gulp = require("gulp");
const babel = require("gulp-babel");
 
gulp.task("default", function () {
    return gulp.src(["./*.ts", "./**/*.ts", "!./node_modules/**"])
        .pipe(babel())
        .pipe(gulp.dest("../public/workers"));
});
