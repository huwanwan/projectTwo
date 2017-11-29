
var gulp = require('gulp');
var sass = require('gulp-sass');

//创建一个任务
//用来编译Sass
gulp.task('compileSass',function(){

    // 查找文件位置,./更好的兼容写法,得到文件流（文件在内存中的状态）
    gulp.src('./sass/*.scss')

    //编译sass文件
    .pipe(sass({outputStyle:'expanded'}).on('error',sass.logError))

    //输出到硬盘
    .pipe(gulp.dest('./css/'));


    })

// 监听文件的任务
gulp.task('jtSass',function(){

    // 监听home.scss文件
    // 如果有修改，则执行compileSass任务
    gulp.watch('./sass/*.scss',['compileSass']);
})