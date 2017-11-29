var io = require('socket.io')();

io.on('connection', function(socket){
    socket.on("send", function(_mes){
        io.emit("get" , _mes.data)
        socket.send(_mes.data)
    })
});
io.listen(99);