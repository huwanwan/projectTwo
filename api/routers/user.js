/* 
* @Author: Marte
* @Date:   2017-11-24 17:25:53
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-25 11:30:29
*/
var jwt = require('jsonwebtoken');
var mongo = require('../db/dbHelpers').Mongo;
var apiResult = require('../modules/apiResult');
module.exports = {
    action:function(app){
                app.post('/register',function(req,res){
                    mongo.select('user',{'username':req.body.username},function(_result){
                        if(_result.status && _result.data.length > 0){
                            res.send(apiResult(false,_result.data));
                        }else if(_result.status && _result.data.length == 0){
                            mongo.insert('user',req.body,function(_result){
                                if(_result.status && _result.data.result.n === 1){
                                    res.send(apiResult(true,_result.data.ops));
                                }else{
                                    res.send(apiResult(false,{'err':'error'}));
                                }
                            })
                        }else{
                            res.send(apiResult(false,{'err':'error'}));
                        }
                    })
                });
                app.post('/login',function(req,res){
                    mongo.select('user',req.body,function(_result){

                        if(_result.status && _result.data.length > 0){
                            var token = jwt.sign({username : req.body.username},'secret',{
                                    expiresIn: 999
                                });
                            console.log('ok')
                            res.send(apiResult(_result.status,{'token':token}));
                        }else{
                            console.log('fail')
                            res.send(apiResult(false,_result.data));
                        }
                    });
                });
                app.post('/delUser',function(req,res){
                    mongo.delete('user',req.body,function(_result){
                        if(_result.status && _result.data.result.n === 1){
                            res.send(apiResult(true,_result.data));
                        }else{
                            console.log('fail')
                            res.send(apiResult(false,_result.data));
                        }
                    });
                });
                app.post('/upUser',function(req,res){
                    mongo.upload('user',req.body,function(_result){
                        if(_result.status && _result.data.result.n === 1){
                            console.log('ok');
                            res.send(apiResult(true,_result.data));
                        }else{
                            console.log('fail')
                            res.send(apiResult(false,_result.data));
                        }
                    })
                })
    }
}