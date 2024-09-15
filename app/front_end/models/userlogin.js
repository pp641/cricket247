const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const schema = mongoose.Schema;

const userlogSchema = new schema({
    username:{
        type:String,
        required:true, 
        trim: true
    },
    password:{
        type:String,
        required:true, 
        trim: true
    }
});

const usrlog_session = new schema({
    session_id : {
        type : String
    },
    token : {
        type: String
    },
    usr_id : {
        type : String,
        required : true,
        trim : true
    },
    exp_time : {
        type : Date
    }
});
const Main_News = new schema({
    news_text : {
        type : String, 
        required : true,
        trim : true
    }
});

userlogSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userlogSchema.methods.comparepassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}
const schemaList = {}
schemaList.userlog = mongoose.model("userlog",userlogSchema,"userlog");
schemaList.userlogchk = mongoose.model("userlogChk",usrlog_session,"userlogChk");
schemaList.Main_News = mongoose.model("Main_News",Main_News,"Main_News");
module.exports = schemaList;
