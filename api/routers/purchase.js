var mongo = require('../db/dbHelpers').Mongo;
var apiResult = require('../modules/apiResult');
module.exports = {
    action:function(app){
        app.post('/addPurchase',function(req,res){
            mongo.insert('purchase',req.body,function(_result){
                if(_result.status && _result.data.result.n == 1){
                    res.send(apiResult(true,_result.data.ops))
                }else{
                    res.send(apiResult(false,{'err':'error'}))
                }
            })
        }),
        app.post('/getPurchase',function(req,res){
            mongo.select('purchase',req.body,function(_result){
                if(_result.status && _result.data.length > 0){
                    console.log(_result)
                    res.send(apiResult(true,_result.data));
                }else{
                    res.send(apiResult(false,{'err':'error'}));
                }
            })
        });
    }
}