/* 
* @Author: Marte
* @Date:   2017-11-29 10:50:23
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-29 10:50:57
*/

// <!-- 1.引入js代码，记得加id名给meta。html字体大小不需要自己手动设置。
//     2.那么此时要去浏览器看一下，当前开发设备下的html字体大小是多少，把插件转换的数字改成多少-->
//     <!-- 3.直接做页面，量到多少写多少，它会自动转换成rem.记得转换base.css里面的px -->
    <script type="text/javascript">
        
        // 把尺寸放大N倍（N是window.devicePixelRatio）
        var wd = document.documentElement.clientWidth*window.devicePixelRatio/10;
        //物理像素*设备像素比=真实像素
        document.getElementsByTagName("html")[0].style.fontSize = wd + "px";
        // 把屏幕的倍率缩小到N分之一（N是window.devicePixelRatio）
        var scale = 1/window.devicePixelRatio;
        var mstr = 'initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no';
        document.getElementById("vp").content = mstr;
    </script>