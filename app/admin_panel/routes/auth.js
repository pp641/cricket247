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
    User.findOne({ username: username }, function (error, result) {
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
          var record = new User();
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
    let record = new User();
    let new_password = record.hashPassword(admin_password);
    await common.update(User, admin_id, { password: new_password });
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
      let record = new User();
      await common.update(record, admin_user_id, { password: new_password });
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
      const user = await User.findOne({ username : username });
      if (!user) {
        return res.send(
          "<script>alert('Authentication failed. User not found');" +
          "window.location = '/admin_panel/login'</script>"
        );
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send(
          "<script>alert('Passwords does not match');" +
          "window.location = '/admin_panel/login'</script>"
        );
      }
  
      const payload = { id: user._id, username: user.username };
      const sessionId = uuidv4();
      const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '24h' });
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


  // async function authenticate(req, res) {
  //   const { username, password } = req.body;
  
  //   try {
  //     const user = await User.findOne({ username });
  //     if (!user) {
  //       req.flash('error', 'Authentication failed. User not found.');
  //       return res.redirect('/login');
  //     }
  
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) {
  //       req.flash('error', 'Authentication failed. Wrong password.');
  //       return res.redirect('/login');
  //     }
  
  //     const payload = { id: user._id, username: user.username };
  //     const sessionId = uuidv4();
  //     const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '1h' });
  //     const oldSession = await loguser.findOne({ user_id: user._id });
  
  //     if (oldSession) {
  //       await loguser.deleteOne({ user_id: user._id });
  //     }
  //     await new loguser({ session_id: sessionId, user_id: user._id, token }).save();
  
  //     res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 3600000 });
  //     req.flash('success', 'Authentication successful.');
  //     res.redirect('/admin_panel/');
  //   } catch (error) {
  //     console.error('Error during authentication:', error);
  //     req.flash('error', 'Internal server error.');
  //     res.redirect('/login');
  //   }
  // }
  



  router.post(
    "/login",
      authenticate
  );




  router.post('/change_mini_admin_password', async (req, res) => {
    try {
      const { admin_user_id, Old_Password, New_Password, Confirm_New_Password } = req.body;
  
      if (New_Password !== Confirm_New_Password) {
        return res.status(400).send('New Password and Confirm New Password do not match');
      }
  
      const user = await User.findById(admin_user_id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const isMatch = await bcrypt.compare(Old_Password, user.password);
      if (!isMatch) {
        return res.status(400).send('Old Password is incorrect');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(New_Password, salt);
  
      user.password = hashedNewPassword;
      await user.save();
  
      res.redirect('/admin_panel/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


  module.exports=  router;


  // /admin_panel/auth/change_mini_admin_password