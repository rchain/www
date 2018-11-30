import gulp from 'gulp'
import eslint from 'gulp-eslint'
import babel from 'gulp-babel'
import del from 'del'
const plumber = require('gulp-plumber')

gulp.task('clean', () =>
          del('dist'))

gulp.task('lint', () =>
          gulp
          .src('src/**/*.js')
          .pipe(plumber())
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(eslint.failAfterError())
         )

gulp.task('build', () =>
          gulp.src('src/**/*.js')
          .pipe(plumber())
          .pipe(babel())
          .pipe(gulp.dest('dist')))

gulp.task('dist', () => 
          gulp.src('src/**/*')
          .pipe(gulp.dest('dist/')))

gulp.task('default', gulp.series('clean','lint', 'build', 'dist') )
