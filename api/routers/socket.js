/* 
* @Author: Marte
* @Date:   2017-11-25 10:01:38
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-27 08:51:34
*/


module.exports = {
    action:function(app){
        var http = require('http').Server(app);
        var io = require('socket.io').listen(199);
        io.sockets.on('connection',function(client){
            client.emit('news',{'hello':'world'});
            client.on('successPay',function(_status){
                io.emit('status',_status);
            })
            client.on('oEvent',function(data){
                client.broadcast.emit('data',data);
            })
        })

    }
} 