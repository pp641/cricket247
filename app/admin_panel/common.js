const db = require('mongodb');
const ObjectID = db.ObjectID;

const common = {};

common.getDataByID = async function (model,id){
    if(!ObjectID.isValid(id))
    {
        return {};
    }
    return await model.findOne({'_id' : new ObjectID(id)}).exec();
}

common.getData = async function (model){
    return await model.find({}).exec();
}

common.getDataSelect = async function (model, Select){
    return await model.find({}).select(Select).exec();
}

common.getDataByCol = async function (model, value){
    return await model.find(value).exec();
}

common.getDataByColSingle = async function (model, value){
    return await model.findOne(value).exec();
}

common.getDataByColOrder = async function (model, value,sort){
    return await model.find(value).sort(sort).exec();
}
common.getDataByColOrderlimit = async function (model, value,sort,limit){
    return await model.find(value).sort(sort).limit(limit).exec();
}
common.getDataByColOrderskip = async function (model, value,sort,limit){
    return await model.find(value).sort(sort).skip(limit).exec();
}
common.getDataByIDCallback = function(model, id){
    if(!ObjectID.isValid(id))
    {
        return {};
    }
    return model.findOne({'_id' : new ObjectID(id)});
}

common.getDataByValue = async function (model, value){
    return await model.find(value).exec();
}
common.getDataByValueSort = async function (model, value, sort){
    return await model.find(value).sort(sort).exec();
}
common.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

common.updateincDesc = async function(model, id,value){
    if(!ObjectID.isValid(id))
    {
        return {};
    }
    return await model.updateOne({'_id' : new ObjectID(id)},{$inc: value});
}

common.update = async function(model, id,value){
    if(!ObjectID.isValid(id))
    {
        return {};
    }
    return await model.updateOne({'_id' : new ObjectID(id)},{$set: value});
}

common.remove = async function(model, id){
    if(!ObjectID.isValid(id))
    {
        return {};
    }
    return await model.deleteOne({'_id' : new ObjectID(id)});
}
common.removeValue = async function(model, value){
    return await model.deleteMany(value);
}
common.updateMany = async function(model, where, value){
    return await model.updateMany(where,{$set: value});
}
common.updatebyCol = async function(model, where ,value){
    return await model.updateOne(where,{$set: value});
}

module.exports = common;