const express = require('express');
const router = express.Router();
const userController = require("../controller/user.js");
const matchController = require("../controller/matchController.js");
const ballRunningController = require("../controller/ball_running.js");
const usrlog_session = require('../models/userlogin.js').admin_user_check;
const common = require('../common.js');
const loggedin = function(req,res,next){
  if(req.adminUser){
    next();
  }else{
    res.redirect('/admin_panel/login')
  }

}

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/failure', function(req, res, next) {
  let  message = req.flash('error');
  res.render('login',{Message:message});
});


router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/logout',function(req,res,next){
  common.removeValue(usrlog_session,{usr_id : req.adminUser._id});
  req.logout();
  res.redirect('/admin_panel');
});

//After Login
//Get
router.get('/',loggedin,userController.dashboard);
router.get('/online_users',loggedin,userController.online_users);
router.get('/admin_online_users',loggedin,userController.admin_online_users);

router.post('/update_user_log',userController.update_user_log);

router.get('/manage_game',loggedin,matchController.match_game);
router.get('/manage_game_event',loggedin,matchController.match_game_event);
router.get('/manage_game_date',loggedin,matchController.manage_game_date);
router.get('/manage_live_game',loggedin,matchController.manage_live_game);
router.get('/create_matchodds',loggedin,matchController.create_matchodds);
router.get('/manage_admin',loggedin,matchController.manage_admin);
router.get('/manage_registered_member',loggedin,matchController.manage_registered_member);
router.get('/change_password/:admin_user_id',loggedin,matchController.change_password);
router.get('/change_password_user/:front_user',loggedin,matchController.change_password_user);

//Get Edit
router.get('/edit_game/:game_id',loggedin,matchController.edit_game);
router.get('/edit_event/:event_id',loggedin, matchController.edit_event);
router.get('/edit_event_date/:event_date_id',loggedin, matchController.edit_event_date);
router.get('/edit_live_game/:live_game_id',loggedin, matchController.edit_live_game);
//Ball Running
router.get('/manage_ball_running/:match_id', loggedin, ballRunningController.manage_ball_running);

//Delete
router.get('/delete_gen/:gen_id',loggedin,matchController.delete_gen);
router.get('/delete_live_game/:live_game_id',loggedin, matchController.delete_live_game);
router.get('/delete_date/:date_id', loggedin, matchController.delete_date);
router.get('/delete_reg_user/:reg_id',loggedin, matchController.delete_reg_user);
router.get('/delete_admin/:admin_id',loggedin, matchController.delete_admin);
router.get('/delete_game/:game_id',matchController.delete_game);
router.get('/delete_event/:event_id',matchController.delete_event);

//Match_odds
router.get('/match_odds_selection',loggedin,matchController.match_odds_selection);
router.get('/manage_match_odds/:match_id',loggedin,matchController.manage_match_odds);
router.get('/manage_match_odds_user/:match_id',loggedin,matchController.manage_match_odds_user);
router.get('/alot_user/:match_id',loggedin,matchController.alot_user);



//Post
router.post('/save_manage_game',loggedin,matchController.save_match_game);
router.post('/save_manage_event',loggedin,matchController.save_match_event);
router.post('/save_match_date',loggedin,matchController.save_match_date);
router.post('/save_match_live_game',loggedin,matchController.save_match_live_game);
router.post('/save_create_matchodds',loggedin,matchController.save_create_matchodds);
router.post('/save_match_reg_user',loggedin,matchController.save_match_reg_user)
//Post Edit
router.get('/edit_admin/:admin_id',loggedin,matchController.edit_admin);
router.post('/edit_manage_admin/:admin_id',loggedin,matchController.edit_manage_admin);
router.post('/edit_manage_game/:game_id',loggedin,matchController.edit_manage_game);
router.post('/edit_manage_event/:event_id',loggedin,matchController.edit_manage_event);
router.post('/edit_manage_date/:event_date_id',loggedin, matchController.edit_manage_date);
router.post('/edit_manage_live_game/:live_game_id',loggedin, matchController.edit_manage_live_game);
//
router.post('/get_match_events',matchController.get_match_events);
router.post('/get_match_date',matchController.get_match_date);


module.exports = router;
