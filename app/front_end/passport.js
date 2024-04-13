var moment = require('moment');


const db = require('mongodb');
const ObjectID = db.ObjectID;
const common = require('./common.js');
const localStrategy = require("passport-local").Strategy;
const loguser = require('./models/front_session').front_session;
const login = require('./models/userlogin.js').userlog;
const usrlog_session = require('./models/userlogin.js').userlogchk;
async function containsObject(obj, list) {
	let result = false;
	await common.asyncForEach(list, async function (row) {
		result = await checkJsons(row, obj)
	});
	return result;
}

function checkJsons(otherJson, newJson) {
	let sameJson = true;
	for (let key in newJson) {

		if (otherJson[key] !== newJson[key]) {
			console.log(otherJson[key] + " - " + newJson[key])
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
		login.findOne({
			_id: new ObjectID(user.userID)
		}, 'username', function (err, result) {
			done(null, result);
		});
	});
	passport.use(new localStrategy({
		passReqToCallback: true
	}, function (req, username, password, done) {
		login.findOne({
			username: username
		}, async function (err, result) {
			if (err) {
				done(err)
			} else {
				if (result) {
					let valid = result.comparepassword(password, result.password);
					if (valid) {

						let current_time = moment();
						let data = await common.getDataByColSingle(usrlog_session, {
							usr_id: result._id
						});
						if (typeof data != 'undefined' && data) {
							if (typeof data.exp_time != 'undefined' && data.exp_time) {
								let expire_time = moment(data.exp_time)
								let isafter = expire_time.diff(current_time, 'second');
								// if (isafter > 0) {
								// 	done(null, false, {
								// 		message: 'User Already Logged In. Wait for 30 sec after logout.'
								// 	});
								// } else {
									done(null, {
										username: result.username,
										userID: result._id
									}, {});
								// }
							} else {
								done(null, {
									username: result.username,
									userID: result._id
								}, {});
							}
						} else {
							done(null, {
								username: result.username,
								userID: result._id
							}, {});
						}
					} else {
						done(null, false, {
							message: 'Wrong Password'
						});
					}
				} else {
					done(null, false, {
						message: 'Wrong Username'
					});
				}
			}
		});
	}));
}