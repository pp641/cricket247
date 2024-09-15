var express = require('express');
var router = express.Router();
var { v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
var User = require('../models/userlogin.js').userlog;
var loguser = require('../models/userlogin.js').userlogchk
    
router.post("/login" , async (req, res)=>{
    const { username, password } = req.body;
    console.log("okcomingg", req.body)
    try {
      const user = await User.findOne({ username : username });
      if (!user) {
        return res.send(
          "<script>alert('Authentication failed. User not found');" +
          "window.location = '/login'</script>"
        );
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send(
          "<script>alert('Passwords does not match');" +
          "window.location = '/login'</script>"
        );
      }
  
      const payload = { id: user._id, username: user.username };
      const sessionId = uuidv4();
      const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '24h' });
      const old_session  = await loguser.findOne({usr_id: user._id});
      console.log("getting older" , old_session)
      await loguser.deleteMany({ usr_id: user._id });
      await new loguser({ session_id: sessionId, usr_id: user._id, token }).save();
      res.cookie('session_id_user', sessionId, { httpOnly: true, maxAge: 3600000 });
      res.redirect('/');
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  } );
    
module.exports =  router;
