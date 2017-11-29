/* 
* @Author: Marte
* @Date:   2017-11-24 16:54:27
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-29 14:47:34
*/

var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var bp = require('body-parser');
var user = require('./user');
var product = require('./product');
var socket = require('./socket');
var order = require('./order');
var pend = require('./pend');
var purchase = require('./purchase');
// var upPath = path.join(__dirname,'/');
module.exports = {
    start:function(_port){
        // 设置全局的post使用bp;
        app.use(bp.urlencoded({extended:false}));
        // 设定可以访问目录下所有静态文件;
        app.use(express.static(path.join(__dirname,'../../web/')));
        // 设置跨域;
        app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By",' 3.2.1');
            if(req.method=="OPTIONS") {
                res.sendStatus(200);/*让options请求快速返回*/
            } else{
                next();
            }
        });
        // 操作模块;
        user.action(app);
        product.action(app);
        socket.action(app);
        order.action(app);
        pend.action(app);
        purchase.action(app);
        //监听端口;
        app.listen(_port); 
    }
}
