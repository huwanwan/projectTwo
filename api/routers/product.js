/* 
* @Author: Marte
* @Date:   2017-11-24 18:51:14
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-27 16:22:46
*/
var mongo = require('../db/dbHelpers').Mongo;
var apiResult = require('../modules/apiResult');

module.exports = {
    action:function(app){
        app.post('/addProduct',function(req,res){
            mongo.insert('product',req.body,function(_result){
                if(_result.status && _result.data.result.n == 1){
                    res.send(apiResult(true,_result.data.ops));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        });
        app.post('/delProduct',function(req,res){
            console.log(req.body)
            mongo.delete('product',req.body,function(_result){
                if(_result.status && _result.data.result.n == 1){
                    res.send(apiResult(true,_result.data));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        })
        app.post('/getProduct',function(req,res){
            var qty;
            var pageNo;
            if(req.body.qty){
                pageNo = Number(req.body.pageNo);
                qty = Number(req.body.qty);
                delete req.body.qty;
                delete req.body.pageNo;  
            }
            mongo.select('product',req.body||{},function(_result){
                if(_result.status && _result.data.length > 0){
                    if(qty && pageNo){      
                        var allPage = _result.data.length;
                        var dataList = _result.data.slice((qty*(pageNo-1)),(qty*pageNo));
                        res.send(apiResult(true,[dataList,allPage]));
                    }else{
                        res.send(apiResult(true,_result.data));
                    }
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        })
        app.post('/updateProduct',function(req,res){
            mongo.upload('product',req.body,function(_result){
                if(_result.status &&_result.data.result.n == 1){
                    res.send(apiResult(true,_result.data));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        })
    }
}