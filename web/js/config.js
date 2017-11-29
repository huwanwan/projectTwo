

// 这是配置文件,path是路径，记住不用写后缀.js,     shim是前者依赖后者

require.config({
    paths:{
        jquery:'../libs/jquery-3.2.1.min',
        accordion:'../libs/accordion/js/jquery-accordion-menu',
        bootstrap:'../libs/bootstrap/js/bootstrap.min',
        code:'../js/qrcode.min',
        socket:'../js/socket.io',
        globals:'../js/globals'
    },
    shim:{
        accordion:['jquery'],
        bootstrap:['jquery'],
        datagrid:['jquery'],
        code:['jquery'],
        globals:['jquery'],
    }
});
