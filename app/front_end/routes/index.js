var express = require('express');
var router = express.Router();

var dash_controller = require("../controller/dash_controller.js");
const usrlog_session = require('../models/userlogin.js').userlogchk;
var User = require('../models/userlogin.js').userlog;

const common = require('../common.js');
const loggedin =  async function(req,res,next){
try {
  const session_id = req.cookies.session_id_user;
  console.log("Getting session", session_id)
  await usrlog_session.find({session_id: session_id}).then((async (data,error)=>{
    console.log("GETTING", data, error)
    if(!data.length){
      res.redirect("/login");
      return;
    }
    await User.findOne({_id : data[0]?.usr_id} , (err,loggedData)=>{
      console.log("Decsision", err , loggedData);
      if(loggedData?._id){
            req.User = {
                _id : loggedData._id,
                username : loggedData.username
            };
          next();
      }else{
         res.redirect("/login");
      }
    });
  }))

} catch(error) {
  console.log("Error " , error);
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

router.get("/logout", function (req, res, next) {
    const cookies = Object.keys(req.cookies);
    cookies.forEach(cookieName => {
      if(cookieName === 'session_id_user'){
          res.clearCookie(cookieName);
      }
    });
  res.redirect('/login');
});


module.exports = router;
