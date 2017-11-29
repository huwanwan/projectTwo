/* 
* @Author: Marte
* @Date:   2017-11-27 16:49:43
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-29 21:23:08
*/

require(['config'],function(){
    require(['jquery','globals','socket','bootstrap','code','accordion'],function($,globals,socket){
        // 登录界面;
        // 获取token
            var token = window.localStorage.getItem("token");
            // 将token放到请求头发送给服务端
            var position;
            $.ajax({
                type:"POST",
                url:global.apiBaseUrl +"index",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function(res){
                    console.log(res)
                    if(res.name && res.name == "JsonWebTokenError"){
                       location.href = "./html/login.html";
                    }else{
                        position=(res.position)
                         $('.mh_hed').find('.username').html(res.username);

                              show(position);
                        
                         
                    }
                }
            });


           
            /*---------------------------退出-----------------------------*/
            $('.mh_hed').find('.exit').on("click",function(){
                // 删除token
                window.localStorage.removeItem("token",token);
                location.href = "./html/login.html";
            })
            function show(position){
                //初始化手风琴特效
                 $("#jquery-accordion-menu").jqueryAccordionMenu();

                 // 左栏搜索框特效-----------------------------
                 function filterList(header, list) {
                      //@header 头部元素
                      //@list 无序列表
                      //创建一个搜素表单
                      var form = $("<form>").attr({
                        "class":"filterform",
                        action:"#"
                      }), input = $("<input>").attr({
                        "class":"filterinput",
                        type:"text"
                      });
                      $(form).append(input).appendTo(header);
                      $(input).change(function() {
                        var filter = $(this).val();
                        if (filter) {
                          $matches = $(list).find("a:Contains(" + filter + ")").parent();
                          $("li", list).not($matches).slideUp();
                          $matches.slideDown();
                        } else {
                          $(list).find("li").slideDown();
                        }
                        return false;
                      }).keyup(function() {
                        $(this).change();
                      });
                    }
                    $(function() {
                      filterList($("#form"), $("#demo-list"));
                    });

                // 隐藏右侧搜索窗
                // $('.mh_search').hide();
                // 以下是库存管理模块-----------------------------
                $('.stockctl').click(function(){
                    // 显示搜索窗
                    $('.mh_search').show();
                    $('.yema').css('display','block');
                    // 返回首页
                    $('.shuaxin').click(function(){
                        location.reload();
                    })
                    // post请求获取商品数据,分页加载--------------------
                    var pageNo = 1;
                    var qty = 10;
                    // 获取焦点
                    $('#searchp').focus();
                    $.post(global.apiBaseUrl+'getProduct',{'pageNo':pageNo,'qty':qty},function(res){
                          ivan(res);
                          // 商品总数计入
                          $('.mh_total').text(res.data[1]);


                       // 页码点击切换请求商品数据---------------
                        $('.yemaul').on('click','.yemali',function(){
                            if($('#searchp').val() === ''){
                                var pagenum = Number($(this).text());
                                $.post(global.apiBaseUrl+'getProduct',{'pageNo':pagenum,'qty':qty},function(res){
                                    ivan(res);
                                    // 背景色切换
                                    $('.yemali').eq(pagenum-1).css({'background':'#03A678','color':'#fff'}).siblings('.yemali').css({'background':'#fff','color':'#000'})

                                    // 修改商品数据-----------------------
                                        modify(position);
                                    // 删除商品数据事件---------------------
                                    delgoods();
                                })
                            };
                            
                        })
                        // 修改商品数据-----------------------
                              modify(position);

                        // 删除商品数据事件---------------------
                        delgoods();

                        // 新增商品--------------
                        $('.addgoods').click(function(){
                            $('#tc1').fadeIn();
                            $('#all1').fadeIn();
                            $('#del1').click(function(){
                                $('#tc1').slideUp('slow');
                                $('#all1').fadeOut('fast');
                            })
                            // 数据录入
                            $('.tsave1').click(function(){
                                if($('#content1 input').eq(0).val() ==''){
                                    alert('请输入完整信息再录入数据库！');
                                    return;
                                }else{
                                      var qiao = ['barCode','name','gener','price','vipPrice','inventNum','putNum','supplier','startDate','keepDate','buyPrice']
                                      var object_m = {};
                                      for(var i=0;i<qiao.length;i++){
                                        object_m[qiao[i]] = $('#content1 input').eq(i).val();
                                      }
                                      // 请求数据库修改
                                      $.post(global.apiBaseUrl+'addProduct',object_m,function(res){
                                          $('#tc1').fadeOut('fast');
                                          $('#all1').fadeOut('fast');
                                          // 商品总数加1
                                          var goodnu = $('.mh_total').text()*1+1;
                                          $('.mh_total').text(goodnu);
                                      })
                                }
                            })
                        })

                    })


                 

                    // 搜索商品功能请求数据库---------------------
                    $('.mh_select').click(function(){
                        keyword = $('#searchp').val();
                        var attr = $('#sou').val();
                        if(keyword ==''){
                            $('.tipnull').text('请输入关键词！')
                            $('.tipnull').fadeIn();
                            setTimeout(function(){
                                $('.tipnull').fadeOut();
                            },2000)
                            return;
                        }else{
                          if(attr == 'purchase'){
                              return;
                          }
                          $.post(global.apiBaseUrl+'getProduct',{'pageNo':pageNo,'qty':qty,[attr]:keyword},function(res){

                              if(!res.status){
                                  $('.tipnull').text('搜索结果为空,请注意分类查询')
                                  $('.tipnull').fadeIn();
                                  setTimeout(function(){
                                        $('.tipnull').fadeOut();
                                  },2000)
                              }else{
                                console.log(res)
                                  ivan(res);

                                 // 页码点击切换请求商品数据---------------
                                  $('.yemaul').on('click','.yemali',function(){
                                      var pagenum = Number($(this).text());
                                      $.post(global.apiBaseUrl+'getProduct',{'pageNo':pagenum,'qty':qty,[attr]:keyword},function(res){
                                              ivan(res,pageNo,qty);
                                              // 背景色切换
                                              $('.yemali').eq(pagenum-1).css({'background':'#03A678','color':'#fff'}).siblings('.yemali').css({'background':'#fff','color':'#000'})

                                    // 修改商品数据-----------------------
                                        modify();
                                    // 删除商品数据事件---------------------
                                    delgoods();
                                })
                        })

                                  

                                  // 修改商品数据-----------------------
                                        modify();

                                  // 删除商品数据事件---------------------
                                  delgoods();
                            
                              }
                          })
                        }
                        
                    })

                    // 商品数据修改函数封装----------------------
                    function modify(position){
                       $('table').on('click','.make',function(){
                          var currentTr = $(this).closest('tr');
                          var barCode = currentTr.find('td').eq(1).text();
                          // console.log(barCode);
                          $('.tsave').click(function(){
                            var qiao = ['barCode','name','gener','price','vipPrice','inventNum','putNum','supplier','startDate','keepDate','buyPrice']
                            var object_m = {};
                            for(var i=0;i<qiao.length;i++){
                                object_m[qiao[i]] = $('#content input').eq(i).val();
                            }
                            // 请求数据库修改
                            $.post(global.apiBaseUrl+'updateProduct',object_m,function(res){})

                          })
                        })
                    }

                    // 删除商品数据函数封装------------------------
                    function delgoods(){
                        $('table').on('click','.del',function(){
                            if(confirm('确实要删除吗?') === true){
                              var currentTr = $(this).closest('tr');
                              console.log(currentTr[0]);
                              var barCode = currentTr.find('td').eq(1).text();
                              $.post(global.apiBaseUrl+'delProduct',{'barCode':barCode},function(res){
                                  // 商品总数减一
                                  var goodnu = $('.mh_total').text()*1-1;
                                  $('.mh_total').text(goodnu);
                                  currentTr.fadeOut();
                                  
                              })
                            }
                        })
                    }

                    // 请求处理函数封装----------------------
                    function ivan(res){
                          var output = document.getElementById('output');
                          var html = '<table id="mytable"><tr><td>#</td><td>条形码</td><td>商品名称</td><td>分类</td><td>销售价</td><td>VIP价格</td><td>库存数量</td><td>上架数量</td><td>供应商</td><td>生产日期</td><td>保质期</td><td>进货价</td><td>操作</td></tr>';
                          res.data[0].map(function(item,index){
                              html+=`<tr>
                                    <td class='bns'>#</td>
                                    <td>${item.barCode}</td>
                                    <td>${item.name}</td>
                                    <td>${item.gener}</td>
                                    <td>${item.price}</td>
                                    <td>${item.vipPrice}</td>
                                    <td>${item.inventNum}</td>
                                    <td>${item.putNum}</td>
                                    <td>${item.supplier}</td>
                                    <td>${item.startDate}</td>
                                    <td>${item.keepDate}</td>
                                    <td>${item.buyPrice}</td>
                                    <td  class='bns'>
                                        <input type="button" class="make" value="编辑"/>
                                        <input type="button" class="del" value="删除"/>
                                    </td>
                                  </tr>`
                          })
                          html+="</table>"
                          output.innerHTML = html;

                          // 页码相关计算-----------------
                          $('.yemaul')[0].innerHTML = '';
                          var pagenum = Math.ceil(res.data[1]/qty);
                          for(var i=0;i<pagenum;i++){
                            $('.yemaul')[0].innerHTML +=`<li class='yemali fl'>${i+1}</li>
                                                      `
                         }

                         // 页码背景色切换
                          $('.yemali').first().css({'background':'#03A678','color':'#fff'})

                          //输出页面
                          var mytable = document.getElementById('mytable');
                          var tc = document.getElementById('tc');
                          var all = document.getElementById('all');
                          var del = document.getElementById('del');
                          
                          //获取页面元素
                          output.onclick = function(e){

                              e = e || window.event;
                              var target = e.target || e.srcElement;
                              var currentTr = target.parentNode.parentNode;
                              var input  = document.createElement('input');
                              //当前tr
                              if(target.tagName=='INPUT' && target.className=='make'){
                                   //console.log(currentTr.children[1].innerText);
                                   var input = content.getElementsByTagName('input');
                                   tc.style.display = 'block'
                                   all.style.display = 'block'
                                   //弹出框
                                   for(var i=1;i<=input.length;i++){
                                      //为什么i=1？因为第一行是不用改
                                            input[i-1].value = currentTr.children[i].innerText 
                                          }
                                   //遍历content下的input的标签数组让input的value值等于表格下对应行的innerText
                                  del.onclick = function(){
                                      tc.style.display = 'none'
                                      all.style.display = 'none'
                                  }
                                  //这里的函数没有参数e是因为没有使用事件源对象

                              }
                              // if(target.tagName=='INPUT' && target.className=='del'){

                              //      currentTr.parentNode.removeChild(currentTr);
                              //      var len = mytable.children[0].children.length
                              //      //这里不能用currentTr去求，因为已经被remove了
                              //      for(var i=1;i<len;i++){
                              //         //遍历mytable的子元素tbody下子元素，让所有行的第一个等于他的行数
                              //          mytable.children[0].children[i].children[0].innerText = i;
                              //      }
                              // }
                             // --------------------------------------------------------------
                              tc.onclick  = function(e){
                                      e = e || window.event;
                                      var target = e.target || e.srcElement;
                                      //这里的事件源不能省略，下面这个判断target.tagName是否为BUTTON需要用到
                                      if(target.tagName=='BUTTON'){
                                          var content =  document.getElementById('content')
                                          for(var i=1;i<=input.length;i++){
                                              currentTr.children[i].innerText = input[i-1].value;
                                              //这里的current包含的源对象是output的源对象，所以不能把上面function（e）中的e省略
                                          }

                                           tc.style.display = 'none'
                                           all.style.display = 'none'

                                      }

                              }
                              //所有在output里面的函数都不能漏了参数e，不然无法传递事件源，效果出不来
                              tc.style.left = window.innerWidth/2-tc.offsetWidth/2 + 'px'
                              tc.style.top = window.innerHeight/2-tc.offsetHeight/2 + 'px'
                          }
                      }
                      var sockets = socket.connect('ws://10.3.135.12:99');
                        sockets.on("get", function(msg){
                            var msg = window.decodeURI(msg);
                            var mes = JSON.parse(msg);

                            $.post(global.apiBaseUrl+'getProduct',{'pageNo':pageNo,'qty':qty},function(res){
                              console.log(res);
                                  ivan(res);
                                });


                    })         
                      // 以上是请求处理函数封装----------------------

                  })
                  // 以上是库存管理模块---------------------------

                  // 收银部分(胡弯弯);
                  var payment = {
                      pay:'#output',
                      allGoods:[],
                      init(){
                        $('.yema').css('display','none');
                        this.$pay = $(this.pay);
                        var title = $('<h2/>').text('商品收银').css({
                          'width':925,
                          'textAlign':'center',
                          'fontSize':20,
                          'marginTop':10,
                          'fontWeight':'bold'
                        });
                        this.$qrCode = $('<div/>').attr(
                        {'class':"modal fade",'id':"myModal",'tabindex':"-1",'role':"dialog",'aria-labelledby':"myModalLabel",'aria-hidden':"true"
                        }
                        ).appendTo('body');
                        // 生成一个收银input;
                        var cont = this.createInp();              
                        this.$codeInp = $('<div/>').addClass('payRight').css({'width':560,'marginBottom':10,'float':'left'}).html(cont);
                        this.$tabPay = $('<table/>').addClass('table table-bordered').appendTo(this.$codeInp);
                        this.$pendTab = $('<div/>').css({
                                    'width':360,
                                    'float':'right',
                                    'marginRight':5,
                                  });
                        this.$payClick = $('<button/>').css('display','none').attr({
                            'type':'button', 
                            'class':'btn payClick btn-primary btn-lg',
                            'data-toggle':"modal",
                            'data-target':"#myModal"
                          }).text('结账付款').appendTo(this.$codeInp);
                        this.$pay.html([title,this.$codeInp,this.$pendTab]);
                        var self = this;
                        $('.barCode').blur(function(){
                            var barCode = $(this).val(); 
                            self.getGoods(barCode);
                            $(this).val('');
                        })
                        this.$payClick.click(()=>{
                          self.qCode();
                        })
                      },
                      qCode(){
                          var nowTime = Date.now();
                          this.$qrCode.html('');
                          var code = `
                              <div class="modal-dialog">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                      </button>
                                      <h4 class="modal-title" id="myModalLabel">
                                        付款二维码
                                      </h4>
                                    </div>
                                    <div class="modal-body" id="qrCode" style="margin-left:180px;"></div> 
                                  </div>
                                </div>`;
                          this.$qrCode.html(code);
                          new QRCode('qrCode', {
                              text: 'http://10.3.135.12:8080/manage/web/html/order.html?orderNum='+ nowTime,
                              width: 200,
                              height: 200
                          })
                          $('#identifier').modal('show');
                          var self = this;
                          var client = socket.connect('ws://10.3.135.12:199');
                            client.on('news',(res)=>{
                                if(res){
                                    client.emit('oEvent',{'order':this.allGoods});
                                }
                            })  
                            $.post(global.apiBaseUrl + 'addOrder',{'orderNum':nowTime,'type':1,'order':JSON.stringify(this.allGoods)},function(res){
                                if(res.status){
                                    // 触发支付状态事件,返回支付信息;
                                    client.on('status',function(res){
                                        if(res){
                                          $('#qrCode').html('<i class="glyphicon glyphicon-ok-circle" style="color:#58bc58"></i><span style="color:#58bc58; font-size:18px;margin-left:10px;">客户已成功支付!</span>');
                                            var payTime = Date.now();
                                            self.receipts(payTime);
                                            self.$pay.find('tbody').html('');
                                            self.$tabPay.find('tfoot').find('.goodsNum').text('0').parents('td').siblings('td').find('.count').text('0');
                                            self.allGoods = [];
                                            self.$payClick.css('display','none');   
                                        }
                                    })
                                }
                            })   
                      },
                      receipts(payTime){
                          var allQty = this.$tabPay.find('tfoot').find('.goodsNum').text();
                          var count = this.$tabPay.find('tfoot').find('.count').text();
                          var self = this;
                          var time = this.format(payTime);
                          var cont = "很厉害超市收银系统  \n*************************************\n商品名称        数量        单价\n";
                          this.allGoods.forEach(function(item){
                              cont+=`${item.name}         ${item.qty}件    ￥${item.price} 元\n`;
                          });
                          cont+=`数量：${allQty} 件\n总金额：￥${count} 元\n买单时间:${time}\n*************************************\n`;
                          $.post('http://10.3.135.67:81/print',{'text':cont},function(_result){
                              if(_result.indexOf('True') < 0){
                                  var wAlert = `<div class="alert alert-danger alert-dismissable" style="z-index:55">
                                                    <button type="button" class="close" data-dismiss="alert"
                                                            aria-hidden="true">
                                                        &times;
                                                    </button>
                                                    打印票据失败,请重新操作!
                                                </div>`;
                                  self.$pay.append(wAlert);
                                  return;   
                              }
                          })
                      },
                      format(time){
                          var date = new Date(time);
                          var y = date.getFullYear();
                          var m = date.getMonth()+1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth();
                          var d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
                          var h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
                          var f = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
                          var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

                          return `${y}年${m}月${d}日${h}:${f}:${s}`;    
                      },
                      createInp(){
                        var cont = `<form class="bs-example bs-example-form" role="form" style="width:300px;">
                                        <div class="row">
                                          <div class="col-lg-6">
                                            <div class="input-group" style="width:380px; float:left;">
                                              <span class="input-group-btn">
                                                <button class="btn btn-default" type="button">
                                                  商品条形码
                                                </button>
                                              </span>
                                              <input type="text" class="form-control barCode" >
                                            </div>
                                          </div>
                                        </div>  
                                    </form>`;
                        return cont;
                      },
                      createPayTab(){
                          return `
                          <caption style="font-size:16px;font-weight:bold;text-align:center">收银商品</caption>
                                  <thead>
                                      <tr>
                                        <th>序号</th>
                                        <th>条形码</th>
                                        <th>商品名称</th>
                                        <th>数量</th>
                                        <th>单价</th>
                                        <th>小计</th>
                                        <th style="width:120px;">操作</th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <td>total</td>
                                        <td colspan="2">总数量:<span class="goodsNum"></span>件</td>
                                        <td colspan="3">总价格:￥<span class="count"></span>元</td>
                                        <td style="padding:0px;"><button type="button" class="btn btn-default btn-sm pending" style="margin-left:10px;backgroundColor:#f20;">挂单</button><button type="button" class="btn btn-default btn-sm outOrder" style="margin:5px;">退单</button></td>
                                      </tr>
                                  </tfoot>
                                  <tbody></tbody> 
                          `;
                      },
                      getGoods(val){
                          $.post(global.apiBaseUrl +'getProduct',{barCode:val},(res)=>{
                              if(!res.status){
                                  return;
                              }
                              res.data[0].qty = 1;
                              var has = true;
                              if(this.allGoods != []){
                                  this.allGoods.forEach((item)=>{
                                      if(item.barCode === res.data[0].barCode){
                                          item.qty+= 1;
                                          has = false;
                                      }
                                  })
                              }else{
                                  this.allGoods.push(res.data[0]);
                              }
                              if(has){
                                  this.allGoods.push(res.data[0]);
                              }
                              this.createEle(this.allGoods);
                          })
                      },
                      createEle(data){
                            // 生成一个左边的收银表格;
                          var tab1 = this.createPayTab();
                          var cont = data.map((item,idx)=>{
                                              return `<tr class="success">
                                                        <td>${idx + 1}</td>
                                                        <td class="barCode">${item.barCode}</td>
                                                        <td class="detai">${item.name}</td>
                                                        <td class="qty"><span>${item.qty}</span></td>
                                                        <td>${item.price}</td>
                                                        <td class="allPrice">${item.qty * item.price}</td>
                                                        <td style="padding:2px;">
                                                        <button type="button" class="btn btn-primary btn-xs change">修改</button>
                                                        <button type="button" class="btn btn-primary btn-xs del" style="color:#f20;">删除</button>
                                                        </td>
                                                    </tr>`;
                                          }).join('');
                          this.$tabPay.html(tab1).find('tbody').html(cont).find('td').css({'textAlign':'center'}).find('button').css({'marginTop':2});
                          this.count();
                          var self = this;
                          // 删除;
                          $('.del').click(function(){
                              var barCode = $(this).parents('tr').children('.barCode').text();
                              var iCur = $(this).parents('tr').index();
                              self.$tabPay.find('tbody')[0].deleteRow(iCur);
                              self.allGoods.splice(iCur,1);
                              self.createEle(self.allGoods);
                          })
                          this.type = true;
                          // 修改;
                          $('.change').click(function(){
                              self.upGoods(this);
                              self.count();
                          })
                          this.$pay.find('.pending').click(()=>{
                              var tr = this.$pay.find('tbody').children();
                              if(tr.length == 0){
                                return;
                              }
                              this.$pay.find('tbody').html('');
                              this.$payClick.css('display','none');
                              this.pendOrder();
                          })
                          this.$pay.find('.outOrder').click(function(){
                            self.$pay.find('tbody').html('');
                            self.$payClick.css('display','none');
                            self.$tabPay.find('tfoot').find('.goodsNum').text('0').parents('td').siblings('td').find('.count').text('0');
                            self.allGoods = [];
                          })
                      },
                      count(){
                        var allqty = 0;
                        var count = 0;
                        this.allGoods.forEach((item)=>{
                            allqty += Number(item.qty);
                            count+= Number(item.price) * Number(item.qty);
                        })
                        count = count.toFixed(2);
                        this.$tabPay.find('tfoot').find('.goodsNum').text(allqty).parents('td').siblings('td').find('.count').text(count);
                        if(allqty > 0){
                          this.$payClick.css('display','block');
                        }else{
                          this.$payClick.css('display','none');
                        } 
                      },
                      upGoods(ele){
                        if(this.type){  
                            var $qty = $(ele).parents('tr').find('.qty');
                            var inp = $('<input/>').val($qty.text()).css('width',62);
                            $qty.html(inp);
                            $(ele).text('确定');
                            this.type = false;
                        }else{
                            var icurQty = $(ele).parents('tr').find('.qty').find('input').val();
                            var iCur = $(ele).parents('tr').index();
                            this.allGoods[iCur].qty = icurQty;
                            $(ele).parents('tr').find('.qty').html('<span>' + Number(icurQty) + '</span>')
                            $(ele).text('修改');
                            this.type = true;
                        }
                      },
                      pendOrder(){
                          var self = this;
                          var times = Date.now();
                          this.$tabPay.find('tfoot').find('.goodsNum').text('0').parents('td').siblings('td').find('.count').text('0');
                          $.post(global.apiBaseUrl + 'addPend',{'data':JSON.stringify(this.allGoods),'times':times},function(result){
                              if(!result.status){
                                  var div = $('<div/>').attr('id','myAlert').addClass('alert alert-warning');
                                  var cont = `
                                              <a href="#" class="close" data-dismiss="alert">&times;</a>

                                              <strong>警告！</strong>挂单失败!`;
                                  div.html(cont);
                                  self.$pay.append(div);
                                  $('.close').click(function(){
                                      $(div).alert();
                                  });
                              }else{
                                  var cont = '';
                                  self.allGoods.forEach((item)=>{
                                      cont += item.name + ',';
                                  });
                                  var listQty = self.allGoods.length;
                                  cont = cont.slice(0,-1);
                                  var list = `<div class="panel panel-info pendBox" data-qty=${listQty} data-times=${times}>
                                                <div class="panel-heading">
                                                    <h3 class="panel-title"><i class="glyphicon glyphicon-tag" style="margin-right:6px;"></i>未付款订单</h3>
                                                </div>
                                                <div class="panel-body">
                                                    ${cont}
                                                </div>
                                            </div>`;
                                  self.$pendTab.append(list);
                                  self.allGoods = [];
                                  $('.pendBox').click(function(){
                                    var mapNum = $(this).attr('data-qty');
                                    var time = $(this).attr('data-times');
                                    $.post(global.apiBaseUrl+'getP',{'times':time},(res)=>{
                                          if(res.status){
                                              var list = JSON.parse(res.data.data);
                                              var cont = '';
                                              self.allGoods = [];
                                              for(var i = 0;i < mapNum;i++){
                                                var cont = {
                                                  'barCode':list[i].barCode,
                                                  'name':list[i].name,
                                                  'qty':list[i].qty,
                                                  'price':list[i].price
                                                }
                                                self.allGoods.push(cont);
                                              }
                                              self.createEle(self.allGoods)
                                              $(this).remove();
                                          }
                                    })
                                  })
                              }
                          })
                      }  
                  }
                  $('.payBtn').click(()=>{       
                      payment.init();
                  })

                  //上架库存管理部分;
                   //上架管理
                  //
                  //
                  $('.ontheman').click(function(){
                    // console.log(666)
                      $.ajax({
                        url: global.apiBaseUrl+'getProduct',
                        type: 'post',
                        success: function(res){
                          // console.log(res)
                          var output = document.getElementById('output');
                          var html = '<table id="mytable"><tr><td>#</td><td>条形码</td><td>商品名称</td><td>分类</td><td>销售价</td><td>库存数量</td><td>操作</td></tr>';
                          res.data.map(function(item,index){
                              html+=`<tr>
                                  <td class='bns'>#</td>
                                  <td>${item.barCode}</td>
                                  <td>${item.name}</td>
                                  <td>${item.gener}</td>
                                  <td>${item.price}</td>
                                  <td>${item.inventNum}</td>
                                  <td>
                                      <button class="btn btn-default" id="putaway" value="上架">上架</button>
                                    </td>
                                </tr>`
                          }).join('');

                          html+="</table>"
                          output.innerHTML = html;

                          var tr = $('#mytable tbody').children();
                          // console.log($('#mytable tbody').children())

                          for(var i=0; i<tr.length; i++){
                              $(tr[i]).on('click', '#putaway', function(){
                                  
                                  var barCode = $(this).parent().parent().children('td')[1].innerHTML;
                                  var name = $(this).parent().parent().children('td')[2].innerHTML;
                                  var gener = $(this).parent().parent().children('td')[3].innerHTML;
                                  var price = $(this).parent().parent().children('td')[4].innerHTML;
                                  var inventNum = $(this).parent().parent().children('td').eq(5).text()-1;
                                  $(this).parent().parent().children('td').eq(5).text(inventNum);



                                  //上架socket
                                  var sockets = socket.connect('ws://10.3.135.12:99');

                                  var _data = JSON.stringify({
                                      'barCode': barCode,
                                      'name': name,
                                      'gener': gener,
                                      'inventNum': inventNum,
                                      'price': price
                                  });

                                  sockets.emit("send", {
                                      'data': window.encodeURI(_data)
                                  });
                                  _data = JSON.parse(_data);
                                  var data;
                                  $.post(global.apiBaseUrl+'getProduct',{'barCode':_data.barCode},function(res){
                                      res = res.data[0];
                                      res.putNum = (res.putNum - 0)+(res.inventNum - _data.inventNum);
                                      data = Object.assign({},res,_data);
                                      $.post(global.apiBaseUrl+'updateProduct',data,function(res){
                                          if(res.status){

                                          }
                                      })
                                  })

                              })
                          }



                        }
                      })
                  })
                   
                  // 采购管理模块
               $(".purchase").on("click",function(){
                    if(position === '员工'){
                      alert('没有权限访问@~@');
                      return;
                    }
                    // 清空页面内容
                    $('.yema').css('display','none');
                    $("#output").html("");
                    // 隐藏其他li下的ul
                    $(this).siblings("li").find("ul").slideUp();
                    $("<span/>").html("新增").css({"border":"1px solid #ccc",padding:"5px 10px","cursor":"pointer"}).attr("class","purchase_span").appendTo($("#output"));
                    $("<div/>").attr("class","purchase_div").appendTo($("#output"));
                    $("<div/>").attr("id","outPut").appendTo($("#output"));
                    // 一进页面发送请求
                    $.ajax({
                        type:"POST",
                        url:global.apiBaseUrl+'getPurchase',
                        success:function(res){
                            // 写入页面
                              var output = document.getElementById('outPut');
                              var html = '<table id="mytable" style="margin-top:20px;"><tr><td>#</td><td>采购单号</td><td>供应商</td><td>商品名称</td><td>商品条形码</td><td>进货价</td><td>进货数量</td><td>采购人</td><td>采购时间</td><td>操作</td></tr>';
                              if(res.data.length>0){
                                res.data.map(function(item,index){
                                    html+=`<tr>
                                          <td class='bns'>#</td>
                                          <td>${item.purchase}</td>
                                          <td>${item.supplier}</td>
                                          <td>${item.name}</td>
                                          <td>${item.barCode}</td>
                                          <td>${item.price}</td>
                                          <td>${item.count}</td>
                                          <td>${item.purchaser}</td>
                                          <td>${item.date}</td>
                                          <td  class='bns'>
                                              <input type="button" class="make_m" value="编辑"/>
                                              <input type="button" class="del_m" value="删除"/>
                                          </td>
                                        </tr>`
                                })
                                html+="</table>"
                                output.innerHTML = html;
                                $(".m2 .mh_box #output #mytable tr td").css({"padding":"10px 25px"});
                                delete_m1 = $(".del_m");
                                // 编辑、删除数据
                                var mytable = document.getElementById('mytable');
                                var tc = document.getElementById('tc');
                                var all = document.getElementById('all');
                                var del = document.getElementById('del');;
                                var output = $("#output")[0];
                                //
                                output.onclick = function(e){

                                    e = e || window.event;
                                    var target = e.target || e.srcElement;
                                    var currentTr = target.parentNode.parentNode;
                                    var input  = document.createElement('input');
                                    //当前tr
                                    if(target.tagName=='INPUT' && target.className=='make_m'){
                                         //console.log(currentTr.children[1].innerText);
                                         var input = content.getElementsByTagName('input');
                                         tc.style.display = 'block'
                                         all.style.display = 'block'
                                         //弹出框
                                         for(var i=1;i<=input.length-3;i++){
                                            //为什么i=1？因为第一行是不用改
                                          input[i-1].value = currentTr.children[i].innerHTML;
                                        }
                                         //遍历content下的input的标签数组让input的value值等于表格下对应行的innerText
                                        del.onclick = function(){
                                            tc.style.display = 'none'
                                            all.style.display = 'none'
                                        }
                                        //这里的函数没有参数e是因为没有使用事件源对象

                                        //保存上传数据
                                        $('.tsave').click(function(){
                                          var qiao = ['purchase','supplier','name','barCode','price','count','purchaser','date']
                                          var object_m = {};
                                          for(var i=0;i<qiao.length;i++){
                                              object_m[qiao[i]] = $('#content input').eq(i).val();
                                          }
                                          // 请求数据库修改
                                          $.post(global.apiBaseUrl+'updatePurchase',object_m,function(res){})

                                        })
                                    }
                                    
                                   // --------------------------------------------------------------
                                    tc.onclick  = function(e){
                                            e = e || window.event;
                                            var target = e.target || e.srcElement;
                                            //这里的事件源不能省略，下面这个判断target.tagName是否为BUTTON需要用到
                                            if(target.tagName=='BUTTON'){
                                                var content =  document.getElementById('content')
                                                for(var i=1;i<=input.length-3;i++){
                                                    currentTr.children[i].innerText = input[i-1].value;
                                                    //这里的current包含的源对象是output的源对象，所以不能把上面function（e）中的e省略
                                                }

                                                 tc.style.display = 'none'
                                                 all.style.display = 'none'

                                            }

                                    }
                                    //所有在output里面的函数都不能漏了参数e，不然无法传递事件源，效果出不来
                                    tc.style.left = window.innerWidth/2-tc.offsetWidth/2 + 'px'
                                    tc.style.top = window.innerHeight/2-tc.offsetHeight/2 + 'px'
                                }
                              }
                              
                        }
                    });
                    // 删除事件
                    $("#output").on("click",".del_m",function(){
                        $.post(global.apiBaseUrl + "deletePurchase",{
                            purchase:$(this).closest('tr').find("td").eq(1).text(),
                        },function(res){
                              console.log(res)
                            if(res.status){
                                // 发送请求，重新写入页面
                                $.ajax({
                                    type:"POST",
                                    url:global.apiBaseUrl+'getPurchase',
                                    success:function(res){
                                        $("#outPut").html("");
                                        // 写入页面
                                          var output = document.getElementById('outPut');
                                          var html = '<table id="mytable" style="margin-top:20px;"><tr><td>#</td><td>采购单号</td><td>供应商</td><td>商品名称</td><td>商品二维码</td><td>进货价</td><td>进货数量</td><td>采购人</td><td>采购时间</td><td>操作</td></tr>';
                                          if(!res.status){
                                              return;
                                          }
                                          res.data.map(function(item,index){
                                              html+=`<tr>
                                                    <td class='bns'>#</td>
                                                    <td>${item.purchase}</td>
                                                    <td>${item.supplier}</td>
                                                    <td>${item.name}</td>
                                                    <td>${item.barCode}</td>
                                                    <td>${item.price}</td>
                                                    <td>${item.count}</td>
                                                    <td>${item.purchaser}</td>
                                                    <td>${item.date}</td>
                                                    <td  class='bns'>
                                                        <input type="button" class="make_m" value="编辑"/>
                                                        <input type="button" class="del_m" value="删除"/>
                                                    </td>
                                                  </tr>`
                                          })
                                          html+="</table>"
                                          output.innerHTML = html;
                                          $(".m2 .mh_box #output #mytable tr td").css({"padding":"10px 25px"});
                                    }
                                });
                            }
                        })
                    });
                    
                    
                    // 添加新采购单事件
                    $(".purchase_span").on("click",function(){
                        $("#outPut").html("");
                        $(".purchase_div")[0].innerHTML = `<table style="margin-top:20px;"  class='mtable'>
                           <tr>
                              <td>采购单号</td>
                              <td>供应商</td>
                              <td>商品名称</td>
                              <td>商品二维码</td>
                              <td>进货价</td>
                              <td>进货数量</td>
                              <td>采购人</td>
                              <td>采购时间</td>
                              <td>操作</td>
                            </tr>
                           <tr class='mtable_tr'>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td><input type="button" value="确认" id = "btn_m"/></td>
                            </tr>
                           </table>`;
                        $(".m2 .mh_box #output .mtable tr td").css({"padding":"10px 30px"});

                        // 点击编辑事件
                        $(".mtable_tr").on("click","td",function(){
                            if($(this).find("input").length > 0){
                                return;
                            }
                            var count = $(this).text();
                            $(this).html("");
                            var $input = $("<input/>");
                            $input.val(count);
                            $input.css({"outline":0,width:'40px',height:'16px'});
                            $input.appendTo($(this));
                            $input.focus();
                            $input.blur(function(){
                                $(this).html($input.val());
                                $input.remove();
                            }.bind(this));
                        });
                        // 发送请求
                        $("#btn_m").on("click",function(){
                            $(".purchase_div").html("");
                            $.post(global.apiBaseUrl + "addPurchase",{
                                purchase:$(this).closest('tr').find("td").eq(0).text(),
                                supplier:$(this).closest('tr').find("td").eq(1).text(),
                                name:$(this).closest('tr').find("td").eq(2).text(),
                                barCode:$(this).closest('tr').find("td").eq(3).text(),
                                price:$(this).closest('tr').find("td").eq(4).text(),
                                count:$(this).closest('tr').find("td").eq(5).text(),
                                purchaser:$(this).closest('tr').find("td").eq(6).text(),
                                date:$(this).closest('tr').find("td").eq(7).text(),
                            },function(res){
                                if(res.status){
                                    // 发送请求，重新写入页面
                                    $.post(global.apiBaseUrl + "getPurchase",function(res){
                                        // 发送请求
                                        $.ajax({
                                            type:"POST",
                                            url:global.apiBaseUrl+'getPurchase',
                                            success:function(res){
                                                // 写入页面
                                                  var output = document.getElementById('outPut');
                                                  var html = '<table id="mytable" style="margin-top:20px;"><tr><td>#</td><td>采购单号</td><td>供应商</td><td>商品名称</td><td>商品二维码</td><td>进货价</td><td>进货数量</td><td>采购人</td><td>采购时间</td><td>操作</td></tr>';
                                                  res.data.map(function(item,index){
                                                      html+=`<tr>
                                                            <td class='bns'>#</td>
                                                            <td>${item.purchase}</td>
                                                            <td>${item.supplier}</td>
                                                            <td>${item.name}</td>
                                                            <td>${item.barCode}</td>
                                                            <td>${item.price}</td>
                                                            <td>${item.count}</td>
                                                            <td>${item.purchaser}</td>
                                                            <td>${item.date}</td>
                                                            <td  class='bns'>
                                                                <input type="button" class="make_m" value="编辑"/>
                                                                <input type="button" class="del_m" value="删除"/>
                                                            </td>
                                                          </tr>`
                                                  })
                                                  html+="</table>"
                                                  output.innerHTML = html;
                                                  $(".m2 .mh_box #output #mytable tr td").css({"padding":"10px 25px"});
                                            }
                                        });
                                    })
                                }
                            })
                        })
                    });
                    // 搜索事件
                    // 搜索商品功能请求数据库---------------------
                    $('.mh_select').click(function(){
                        keyword = $('#searchp').val();
                        var attr = $('#sou').val();
                        if(keyword ==''){
                            $('.tipnull').text('请输入关键词！')
                            $('.tipnull').fadeIn();
                            setTimeout(function(){
                                $('.tipnull').fadeOut();
                            },2000)
                            return;
                        }else{
                          $.post(global.apiBaseUrl+'getPurchase',{[attr]:keyword},function(res){
                              // console.log(res);
                              if(!res.status){
                                  $('.tipnull').text('搜索结果为空,请注意分类查询')
                                  $('.tipnull').fadeIn();
                                  setTimeout(function(){
                                        $('.tipnull').fadeOut();
                                  },2000)
                              }else{
                                console.log(res)
                                  $("#outPut").html("");
                                  // 写入页面
                                    var output = document.getElementById('outPut');
                                    var html = '<table id="mytable" style="margin-top:20px;"><tr><td>#</td><td>采购单号</td><td>供应商</td><td>商品名称</td><td>商品二维码</td><td>进货价</td><td>进货数量</td><td>采购人</td><td>采购时间</td><td>操作</td></tr>';
                                    res.data.map(function(item,index){
                                        html+=`<tr>
                                              <td class='bns'>#</td>
                                              <td>${item.purchase}</td>
                                              <td>${item.supplier}</td>
                                              <td>${item.name}</td>
                                              <td>${item.barCode}</td>
                                              <td>${item.price}</td>
                                              <td>${item.count}</td>
                                              <td>${item.purchaser}</td>
                                              <td>${item.date}</td>
                                              <td  class='bns'>
                                                  <input type="button" class="make_m" value="编辑"/>
                                                  <input type="button" class="del_m" value="删除"/>
                                              </td>
                                            </tr>`
                                    })
                                    html+="</table>"
                                    output.innerHTML = html;
                                    $(".m2 .mh_box #output #mytable tr td").css({"padding":"10px 25px"});
                                  // ivan(res);
                                  //   // 修改商品数据-----------------------
                                  //   modify();
                                  //   // 删除商品数据事件---------------------
                                  //   delgoods();
                              }
                          })
                        }
                    });
                    $(".del_m").css("border","1px solid #ccc");
                    $(".mate_m").css("border","1px solid #ccc");
               }) 
            }
           
    })
})