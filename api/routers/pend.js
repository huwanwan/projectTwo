/* 
* @Author: Marte
* @Date:   2017-11-27 11:51:45
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-28 09:13:52
*/
var mongo = require('../db/dbHelpers').Mongo;
var apiResult = require('../modules/apiResult');

module.exports = {
    action:function(app){
        app.post('/addPend',function(req,res){
            mongo.insert('pend',req.body,function(_result){
                if(_result.status && _result.data.result.n === 1){
                    res.send(apiResult(true,_result.data.ops));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        });
        app.post('/getP',function(req,res){
            mongo.select('pend',req.body,function(_res){
                if(_res.status && _res.data.length > 0){
                    mongo.delete('pend',req.body,function(_result){
                        if(_result.status && _result.data.length > 0){
                                console.log(_result)
                        }
                    })
                    res.send(apiResult(true,_res.data[0]));
                  
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        })
    }
}