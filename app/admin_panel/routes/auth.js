var express = require("express");
var router = express.Router();
var User = require("../models/userlogin.js").admin_user;
const loguser = require("../models/admin_session.js").front_session;
const common = require("../common.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

  router.post("/signup", function (req, res) {
    var admin_name = req.body.admin_name;
    var username = req.body.admin_user;
    var password = req.body.admin_password;
    var admin_type = req.body.admin_type;
    var admin_status = req.body.admin_status;
    login.findOne({ username: username }, function (error, result) {
      if (error) {
        console.log("here error");
        res.status(500).send(error);
      } else {
        if (result) {
          res
            .status(500)
            .send(
              "<script>alert('Username Already Exits');" +
                " window.location = '/admin_panel/manage_admin'</script>"
            );
        } else {
          var record = new login();
          record.admin_name = admin_name;
          record.username = username;
          record.password = record.hashPassword(password);
          record.admin_type = admin_type;
          record.admin_status = admin_status;
          record.save(function (err, result) {
            if (err) {
              console.log(err);
              res
                .status(500)
                .send(
                  "<script>alert('Sorry! Try again Later.');" +
                    " window.location = '/admin_panel/manage_admin'</script>"
                );
            } else {
              res.send(
                "<script>alert('Sign Up Successfully');" +
                  " window.location = '/admin_panel/manage_admin'</script>"
              );
            }
          });
        }
      }
    });
  });
  router.post("/change_password", async function (req, res) {
    console.log("changing password" , req.body)
    let admin_id = req.body.admin_user_id;
    let admin_password = req.body.New_Password;
    let record = new login();
    let new_password = record.hashPassword(admin_password);
    await common.update(login, admin_id, { password: new_password });
    res.send(
      "<script>alert('Password Changed Successfully');" +
        " window.location = '/admin_panel/manage_admin'</script>"
    );
  });

  router.post("/change_admin_password", async function(req, res) {
      console.log("request body", req.body , req.sessionID, req.session)
      let old_password = req.body.user_old_password;
      let new_password = req.body.user_new_password;
      let confirm_password = req.body.confirm_user_new_password;
      let admin_user_id = req.session.passport.user.userID
      if(new_password === confirm_password) {
      let record = new login();
      await common.update(login, admin_user_id, { password: new_password });
      res.send(
        "<script>alert('Password Changed Successfully')" + 
        " window.location = '/admin_panel/online_users'</script>"
      );
    }
    else{
      res.send(
        "<script>alert('Passwords do not match');" +
        " window.location = '/admin_panel/online_users'</script>"
      );
    }
  })


  async function authenticate(req, res) {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed. User not found.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      }
  
      const payload = { id: user._id, username: user.username };
      const sessionId = uuidv4();
      const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '1h' });
      const old_session  = await loguser.findOne({user_id: user._id});

      if(old_session){
      await loguser.deleteOne({ user_id: user._id });
      }
      await new loguser({ session_id: sessionId, user_id: user._id, token }).save();
  
      res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 3600000 });
      res.redirect('/admin_panel/');
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }





  router.post(
    "/login",
      authenticate
  );


  module.exports=  router;

