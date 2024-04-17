var moment = require('moment');
const common = require('../common.js');
const matchmodel = require('../models/match_schema.js');
const userlogn = require('../models/userlogin.js');

const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const generated_match = matchmodel.generated_match;

const admin_user_check = userlogn.admin_user_check;
const Main_News = userlogn.Main_News;
const controller = {};

controller.dashboard = async function(req,res,next){
    const userID = req.adminUser;
    let generatedList = await common.getData(generated_match);
    let genMatch_name = await genMatchArray(generatedList);
    let data = await common.getDataByColSingle(Main_News,{});
    let news = "";
    if(data){
      news = data.news_text;
    }
    res.render("dashboard",{userData : userID, generatedList : genMatch_name, moment : moment,news_text : news});
}
async function genMatchArray(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {}
        data.row = row;
        liveGameData = await common.getDataByID(live_game, row.main_match_id);
        EventData = await common.getDataByID(manage_event, liveGameData.event_id);
        eventdateData = await common.getDataByID(manage_date, liveGameData.event_date_id);
        data.Event = EventData;
        data.EventDate = eventdateData;
        result.push(data);
      });
   return result;
}
controller.online_users = function(req, res,next){
  const userID = req.adminUser;
  res.render("online_users",{userData : userID})
}

controller.admin_online_users = function(req, res, next){
  
  const userID = req.adminUser;
  res.render("admin_online_users",{userData : userID})
}
controller.update_user_log = async function(req, res, next){ // moment 30 sec add 
  const userID = req.body.user_id;
  let data = await common.getDataByValue(admin_user_check,{usr_id : userID});
  if(data.length === 0){
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
        .add(5, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss');
        let record =  new admin_user_check()
        record.usr_id = userID;
        record.exp_time = date;
        await record.save();
  }else{
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
        .add(30, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss');
    await common.updatebyCol(admin_user_check,{usr_id : userID},{exp_time : date})
  }
  
  res.send("send")
}
module.exports = controller;