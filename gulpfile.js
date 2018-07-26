var gulp = require('gulp');
var rename = require("gulp-rename");
var imageResize = require('gulp-image-resize');
var csso = require('gulp-csso');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task("resizeThumb", function () {
    gulp.src("./dev/img/*.*")
      .pipe(imageResize({ width : 400 , quality:0.7}))
      //.pipe(rename(function (path) { path.basename += "-thumbnail"; }))
      .pipe(gulp.dest("./images"));
});
gulp.task("resizeOrginal", function () {
    gulp.src("./dev/img/*.*")
        .pipe(imageResize({ width : 800 , quality:0.5}))
        .pipe(rename(function (path) { path.basename += "_800"; }))
        .pipe(gulp.dest("./images"));
});
 gulp.task('styles', function () {
    return gulp.src('./dev/css/*.css')
      .pipe(csso())
      .pipe(gulp.dest('./css'))
  });



  gulp.task('scripts', function() {
    return gulp.src('./dev/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
      .pipe(gulp.dest('./js'))
  });
gulp.task('default', ['resizeOrginal', 'resizeThumb','styles' , 'scripts']);
gulp.task('watch', function(){
    gulp.watch('./dev/img/*.*', ['resizeOrginal','resizeThumb']); 
    gulp.watch('./dev/css/*.css', ['styles']); 
    gulp.watch('./dev/js/*.js', ['scripts']); 
  })

