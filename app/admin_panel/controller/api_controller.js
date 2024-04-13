var moment = require('moment');

const db = require('mongodb');
const ObjectID = db.ObjectID;
const common = require('../common.js');
const userscheme = require('../models/userlogin.js');
const matchmodel = require('../models/match_schema.js');



const loguser = require('../models/admin_session').front_session;

const usermodel = userscheme.admin_user;
const admin_user_check = userscheme.admin_user_check;
const Main_News = userscheme.Main_News;
const manage_game = matchmodel.match_game;
const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const match_odds = matchmodel.match_odds;
const generated_match = matchmodel.generated_match;
const market_link = matchmodel.market_link;

const ballrunning = require('../models/ball_running_schema.js');
const ballrun = ballrunning.ball_running;
const news = ballrunning.news;
const match_score = ballrunning.match_score;
const scoreboard = ballrunning.scoreboard;
const curr_over = ballrunning.curr_over;
const inning = ballrunning.inning;

const controller = {};

controller.getMatch_data = async function(req,res,next){
    let match_id = req.body.match_id;
    let user_id = req.body.user_id;
    let user_data = await common.getDataByID(usermodel, user_id);
    let match_layoff = await common.getDataByValue(match_odds, {gen_id : match_id, market_type : 0, alloted_user : user_id});
    let match_match_odds = await common.getDataByValue(match_odds, {gen_id : match_id, market_type : 1, alloted_user : user_id});
    let arr = {}
    arr.user_data = user_data;
    arr.match_layoff = match_layoff;
    arr.match_match_odds = match_match_odds;
    res.send(arr);
}
controller.getMatch_data_all = async function(req,res,next){
    let match_id = req.body.match_id;
    let match_layoff = await common.getDataByValue(match_odds, {gen_id : match_id, market_type : 0});
    let match_match_odds = await common.getDataByValue(match_odds, {gen_id : match_id, market_type : 1});
    let arr = {}
    arr.match_layoff = match_layoff;
    arr.match_match_odds = match_match_odds;
    res.send(arr);
}

controller.update_users = async function(req, res, next){
    let market_id = req.body.market_id;
    let user_id = req.body.user_id.trim();
    await common.update(match_odds,market_id,{alloted_user : user_id});
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}

controller.incData = async function(req,res,next){
    let market_id = req.body.market_id;
    let type = req.body.type;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
        .add(2, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss');
    if(type == '0'){
        await common.updateincDesc(match_odds,market_id,{match_yes : 0.01, match_no : 0.01});
    }else{
        await common.updateincDesc(match_odds,market_id,{match_yes : 1, match_no : 1});
    }

    
    let dt_update = await common.update(match_odds,market_id,{last_update_time : current_time, updation_time : date});
    
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}

controller.descData = async function(req,res,next){
    let market_id = req.body.market_id;
	let type = req.body.type;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
        .add(2, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss');
		if(type == '0'){
			await common.updateincDesc(match_odds,market_id,{match_yes : -0.01, match_no : -0.01});
		}else{
			await common.updateincDesc(match_odds,market_id,{match_yes : -1, match_no : -1});
		}
    let dt_update = await common.update(match_odds,market_id,{last_update_time : current_time, updation_time : date});
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}
controller.update_rank = async function(req, res, next){
    let market_id = req.body.market_id;
    let rank = req.body.rank;
    await common.update(ballrun,market_id,{bal_no : rank});
    let mData = true;
    res.send(mData);
}
controller.updateStatus = async function(req,res,next){
    let market_id = req.body.market_id;
    let type = req.body.type;
    switch(type){
        case '0': await common.update(match_odds,market_id,{active_status : 0});
        break;
        case '1': await common.update(match_odds,market_id,{active_status : 1});
        break;
        case '2': await common.update(match_odds,market_id,{active_status : 2});
        break;
    }
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
    
}

controller.updateStatusAll = async function(req,res,next){
    let match_id = req.body.match_id;
    let type = req.body.type;
    switch(type){
        case '0': await common.updateMany(match_odds,{ gen_id : match_id},{active_status : 0})
        break;
        case '1': await common.updateMany(match_odds,{ gen_id : match_id},{active_status : 1})
        break;
        case '2': await common.updateMany(match_odds,{ gen_id : match_id},{active_status : 2})
        break;
    }
    
    // var mData = await common.getDataByCol(match_odds, { gen_id : match_id});
    var mData = true;
    res.send(mData);
    
}

controller.updateStatusAll_user = async function(req,res,next){
    let match_id = req.body.match_id;
    let type = req.body.type;
    let user_id = req.body.user_id;
    switch(type){
        case '0': await common.updateMany(match_odds,{ gen_id : match_id, alloted_user:user_id},{active_status : 0})
        break;
        case '1': await common.updateMany(match_odds,{ gen_id : match_id, alloted_user:user_id},{active_status : 1})
        break;
        case '2': await common.updateMany(match_odds,{ gen_id : match_id, alloted_user:user_id},{active_status : 2})
        break;
    }
    
    // var mData = await common.getDataByCol(match_odds, { gen_id : match_id});
    var mData = true;
    res.send(mData);
    
}


controller.showhide = async function(req,res,next){
    let market_id = req.body.market_id;
    let type = req.body.type;
    switch(type){
        case '0': await common.update(match_odds,market_id,{hide_and_show_status : 1});
        break;
        case '1': await common.update(match_odds,market_id,{hide_and_show_status : 0});
        break;
    }
    
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}

controller.getModelInfo = async function(req,res,next){
    let market_id = req.body.market_id;
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}

controller.updatedata = async function(req,res,next){
    let market_id = req.body.market_id;
    let match_title = req.body.match_title;
    let up_diff = req.body.up_diff;
    let match_yes = req.body.match_yes;
    let match_no = req.body.match_no;
    let number_yes = req.body.number_yes;
    let number_no = req.body.number_no;
    let ranking = req.body.ranking;
    let user_rank = req.body.user_rank;
    let update_value = {}
    update_value.match_name = match_title;
    update_value.diff = up_diff;
    update_value.match_yes = match_yes;
    update_value.match_no = match_no;
    update_value.match_yes_temp = match_yes;
    update_value.match_no_temp = match_no;
    update_value.number_yes = number_yes;
    update_value.number_no = number_no;
    update_value.ranking = ranking;
    update_value.user_rank = user_rank;
    
    let dt_update = await common.update(match_odds,market_id,update_value);
    let mData = await common.getDataByID(match_odds, market_id);
    res.send(mData);
}

controller.resetball_running = async function(req, res, next){
    let match_id = req.body.match_id;
    
    let mData = await common.getDataByColSingle(ballrun, {gen_id : match_id});
    await common.updateMany(ballrun, {gen_id : match_id},{active : 0});
    let ball = new ballrun();
    ball.bal_no = 0.1;
    ball.gen_id = match_id;
    ball.result = "#";
    ball.main_match_id = mData.main_match_id;
    ball.last_update_time = '';
    ball.if_update = 0;
    ball.hide_show = 1;
    ball.ball_status = 1;
    ball.active = 1;
    ball.save(function(err,data){
        if(err){
            console.log(err);
        } 
    });
    res.send('');
}

controller.updatehideshowAll = async function(req,res, next){
    let match_id = req.body.match_id;
    let type = req.body.type;
    switch(type){
        case '0': await common.updateMany(match_odds,{ gen_id : match_id},{hide_and_show_status : 0});
        break;
        case '1': await common.updateMany(match_odds,{ gen_id : match_id},{hide_and_show_status : 1});
        break;
    }
    // var mData = await common.getDataByCol(match_odds, { gen_id : match_id});
    var mData = true;
    res.send(mData);
}

controller.updatehideshowAll_user = async function(req,res, next){
    let match_id = req.body.match_id;
    let user_id = req.body.user_id;
    let type = req.body.type;
    switch(type){
        case '0': await common.updateMany(match_odds,{ gen_id : match_id, alloted_user:user_id},{hide_and_show_status : 0});
        break;
        case '1': await common.updateMany(match_odds,{ gen_id : match_id, alloted_user:user_id},{hide_and_show_status : 1});
        break;
    }
    // var mData = await common.getDataByCol(match_odds, { gen_id : match_id});
    var mData = true;
    res.send(mData);
}

controller.getallData = async function(req,res, next){
    let match_id = req.body.match_id;
    let user_id = req.body.user_id;
    let mData = await common.getDataByCol(match_odds, { gen_id : match_id, alloted_user : user_id});
    res.send(mData);
}

controller.getBallRunning = async function(req, res, next){
    let match_id = req.body.match_id;
    let type = req.body.type;
    let mData = "";
    if(type == "0"){
        mData = await common.getDataByColOrderlimit(ballrun, {gen_id : match_id,active : 1},{created_at : -1},4);
    }else{
        mData = await common.getDataByColOrderlimit(ballrun, {gen_id : match_id,active : 1},{created_at : -1},54);
    }
    res.send(mData);
}

controller.updateball_running = async function(req, res, next){
    let ball_id = req.body.ball_runn_id;
    let value = req.body.value;
    let type = req.body.type; 
    let sendVal = value;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
        .add(2, 'seconds')
        .format('YYYY-MM-DD HH:mm:ss');
    switch(type){
        case "1" : if(value == 'R'){
            sendVal = "Run"
           await common.update(ballrun, ball_id,{result : "Run", last_update_time : date,ball_type : 1})
        }else if(value == 'A'){
            sendVal = "Air"
            await common.update(ballrun, ball_id,{result : "Air", last_update_time : date,ball_type : 1})
        }else if(value == 'W'){
            sendVal = "Wicket"
            await common.update(ballrun, ball_id,{result : "Wicket", last_update_time : date,ball_type : 1})
        }else if(value == 'U'){
            sendVal = "Third Umpire"
            await common.update(ballrun, ball_id,{result : "Third Umpire", last_update_time : date,ball_type : 1})
        }else if(value == 'O'){
            sendVal = "Out"
            await common.update(ballrun, ball_id,{result : "Out", last_update_time : date,ball_type : 1})
        }else if(value == 'N'){
            sendVal = "Not Out"
            await common.update(ballrun, ball_id,{result : "Not Out", last_update_time : date,ball_type : 1})
        }else if(value == 'AP'){
            sendVal = "Appeal"
            await common.update(ballrun, ball_id,{result : "Appeal", last_update_time : date,ball_type : 1})
        }else{
            await common.update(ballrun, ball_id,{result : value, last_update_time : date,ball_type : 1})
        }
        break;
        case "2" : 
        sendVal = "Wide Ball"
        if(value == 0){
            
            await common.update(ballrun, ball_id,{result : "Wide Ball", last_update_time : date,ball_type : 2})
        }else{
            await common.update(ballrun, ball_id,{result : "Wide Ball ["+value+"]", last_update_time : date,ball_type : 2})
        }
        
        break;
        case "3" :
        sendVal = "No Ball"
        if(value == 'D'){
            sendVal = "Dead Ball"
            await common.update(ballrun, ball_id,{result : "Dead Ball", last_update_time : date,ball_type : 3})
        }else{
            if(value == 0){
                await common.update(ballrun, ball_id,{result : "No Ball", last_update_time : date,ball_type : 3})
            }else{
                await common.update(ballrun, ball_id,{result : "No Ball ["+value+"]", last_update_time : date,ball_type : 3})
            }
        }
        
        break;
        case "4" : 
        let val2 = "";
            if(value == 1){
                val2 = 'Third Umpire';
            }else if(value == 2){
                val2 = 'Not Out';
            }else if(value == 3){
                val2 = 'Out';
            }
            await common.update(ballrun, ball_id,{result : val2, last_update_time : date, if_update : 1})
        break;
        case "5" : 
            await common.update(ballrun, ball_id,{hide_show : value, last_update_time : date})
        break;
        case "6" : 
             await common.update(ballrun, ball_id,{result : value, last_update_time : date, if_update : 1})
        break;
        case "7" : 
             await common.update(ballrun, ball_id,{result : value, last_update_time : date, if_update : 1})
        break;
        case "10" : 
             await common.update(ballrun, ball_id,{ball_status : value})
        break;
        case "11" : 
             await common.update(ballrun, ball_id,{result : value, last_update_time : date, if_update : 0})
        break;
        
    }
    
    let val = await common.getDataByID(ballrun,ball_id);
    let curr_ball_no = val.bal_no.toString().split('.');
    let newball = val.bal_no;
    if(val.ball_type == 1){
    if(curr_ball_no[1] == 6){
        
        newball = (val.bal_no - 0.6)+1.1;
        
    }else{
        newball = (val.bal_no +0.1).toFixed(1);
    }
    }
    if(type == 10 ){    
                let ball = new ballrun();
                ball.bal_no = newball;
                ball.gen_id = val.gen_id;
                ball.result = "#";
                ball.main_match_id = val.main_match_id;
                ball.last_update_time = '';
                ball.if_update = 0;
                ball.hide_show = 1;
                ball.ball_status = 1;
                await ball.save(function(err,data){
                    if(err){
                        console.log(err);
                        }
                    });
    }
    let sendData = {}
    sendData.val = sendVal;
    sendData.type = type;
    sendData.hide_show = val.hide_show;
    res.send(sendData);
}

controller.delete_ball = async function(req, res, next){
    let ball_id = req.body.ball_runn_id;
    await common.remove(ballrun,ball_id);
    res.send(true);
}

controller.refresh_status = function(req, res, next){
    res.io.emit("refresh_status");
    res.send("message");
}
controller.refresh_all = function(req, res, next){
    res.io.emit("refresh_all");
    res.send("message");
}
controller.refresh_showhide = function(req, res, next){
    res.io.emit("refresh_showhide");
    res.send("message");
}

controller.getuserlist = async function(req, res, next){
    let userdetails = req.adminUser;
    let userList = await common.getDataByCol(usermodel,{admin_type : 0});
    res.send(userList);
}

controller.news_update = async function(req, res,next){
    let match_id = req.body.match_id;
    let news_message = req.body.news;
    await common.updatebyCol(news, {main_match_id : match_id},{news : news_message});
    let news_data = await common.getDataByColSingle(news,{main_match_id : match_id});
    res.send(news_data);
}

controller.score_update = async function(req, res,next){
    let match_id = req.body.match_id;
    let news_message = req.body.score;
    let news_datalist = await common.getDataByColSingle(match_score,{main_match_id : match_id});
    if(news_datalist.length == 0){
        let su = new match_score();
        su.score = news_message
        su.main_match_id = match_id
        await su.save();
    }else{
        await common.updatebyCol(match_score, {main_match_id : match_id},{score : news_message});
    }
    
    let news_data = await common.getDataByColSingle(match_score,{main_match_id : match_id});
    res.send(news_data);
}

controller.getNews = async function(req, res, next){
    let match_id = req.body.match_id;
    let news_data = await common.getDataByColSingle(news,{main_match_id : match_id});
    res.send(news_data);
}
controller.delete_market = async function(req, res, next){
    let market_id = req.body.market_id;
    await common.remove(match_odds,market_id);
    res.send('done');
}



controller.addMarketNew = async function(req, res, next){
    let match_id = req.body.main_match_id;
    let genData = await common.getDataByID(generated_match,match_id);
    let record = new match_odds();
            record.gen_id = match_id;
            record.main_match_id = genData.main_match_id;
            record.match_name = req.body.title;
            record.match_yes = req.body.yes;
            record.match_yes_temp = req.body.yes;
            record.match_no = req.body.no;
            record.match_no_temp = req.body.no;
            record.last_update_time = '';
            record.updation_time = '';
            record.active_status = 0;
            record.diff = req.body.diff;
            record.hide_and_show_status = 0;
            record.ranking = req.body.rank;
            record.number_yes = req.body.no_yes;
            record.number_no = req.body.no_no;
            record.market_type = req.body.market_type;
            record.alloted_user = '';
            record.save(function(err,result){
                if(err){
                    console.log(err);
                    res.send(false);
                }else{
                    res.send(true);
                }
            }) ;     
}

controller.getloginUser = async function(req, res, next){
 
    let data = await common.getData(admin_user_check);
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
            let data = await common.getDataByID(usermodel,row.usr_id);
            let snd = {username : data.username,admin_type : data.admin_type,id : data._id}
            result.push(snd);
         }
      });
   return result;
}
controller.getScore = async function(req, res, next){
    let match_id = req.body.match_id;
    let getScoreList = await common.getDataByValue(scoreboard, {match_id : match_id});
    res.send(getScoreList);
}
controller.updatescore = async function(req, res, next){
    let id = req.body.id;
    let total = req.body.total;
    let wicket = req.body.wicket;
    
    await common.update(scoreboard, id,{Total : total, Wickets : wicket})
    res.send("data");
}
controller.curr_over_dt = async function(req, res, next){
    let selected_inning = req.body.selected_inning;
    let curr_overData = await common.getDataByValueSort(curr_over,{inning_id : selected_inning},{overs : -1});
    res.send(JSON.stringify(curr_overData));
}

controller.updateOverRuns = async function(req, res, next){
    let curr_overs = req.body.curr_overs;
    let curr_runs = req.body.curr_runs;
    let over_id = req.body.over_id;
    let data = await common.update(curr_over,over_id,{overs : curr_overs , over_runs : curr_runs});
    res.send(data);
}
controller.removeOver = async function(req, res, next){
    let over_id = req.body.over_id;
    let data = await common.remove(curr_over,over_id);
    res.send(data);
}
controller.removeinning = async function(req, res, next){
    let selected_inning = req.body.selected_inning;
    let curr_overData = await common.getDataByValue(curr_over,{inning_id : selected_inning});
    curr_overData.forEach(function(row){
        common.remove(curr_over,row._id);
    });
    let data = await common.remove(inning,selected_inning);
    res.send(data);
}
controller.addOver = async function(req, res, next){
    let selected_inning = req.body.selected_inning;
    let getOverData = await curr_over.findOne({inning_id : selected_inning}).sort('-overs').exec();
    let over_no = 1;
    if(getOverData){
        if(getOverData.overs){
            over_no = getOverData.overs + 1
        }
    }
    let curr_over_save = new curr_over();
    curr_over_save.inning_id = selected_inning;
    curr_over_save.overs = over_no;
    curr_over_save.over_runs = 0;
    curr_over_save.save(function(err,data){
        if(err)
            res.send(err);
        else
            res.send('done');
    });
}

controller.getinning = async function(req, res, next){
    let match_id = req.body.match_id;
    let getInning = await common.getDataByValue(inning,{match_id : match_id});
    res.send(JSON.stringify(getInning));
}
controller.addinning = async function(req, res, next){
    let match_id = req.body.match_id;
    let getInning = await inning.findOne({match_id : match_id}).sort('-inn_no').exec();
    let inn_no = 1;
    if(getInning){
        if(getInning.inn_no){
            inn_no = getInning.inn_no + 1
        }
    }
    let inning_save = new inning();
    inning_save.match_id = match_id;
    inning_save.inn_no = inn_no;
    inning_save.save(function(err,data){
        if(err)
            res.send(err);
        else
            res.send('done');
    });
    
}
controller.update_wicket = async function(req, res, next){
    let id = req.body.id;
    let val = req.body.val;
    let type = req.body.type;
    let data = await common.getDataByID(scoreboard,id);
    if(type == 1){
        let Total = Number(data.Total);
        let new_val = Total + (Number(val)); 
        await common.update(scoreboard, id,{Total : new_val})
    }else{
        let wicket = Number(data.Wickets);
        let new_val = wicket + (Number(val)); 
        await common.update(scoreboard, id,{Wickets : new_val})
    }
    
    res.send("done");
}

//Market Link
controller.add_market_link = function(req, res, next){
    let match_id = req.body.match_id;
    let user_id = req.body.user_id;
    let market_list = req.body.market_list;
    let market_link_save = new market_link();
    market_link_save.match_id = match_id;
    market_link_save.user_id = user_id;
    market_link_save.market_list = market_list;
    market_link_save.save(function(err,data){
        if(err)
            res.send(err);
        else
            res.send(data);
    })
}
controller.getlinkedMarkets = async function(req, res, next){
    let match_id = req.body.match_id;
    let user_id = req.body.user_id;
    let data = await common.getDataByCol(market_link,{user_id : user_id, match_id : match_id});
    let list = await Marlist(data);
    res.send(list);
}
async function getMarketList(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = await common.getDataByID(match_odds, row.mar_id);
        if(data){
            result.push(data);
        }
      });
   return result;
}
async function Marlist(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {};
        let obj = JSON.parse(row.market_list);
        let list = await getMarketList(obj);
        data.link = row;
        data.list = list;
        result.push(data);
      });
   return result;
}
const incMarket = async function(array){
    const result = [];
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
            .add(2, 'seconds')
            .format('YYYY-MM-DD HH:mm:ss');
    await 
      common.asyncForEach(array, async (row) => {
        let market_id = row._id;
        let type = row.market_type;
        
        if(Number(type) == 0){
            await common.updateincDesc(match_odds,market_id,{match_yes : 0.01, match_no : 0.01});
        }else{
            await common.updateincDesc(match_odds,market_id,{match_yes : 1, match_no : 1});
        }
    
        
        let dt_update = await common.update(match_odds,market_id,{last_update_time : current_time, updation_time : date});
        result.push(dt_update);
      });
   return result;
}
const decMarket = async function(array){
    const result = [];
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let date = moment(current_time, "YYYY-MM-DD HH:mm:ss")
            .add(2, 'seconds')
            .format('YYYY-MM-DD HH:mm:ss');
    await 
      common.asyncForEach(array, async (row) => {
        let market_id = row._id;
        let type = row.market_type;
        
        if(Number(type) == '0'){
			await common.updateincDesc(match_odds,market_id,{match_yes : -0.01, match_no : -0.01});
		}else{
			await common.updateincDesc(match_odds,market_id,{match_yes : -1, match_no : -1});
		}
        let dt_update = await common.update(match_odds,market_id,{last_update_time : current_time, updation_time : date});
        result.push(dt_update);
      });
   return result;
}
const statusMarket = async function(array,type){
    const result = [];
    await 
      common.asyncForEach(array, async (row) => {
        let market_id = row._id;
        switch(type){
            case 0: await common.update(match_odds,market_id,{active_status : 0});
            break;
            case 1: await common.update(match_odds,market_id,{active_status : 1});
            break;
            case 2: await common.update(match_odds,market_id,{active_status : 2});
            break;
        }
        result.push({});
      });
   return result;
}
controller.incdecDataMarketLink = async function (req, res, next){
    let link_id = req.body.link_id;
    let action_type = Number(req.body.action_type);
    let data = await common.getDataByID(market_link,link_id);
    let obj = JSON.parse(data.market_list);
    let list = await getMarketList(obj);
    let send = {};
    if(action_type == 0){
        send.reload = 0;
        await incMarket(list);
    }else if(action_type == 1){
        send.reload = 0;
        await decMarket(list);
    }else if(action_type == 2){
        //Complete Reload
        send.reload = 1;
        await common.remove(market_link,link_id);
    }else if(action_type == 3){
        send.reload = 0;
        await statusMarket(list,1);
    }else if(action_type == 4){
        send.reload = 0;
        await statusMarket(list,2);
    }else if(action_type == 5){
        send.reload = 0;
        await statusMarket(list,0);
    }
    let list_send = [];
    if(send.reload == 0){
    let data_send = await common.getDataByID(market_link,link_id);
    let obj_send = JSON.parse(data_send.market_list);
    list_send = await getMarketList(obj_send);
    }
    
    send.data = list_send;

    res.send(send);
}
controller.updateMainNews = async function(req, res, next){
    let news = req.body.news;
    let data = await common.getDataByColSingle(Main_News,{});
    if(data){
        let up = await common.update(Main_News, data._id,{news_text : news});
        res.send(up);
    }else{
       let add = new Main_News();
       add.news_text = news;
       add.save(function(err,data){
        if(err)
        res.send(err);
        else
        res.send(data);
       });
    }
}
module.exports = controller;