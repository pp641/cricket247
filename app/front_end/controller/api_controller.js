var moment = require('moment');

const common = require('../common.js');

const matchmodel = require('../models/match_schema.js');
const ball_running = require('../models/ball_running_schema');

const loguser = require('../models/front_session').front_session;
const usrlog = require('../models/userlogin').userlog;
const usrlog_session = require('../models/userlogin').userlogchk;
const Main_News = require('../models/userlogin').Main_News;
const manage_game = matchmodel.match_game;
const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const match_odds = matchmodel.match_odds;
const generated_match = matchmodel.generated_match;

const ball_runn = ball_running.ball_running;
const news = ball_running.news;
const scoreboard = ball_running.scoreboard;
const inning = ball_running.inning;
const curr_over = ball_running.curr_over;

const controller = {};

controller.getLayoff = async function(req,res,next){
    let match_id = req.body.match_id;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let match_layoff = await common.getDataByValueSort(match_odds, {gen_id : match_id, market_type : 0, hide_and_show_status : 0}, {user_rank : 1});
    let match_layoffdate = await common.getDataByMoreDate_match_id(match_odds, current_time, match_id, 0);
    await updateDate(match_layoffdate, current_time);
    res.send(match_layoff);
}

controller.getlayoffUpdateTime = async function(req,res,next){
    let match_id = req.body.match_id;
    let uptime = await match_odds.find({gen_id : match_id, market_type : 0}).sort({last_update_time:-1}).limit(1).exec();
    res.send(uptime)
}

controller.getBallRunning = async function(req,res,next){
    let match_id = req.body.match_id;
    let uptime = await ball_runn.find({gen_id : match_id,hide_show : 0}).sort({created_at:-1}).limit(4).exec();
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = await common.updateMany(ball_runn,{last_update_time : {$lte : current_time},if_update : 1, gen_id : match_id},{if_update : 0, last_update_time : current_time})
    res.send(uptime)
}

controller.getBallRunning2 = async function(req,res,next){
    let match_id = req.body.match_id;
    let uptime = await ball_runn.find({gen_id : match_id,hide_show : 0}).sort({created_at:-1}).exec();
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = await common.updateMany(ball_runn,{last_update_time : {$lte : current_time},if_update : 1, gen_id : match_id},{if_update : 0, last_update_time : current_time})
    res.send(uptime)
}

controller.getOversRuns = async function(req,res,next){
    let match_id = req.body.match_id;
    let inningData = await common.getDataByCol(inning,'match_id',match_id);  
    let list = await inningList(inningData);
    res.send(JSON.stringify(list));
}
async function inningList(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
          value = {};
          value.inning = row.inn_no;
          
          value.overs = await common.getDataByCol(curr_over,'inning_id',row._id);
          result.push(value);
      });
   return result;
}
controller.getMatchOdds = async function(req,res,next){
    let match_id = req.body.match_id;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    
    let match_layoff = await common.getDataByValueSort(match_odds, {gen_id : match_id, market_type : 1, hide_and_show_status : 0}, {user_rank : 1});    
    let match_layoffdate = await common.getDataByMoreDate_match_id(match_odds, current_time, match_id, 1);
    await updateDate(match_layoffdate, current_time);
    res.send(match_layoff);
}

controller.getMatchoddsUpdateTime = async function(req,res,next){
    let match_id = req.body.match_id;
    let uptime = await match_odds.find({gen_id : match_id, market_type : 1}).select('last_update_time').sort({last_update_time:-1}).limit(1).exec();
    res.send(uptime)
}

async function updateDate(array, time){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
          value = {};
          value.match_yes_temp = row.match_yes;
          value.match_no_temp = row.match_no;
          value.last_update_time = time;
          await common.update(match_odds, row._id, value);
      });
   return result;
}

controller.getNews = async function(req, res, next){
    let match_id = req.body.match_id;
    let news_data = await common.getDataByColSingle(news,{main_match_id : match_id});
    res.send(news_data);
}

controller.cricket_audio = async function(req, res, next){
    console.log("getting here audio")
    let text = req.params.text;
    let match_id = req.params.match_id;
    let val = {}
    val.text = text;
    val.match_id = match_id;
    res.io.emit(match_id,JSON.stringify(val));
    res.send("message");
}

controller.getloginUser = async function(req, res, next){

    let data = await common.getData(usrlog_session);
    let userlist = await getusrdatalist(data)
    res.send(userlist);
}

async function getusrdatalist(array){
    let current_time = moment();
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let expire_time = moment(row.exp_time); 
         let isafter = expire_time.diff(current_time,'second');
         if(isafter > 0){
            let data = await common.getDataByID(usrlog,row.usr_id);
            if( data != null){
                if( data.username != null && data._id != null){
                    let snd = {username : data.username,id : data._id}
                    result.push(snd);
                }
            }
         }
      });
   return result;
}
controller.update_user_log = async function(req, res, next){
    const userID = req.body.user_id;
    let data = await common.getDataByValue(usrlog_session,{usr_id : userID});
    let tp = 0;
    if(data.length === 0){
        tp = 1;
      let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
          .add(5, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss');
          let record =  new usrlog_session()
          record.usr_id = userID;
          record.exp_time = date;
          record.save();
    }else{
        tp = userID;
      let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
          .add(30, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss');
      common.updatecontition(usrlog_session,{exp_time : date},{usr_id : userID})
    }
    
    res.send(tp+"")
  }

controller.getScore = async function(req, res, next){
    let match_id = req.body.match_id;
    let getScoreList = await common.getDataByValue(scoreboard, {match_id : match_id});
    res.send(getScoreList);
}

controller.getNewsMain = async function(req, res, next){
    let getNews = await common.getDataByColSingle(Main_News, {});
    res.send(getNews);
}

module.exports = controller;