var express = require('express');
var router = express.Router();

var dash_controller = require("../controller/dash_controller.js");
const usrlog_session = require('../models/userlogin.js').userlogchk;
const common = require('../common.js');
const loggedin = function(req,res,next){
  if(req.User){
    next();
  }else{
    res.redirect('/login');
  }

}


/* GET home page. */
router.get('/', loggedin, dash_controller.dashboard);

router.post('/update_user_password', loggedin, dash_controller.update_user_password);

router.get('/user_dashboard/:match_id', loggedin, dash_controller.match_monitor);

router.get('/ball_running/:match_id',loggedin,dash_controller.ball_running)

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/login/failure', function(req, res, next) {
  let  message = req.flash('error');
  res.render('login',{Message:message});
});

router.get('/logout',function(req,res,next){
  common.removeValue(usrlog_session,{usr_id : req.User._id});
  req.logout();
  res.redirect('/');
});


module.exports = router;
