const db = require('mongodb');
const bcrypt = require('bcrypt-nodejs');
const ObjectID = db.ObjectID;

var moment = require('moment');

//Common File
const common = require('../common.js');

const usermodel = require('../models/userlogin.js').userlog;
const matchmodel = require('../models/match_schema.js');

const manage_game = matchmodel.match_game;
const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const match_odds = matchmodel.match_odds;
const generated_match = matchmodel.generated_match;

const controller = {};


controller.update_user_password =  async function(req,res,next){
    try{
    console.log("req", req.body)
    let { oldPassword , newPassword , confirmNewPassword ,userId} = req.body 
    let userDetails = await common.getDataByID(usermodel ,userId);
    let check_password =  bcrypt.compareSync(oldPassword , userDetails.password)
    if(check_password){
        if( newPassword === confirmNewPassword){
            const hashedNewPassword =  bcrypt.hash(newPassword, 10);
            userDetails.password = hashedNewPassword;
            await userDetails.save();
            res.json({message : "Password Updated Successfully"})
        }else{
            res.json({message : "New Password and Confirm New Password are not matching !"})
        }

    }else{
        res.json({message : 'Old Password is not correct !'})
    }

    } catch(error){
    console.log("Error", error);
        res.json({message : "Internal Server Error"});
    }
}
controller.dashboard = async function(req,res,next){
    let userID = req.User._id;
    let userdetails = await common.getDataByID(usermodel,userID);
    let matchgames = await common.getData(manage_game);
    let nav = await getselectorData(matchgames);
    // res.send(data);
    
    res.render('index',{userdata : userdetails, navigator : nav, moment : moment});
}


controller.match_monitor = async function(req,res,next){
    let match_id = req.params.match_id;

    let userID = req.User._id;
    let userdetails = await common.getDataByID(usermodel,userID);
    let gen_match = await common.getDataByID(generated_match,match_id);
    let matchgames = await common.getData(manage_game);
    let nav = await getselectorData(matchgames);
    if(typeof gen_match !== 'undefined' && gen_match){
    let live_event = await common.getDataByID(live_game,gen_match.main_match_id);
    let eventDateData = await common.getDataByID(manage_date,live_event.event_date_id);
    let eventData = await common.getDataByID(manage_event,live_event.event_id);
    let gameData = await common.getDataByID(manage_game,live_event.game_id);
    let data = {};
    data.live_event = live_event
    data.eventDateData = eventDateData
    data.eventData = eventData
    data.gameData = gameData

    
    
        res.render('index',{userdata : userdetails, navigator : nav, match_id : match_id, moment : moment, match_title : data});
    }else{
        res.render('match_404',{userdata : userdetails, navigator : nav, moment : moment});
        
    }
}

controller.ball_running = async function(req, res ,next){
    let match_id = req.params.match_id;
    let userID = req.User._id;
    let userdetails = await common.getDataByID(usermodel,match_id);
    res.render('ball_running',{userdata : userdetails, match_id : match_id})
}

async function getselectorData(matchgames){
    var m_data = [];
    await common.asyncForEach(matchgames,async (row) => {
        var data = []
        var mevent  = await common.getDataByCol(manage_event, 'game_id',row._id);
        await common.asyncForEach(mevent,async (row2) => {
            var dt = []
            var mdate  = await common.getDataByCol(manage_date, 'event_id',row2._id);
            await common.asyncForEach(mdate,async (row3) => {
                var dt2 = []
                var mlive  = await common.getDataByCol(live_game, 'event_date_id',row3._id);
                await common.asyncForEach(mlive,async (row4) => {
                    var dt3 = []
                    var genMatch  = await common.getDataByCol(generated_match, 'main_match_id',row4._id);
                    await common.asyncForEach(genMatch,async (row5) => {
                        dt3.push({genMatch : row5});
                    });
                    dt2.push({mlive : row4, dt3 : dt3})
                });
                dt.push({mdate : row3, dt2 : dt2})
            });
            data.push({mevent : row2, dt : dt})
        });
        m_data.push({game : row,data});
    });
    return m_data;
}
module.exports = controller;