var moment = require("moment");

const db = require("mongodb");
const ObjectID = db.ObjectID;

const localStrategy = require("passport-local").Strategy;
const common = require("./common.js");
const login = require("./models/userlogin.js").admin_user;
const loguser = require("./models/admin_session").front_session;
const admin_user_check = require("./models/userlogin.js").admin_user_check;
async function containsObject(obj, list) {
  let result = false;
  await common.asyncForEach(list, async function (row) {
    result = await checkJsons(row, obj);
  });
  return result;
}
function checkJsons(otherJson, newJson) {
  let sameJson = true;
  for (let key in newJson) {
    if (otherJson[key] !== newJson[key]) {
      console.log(otherJson[key] + " - " + newJson[key]);
      sameJson = false;
    }
  }
  return sameJson;
}

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    login.findOne({ _id: new ObjectID(user.userID) }, function (err, result) {
      if (err) {
        throw err;
      }
      let val = {};

      val._id = result._id;
      val.username = result.username;
      val.admin_type = result.admin_type;
      done(null, val);
    });
  });
  passport.use(
    new localStrategy({ passReqToCallback: true }, function (
      req,
      username,
      password,
      done
    ) {
      login.findOne({ username: username }, async function (err, result) {
        if (err) {
          done(err);
        } else {
          if (result) {
            let valid = result.comparepassword(password, result.password);
            if (valid) {
              done(null, {
                userID: result._id,
                username: result.username,
                admin_type: result.admin_type,
              });
            } else {
              done(null, false, { message: "Wrong Password" });
            }
          } else {
            done(null, false, { message: "Wrong Username" });
          }
        }
      });
    })
  );
};
