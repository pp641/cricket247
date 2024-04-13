const db = require('mongodb');
const ObjectID = db.ObjectID;

const common = {};

common.getDataByID = async function (model,id){
    return await model.findOne({'_id' : new ObjectID(id)}).exec();
}

common.getData = async function (model){
    return await model.find({}).exec();
}

common.getDataByColSingle = async function (model, value){
    return await model.findOne(value).exec();
}

common.getDataByValueSort = async function (model, value, sort){
    return await model.find(value).sort(sort).exec();
}

common.getDataByCol = async function (model, col, value){
    val = {}
    val[col] =value;
    return await model.find(val).exec();
}

common.getDataByValue = async function (model, value){
    return await model.find(value).exec();
}

common.getDataByMoreDate = async function (model, value ){
    return await model.find({ updation_time : { $lte: value } ,$where : "this.updation_time > this.last_update_time"}).exec();
}

common.getDataByMoreDate_match_id = async function (model, value, match_id, market_type){
    return await model.find({ updation_time : { $lte: value } ,$where : "this.updation_time > this.last_update_time", gen_id : match_id, market_type : market_type}).exec();
}

common.getDataByIDCallback = function(model, id){
    return model.findOne({'_id' : new ObjectID(id)});
}

common.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

common.updatecontition = async function(model,value,where){
    return model.updateOne(where,{$set :value});
}

common.updateMany = async function(model, where, value){
    return await model.updateMany(where,{$set: value});
}

common.update = async function(model, id,value){
    return await model.updateOne({'_id' : new ObjectID(id)},{$set: value});
}

common.removeValue = async function(model, value){
    return await model.deleteMany(value);
}

module.exports = common;