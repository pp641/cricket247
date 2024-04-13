var express = require('express');
var router = express.Router();

var login = require('../models/userlogin.js').admin_user;
var loguser = require('../models/userlogin.js').reg_user;
const common = require('../common.js');

module.exports = function(passport){
    
    router.post('/signup', function(req, res) {
        var admin_name = req.body.admin_name;
        var username = req.body.admin_user;
        var password = req.body.admin_password;
        var admin_type = req.body.admin_type;
        var admin_status = req.body.admin_status;
        login.findOne({username:username},function(error,result){
            if(error){
                res.status(500).send(error)
            }else{
                if(result){
                    res.status(500).send("<script>alert('Username Already Exits');"
                    +" window.location = '/admin_panel/manage_admin'</script>");
                    
                }else{
                    var record = new login();
                    record.admin_name = admin_name;
                    record.username = username;
                    record.password = record.hashPassword(password);
                    record.admin_type = admin_type;
                    record.admin_status = admin_status;
                    record.save(function(err,result){
                        if(err){
                            console.log(err);
                            res.status(500).send("<script>alert('Sorry! Try again Later.');"
                            +" window.location = '/admin_panel/manage_admin'</script>");

                        }else{
                            res.send("<script>alert('Sign Up Successfully');"
                            +" window.location = '/admin_panel/manage_admin'</script>");
                        }
                    });
                }
            }
        });
    });
    router.post('/change_password',async function(req, res){
        let admin_id = req.body.admin_user_id;
        let admin_password = req.body.New_Password;
        let record = new login();
        let new_password = record.hashPassword(admin_password);
        await common.update(login,admin_id,{password :new_password });
        res.send("<script>alert('Password Changed Successfully');"
                            +" window.location = '/admin_panel/manage_admin'</script>");
    });
    router.post('/change_password_user',async function(req, res){
        let admin_id = req.body.admin_user_id;
        let admin_password = req.body.New_Password;
        // res.send(admin_password)
        let record = new loguser();
        let new_password = record.hashPassword(admin_password);
        await common.update(loguser,admin_id,{password :new_password });
        res.send("<script>alert('Password Changed Successfully');"
                            +" window.location = '/admin_panel/manage_registered_member'</script>");
    });
    
    router.post('/login',passport.authenticate('local',{
        failureRedirect:'/admin_panel/login/failure',
        successRedirect:'/admin_panel/',
        failureFlash: true
    }),function(req,res){
        res.send(res);
    });
    return router;
};