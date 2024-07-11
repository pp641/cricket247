var moment = require('moment');
const db = require('mongodb');
const ObjectID = db.ObjectID;

//Common File
const common = require('../common.js');
const matchmodel = require('../models/match_schema.js');
const ballrunning = require('../models/ball_running_schema.js');
const manage_game = matchmodel.match_game;
const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const generated_match = matchmodel.generated_match;
const controller = {};
controller.manage_ball_running = async function(req, res, next){
    let match_id = req.params.match_id;
    let userdetails = req.adminUser;
    
    let gen_match = await common.getDataByID(generated_match,match_id);
    let live_event = await common.getDataByID(live_game,gen_match.main_match_id);
    let eventDateData = await common.getDataByID(manage_date,live_event.event_date_id);
    let eventData = await common.getDataByID(manage_event,live_event.event_id);
    let gameData = await common.getDataByID(manage_game,live_event.game_id);
    let data = {};
    data.live_event = live_event
    data.eventDateData = eventDateData
    data.eventData = eventData
    data.gameData = gameData
    data.generated_match = gen_match
    res.render('manage_ball_running',{userData : userdetails ,match_id : match_id, gameDetails : data,moment : moment});
}

controller.get_game_details = async function(req,res,next){
    try{
        console.log("ooko",req.params)
        let match_id = req.params.match_id
        let gen_match = await common.getDataByID(generated_match,match_id);
        console.log("odkod", gen_match)
        return res.json({matchdetails : gen_match })
    } catch(error){
        console.log("Error", error);
    }
}


controller.update_mute_status = async function(req,res,next){
    try {
        console.log("getdata", req.body)
        let match_id_param = req.body.match_id;
        let match_mute_value = req.body.clicked
        let gen_match = await common.getDataByID(generated_match,match_id_param);
        gen_match.muted = match_mute_value
        gen_match.save(((err,data)=>{
            console.log("ok Aafter", data, err)
        }));
        return res.json({result : gen_match})
    }catch(error){
        console.log("Error", error);
    }
}

module.exports = controller;