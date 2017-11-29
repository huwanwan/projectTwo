/* 
* @Author: Marte
* @Date:   2017-11-27 09:02:01
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-28 13:10:23
*/
var mongo = require('../db/dbHelpers').Mongo;
var apiResult = require('../modules/apiResult');
module.exports = {
    action:function(app){
        app.post('/addOrder',function(req,res){
            mongo.insert('order',req.body,function(_result){
                if(_result.status && _result.data.result.n == 1){
                    res.send(apiResult(true,_result.data.ops))
                }else{
                    res.send(apiResult(false,{'err':'error'}))
                }
            })
        }),
        app.post('/getOrder',function(req,res){
            mongo.select('order',req.body,function(_result){
                if(_result.status && _result.data.length > 0){
                    console.log(_result)
                    res.send(apiResult(true,_result.data));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        });
        app.post('/upOrder',function(req,res){
            mongo.upload('order',req.body,function(_result){
                if(_result.status && _result.data.result.n == 1){
                    res.send(apiResult(true,_result.data.ops))
                }else{
                    res.send(apiResult(false,{'err':'error'}))
                }
            })
        })
    }
}