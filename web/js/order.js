/* 
* @Author: Marte
* @Date:   2017-11-28 09:53:37
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-29 10:51:29
*/

require(['config'],function(){
    require(['jquery','globals','socket','bootstrap'],function($,globals,socket){
        // 把尺寸放大N倍（N是window.devicePixelRatio）
        var wd = document.documentElement.clientWidth*window.devicePixelRatio/10;
        //物理像素*设备像素比=真实像素
        document.getElementsByTagName("html")[0].style.fontSize = wd + "px";
        // 把屏幕的倍率缩小到N分之一（N是window.devicePixelRatio）
        var scale = 1/window.devicePixelRatio;
        var mstr = 'initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no';
        $("#vp")[0].content = mstr;
        var page = {
            btn:'button',
            init(){
                this.$btn = $(this.btn);
                var params = location.search;
                this.client = null;

                if(params){
                    this.client = socket.connect('ws://10.3.135.12:199');
                    this.client.on('data',(res)=>{
                       var data = res.order;
                       this.createEle(data);
                       this.count();
                    })
                    params = params.slice(1).split('=')[1];
                    this.getOrder({'orderNum':params})
                }else{
                    return;
                }
                this.$btn.click(()=>{
                    this.btnEvent();
                })
            },
            btnEvent(){
                var h3 = $('<h3/>').css({
                    'position':'fixed',
                    'left':0,
                    'right':0,
                    'top':200,
                    'textAlign':'center'
                });
                if(this.orderType == 2){
                    h3.text('订单已支付!');
                    $('body').html(h3);
                    return;
                }
                $.post('http://10.3.135.12:88/' + 'upOrder',{'orderNum':this.orderTime,'type':'2','order':JSON.stringify(this.data)},(res)=>{
                        if(res.status){
                            var money = $('tfoot').find('span').text();
                            h3.text('您已成功支付'+money+'元!');
                            $('body').html(h3);
                            //发送支付成功事件给socket,当前页面显示支付成功;
                            this.client.emit('successPay',{status:true});
                        }else{
                            h3.text('支付失败,请和收银员核对!');
                        }
                })     
            },
            getOrder(obj){
                $.post('http://10.3.135.12:88/' + 'getOrder',obj,(res)=>{
                    if(res.status){
                        this.orderTime = res.data[0].orderNum;
                        this.orderType = res.data[0].type;
                        this.data = JSON.parse(res.data[0].order);
                        this.createEle(this.data);
                        this.count();
                    }
                })
            },
            createEle(data){
                var cont = data.map((item)=>{
                    return `
                        <tr>
                            <td>${item.barCode}</td>
                            <td>${item.name}</td>
                            <td class="qty">${item.qty}</td>
                            <td class="price">${item.price}</td>
                        </tr>
                    `;
                    
                }).join('');
                $('tbody').html(cont);
            },
            count(){
                var all = 0;
                $('.qty').each((idx,item)=>{
                    all+=item.innerText * $('.price').eq(idx).text()
                })
                $('tfoot').find('span').text(all);
            }
        }
        page.init();        
    })
                

})