/* 
* @Author: Marte
* @Date:   2017-11-24 16:11:46
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-28 13:13:06
*/

var mongoClient = require('mongodb').MongoClient;
var apiResult = require('../modules/apiResult');
var url = 'mongodb://10.3.135.12:27017/project';
var db;
mongoClient.connect(url,function(_err,_db){
    if(_err){
        console.log('err' + _err);
    }
    db = _db;
})
module.exports = {
    select:function(_collection,_condition,_cb){
        db.collection(_collection).find(_condition || {}).toArray(function(_err,_result){
            console.log(_result)
            _cb(apiResult(_err ? false : true,_err || _result));
        })
    },
    insert:function(_collection,_condition,_cb){
        db.collection(_collection).insert(_condition,function(_err,_result){
            _cb(apiResult(_err ? false : true,_err || _result));
        })
    },
    upload:function(_collection,_condition,_cb){
        var whereData; 
        var seleData;
        if(_collection == 'product'){
            seleData = {'barCode' : _condition.barCode};
        }else if(_collection == 'user'){
            seleData = {'name' : _condition.name};
        }else if(_collection == 'order'){
            seleData = {'orderNum':_condition.orderNum};
        }
        db.collection(_collection).find(seleData).toArray(function(_err,_result){
            if(_err){
                console.log('err:' + err);
            }else{
                whereData = _result;
            }
            db.collection(_collection).update(whereData[0],_condition,function(_err,_result){
                _cb(apiResult(_err ? false : true,_err || _result));
            })
        })
    },
    delete:function(_collection,_condition,_cb){
        db.collection(_collection).remove(_condition, function(_err, _result){
            _cb(apiResult(_err ? false : true,_err || _result));
        })
    }
}