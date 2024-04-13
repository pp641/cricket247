const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const schema = mongoose.Schema;
const schemeList = [];
const adminlogSchema = new schema({
    admin_name:{
        type : String,
        required : true,
        trim : true
    },
    username:{
        type : String,
        required : true, 
        trim : true
    },
    password:{
        type : String,
        required :true, 
        trim : true
    },
    admin_type : {
        type: Number,
        required : true,
        trim : true
    },
    admin_status : {
        type : Number,
        required : true,
        trim : true
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now 
    }

});

adminlogSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

adminlogSchema.methods.comparepassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}

const userlogSchema = new schema({
    first_name:{
        type : String,
        required : true,
        trim : true
    },
    last_name:{
        type : String,
        required : true,
        trim : true
    },
    username:{
        type:String,
        required:true, 
        trim: true
    },
    password:{
        type:String,
        required:true, 
        trim: true
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now,
        index: true 
    }
});

const admin_usrlog_session = new schema({
    usr_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    exp_time : {
        type : Date
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
});

const Main_News = new schema({
    news_text : {
        type : String, 
        required : true,
        trim : true
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
});

userlogSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userlogSchema.methods.comparepassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}

schemeList.reg_user = mongoose.model("userlog",userlogSchema,"userlog");
schemeList.admin_user = mongoose.model("adminlog",adminlogSchema,"adminlog");
schemeList.admin_user_check = mongoose.model("adminlogChk",admin_usrlog_session,"adminlogChk");
schemeList.Main_News = mongoose.model("Main_News",Main_News,"Main_News");
module.exports = schemeList;
