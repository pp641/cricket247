var express = require('express');
var router = express.Router();

var login = require('../models/userlogin.js').userlog;

module.exports = function(passport){
    
    
    router.post('/login',passport.authenticate('local',{
        failureRedirect:'/login/failure',
        successRedirect:'/',
        failureFlash: true
    }),function(req,res){
        
    });
    
    return router;
};