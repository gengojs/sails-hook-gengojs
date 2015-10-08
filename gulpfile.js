var gulp = require('gulp'),
		mocha = require('gulp-spawn-mocha');
		
gulp.task('test', function(){
	return gulp.src('test/*.js').pipe(mocha());
});

gulp.task('default', ['test']);