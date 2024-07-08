var moment = require('moment');
const db = require('mongodb');
const ObjectID = db.ObjectID;

//Common File
const common = require('../common.js');

//Model Files
const userscheme = require('../models/userlogin.js');
const matchmodel = require('../models/match_schema.js');
const ballrunning = require('../models/ball_running_schema.js');

const usermodel = userscheme.admin_user;
const reg_usermodel = userscheme.reg_user;

const ballrun = ballrunning.ball_running;
const news = ballrunning.news;
const scorebard = ballrunning.scoreboard;
const curr_over = ballrunning.curr_over;

const manage_game = matchmodel.match_game;
const manage_event = matchmodel.match_event;
const manage_date = matchmodel.match_date;
const live_game = matchmodel.live_game;
const match_odds = matchmodel.match_odds;
const generated_match = matchmodel.generated_match;
const controller = {};

//Allot User Page
controller.alot_user = async function(req,res,next){
    let userdetails = req.adminUser;
    let match_id = req.params.match_id;
    let userList = await common.getDataByCol(usermodel,{_id : {$ne : new ObjectID(userdetails._id)}, admin_type : 0});
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
    res.render('alot_users',{userData : userdetails, userList : userList,
        match_id : match_id, gameDetails : data,moment : moment});
}

//Change Admin Password Page
controller.change_password = function(req,res,next){
    console.log("changing here", req.adminUser , req.params)
    let userdetails = req.adminUser;
    let admin_user = req.params.admin_user_id;
    res.render('change_admin_password',{userData : userdetails, admin_user_id: admin_user});
}

//Change User Password Page
controller.change_password_user = function(req,res,next){
    let userdetails = req.adminUser;
    let front_user = req.params.front_user;
    res.render('change_password_user',{userData : userdetails, front_user: front_user});
}

//Create Game
controller.match_game = async function(req,res,next){    
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    res.render('manage_game',{userData : userdetails,GamesList : matchgames });
}

//Create Game Event
controller.match_game_event = async function(req,res,next){
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let matchevent = await common.getData(manage_event);
    let event_info_list = await MatcheventArray(matchevent);
    
    // var row2 = []
    res.render('manage_event',{userData : userdetails, GamesList : matchgames, 
        EventList : matchevent, GameModel : event_info_list});

}



//Generate Match
controller.match_odds_selection = async function(req,res,next){
    
    let userdetails = req.adminUser;
    
    let generatedList = await common.getData(generated_match);
    let genMatch_name = await genMatchArray(generatedList);
    res.render('match_odds_selection',{userData : userdetails, 
        genMatch_List : genMatch_name, moment : moment});
}

//Match Normal User Dashboard
controller.manage_match_odds_user = async function(req,res,next){
    
    let userdetails = req.adminUser;
    let match_id = req.params.match_id;
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
    let userList = await common.getDataByCol(usermodel,{_id : {$ne : new ObjectID(userdetails._id)}, admin_type : 0});
    res.render('match_odds_contorls',{userData : userdetails, userList : userList,
        match_id : match_id, gameDetails : data, moment : moment});
}

async function genMatchArray(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {}
        data.row = row;
        liveGameData = await common.getDataByID(live_game, row.main_match_id);
        GameData = await common.getDataByID(manage_game, liveGameData.game_id);
        EventDateData = await common.getDataByID(manage_date, liveGameData.event_date_id);
        EventData = await common.getDataByID(manage_event, liveGameData.event_id);
        data.liveGame = liveGameData;
        data.Game = GameData;
        data.EventDateData = EventDateData;
        data.Event = EventData;
        result.push(data);
      });
   return result;
}

async function MatcheventArray(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {}
        data.row = row;
        data.data = await common.getDataByID(manage_game, row.game_id);
        result.push(data);
      });
   return result;
}

async function MatchDateArray(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {}
        data.row = row;
        data.game = await common.getDataByID(manage_game, row.game_id);
        data.Event = await common.getDataByID(manage_event, row.event_id);
        result.push(data);
      });
   return result;
}

async function MatchLiveGameArray(array){
    const result = []
    await 
      common.asyncForEach(array, async (row) => {
        let data = {}
        data.row = row;
        data.game = await common.getDataByID(manage_game, row.game_id);
        data.Event = await common.getDataByID(manage_event, row.event_id);
        data.date = await common.getDataByID(manage_date, row.event_date_id);
        result.push(data);
      });
   return result;
}

//Set Match Date
controller.manage_game_date = async function(req,res,next){
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let matchdate = await common.getData(manage_date);
    let game_event_data = await MatchDateArray(matchdate);
    res.render('manage_date',{userData : userdetails, GamesList : matchgames, 
        EventModel : game_event_data, moment : moment});
}

//Create Live Game
controller.manage_live_game = async function(req, res, next){
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let matchlivegame = await common.getData(live_game);
    let live_game_list = await MatchLiveGameArray(matchlivegame);

    res.render('manage_live_game',{userData : userdetails, GamesList : matchgames, LiveGameModel : live_game_list,moment : moment});
}

//Create Match Odds
controller.create_matchodds = async function(req, res, next){
    
    let userdetails = req.adminUser;
    let matchlivegame = await common.getData(live_game);
    let live_game_list = await MatchLiveGameArray(matchlivegame);

    let generatedList = await common.getData(generated_match);
    let genMatch_name = await genMatchArray(generatedList);
    res.render('create_matchodds',{userData : userdetails, LiveGameModel : live_game_list, genList : genMatch_name,moment : moment});
}

//Manage Admin User
controller.manage_admin = async function(req,res,next){
    
    let userdetails = req.adminUser;
    let userList = await common.getData(usermodel);
    res.render('manage_admin',{userData : userdetails, userList : userList})
}
//Ajax
controller.get_match_events = async function(req,res,next){
    let game_id = req.body.game_id;
    let value = {game_id : game_id}
    let matchgames = await common.getData(manage_event, value);
    res.send(JSON.stringify(matchgames));
}

controller.get_match_date = async function(req,res,next){
    let event_id = req.body.event_id;
    let value = {event_id : event_id}
    console.log(value);
    let matchevent_date = await common.getDataByCol(manage_date, value);
    res.send(JSON.stringify(matchevent_date));
}

controller.manage_match_odds = async function(req,res,next){
    let userdetails = req.adminUser;
    let match_id = req.params.match_id;
    let gen_match = await common.getDataByID(generated_match,match_id);
    let live_event = await common.getDataByID(live_game,gen_match.main_match_id);
    let [eventDateData, eventData, gameData] = await Promise.all([
        common.getDataByID(manage_date, live_event.event_date_id),
        common.getDataByID(manage_event, live_event.event_id),
        common.getDataByID(manage_game, live_event.game_id)
    ]);
    let data = {};
    data.live_event = live_event
    data.eventDateData = eventDateData
    data.eventData = eventData
    data.gameData = gameData
    res.render('match_odds',{userData : userdetails, 
        match_id : match_id, gameDetails : data,moment : moment});
}

controller.save_create_matchodds = async function(req,res,next){
    let type_of_game = req.body.type_of_game;
    let sel_live_game = req.body.sel_live_game;
    let live_match = await common.getDataByID(live_game,sel_live_game);
    
    let eventData = await common.getDataByID(manage_event,live_match.event_id);
    let event_team_a = eventData.event_team_a;
    let event_team_b = eventData.event_team_b;
    let pro = generate_match(type_of_game, sel_live_game, event_team_a, event_team_b);
    Promise.all(pro).then(function(){
        res.send("<script>alert('Match Created'); window.location = '/admin_panel/match_odds_selection'</script>");
    });
    
}

function generate_match(type, mainGameId, team_a, team_b){
    var m_data = [];
    switch (type){
        case "1":
       //T-20
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_a, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 1})
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_b, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 2})

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Fall Of Next Wicket', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 1});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1,  'user_rank' : 2});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 3});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 4});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 5});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 6});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 7});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 8});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 9});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 10});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 11});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 6 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 12});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 10 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 13});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 15 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 14});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 15});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 16});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 17});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 18});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 19});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 20});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 21});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 22});
        //T-20
        break;
        case "2":
        //One Day
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_a, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 1})
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_b, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 2})

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Fall Of Next Wicket', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 1});
        
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 2});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 3});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 4});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 5});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 6});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 7});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 8});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 9});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 10});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 11});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 5 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 12});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 10 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 13});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 15 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 14});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'First Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 15});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'First Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 16});
        
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 17});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 18});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 19});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 20});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 21});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 22});
        //One Day
        break;
        case "3" :
        //Test Match
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_a, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 1})
        m_data.push({'match_odds' : null, 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : team_b, 'one' : 1, 'rank' : 1000, 'hun' : 100, 'market_type' : 0, 'user_rank' : 2})

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Fall Of Next Wicket', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 1});
        
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 2});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 3});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 4});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 5});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 6});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 7});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 8});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 9});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 10});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Next over Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 11});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 5 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 12});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 10 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 13});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Runs in 15 Overs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 14});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'First Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 15});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'First Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 16});
        
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_a, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 17});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Second Inning Runs '+team_b, 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 18});

        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 19});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 20});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 21});
        m_data.push({'match_odds' : 'value', 'liveMatchId' : mainGameId,  'zero' : 0, 'blank' : '', 'odd_name' : 'Batsman Runs', 'one' : 1, 'rank' : 1000, 'hun' : "2.00", 'market_type' : 1, 'user_rank' : 22});
        //Test Match
        break;
        default : console.log("Error Case");
    }
    var promise = [];
    var gen = new generated_match();
    gen.main_match_id = mainGameId;
    gen.save(function(err,data){
       m_data.forEach(row => {
           let record = new match_odds();
           record.gen_id = data._id;
           record.main_match_id = row.liveMatchId;
           record.match_name = row.odd_name;
           record.match_yes = row.zero;
           record.match_yes_temp = row.zero;
           record.match_no = row.zero;
           record.match_no_temp = row.zero;
           record.last_update_time = row.blank;
           record.updation_time = row.blank;
           record.active_status = row.zero;
           record.diff = row.one;
           record.hide_and_show_status = row.zero;
           record.ranking = row.rank;
           record.user_rank = row.user_rank;
           record.number_yes = row.hun;
           record.number_no = row.hun;
           record.market_type = row.market_type;
           record.alloted_user = '';
           promise.push(record.save())
           
       });
        
        let ball = new ballrun();
        ball.bal_no = 0.1;
        ball.gen_id = data._id;
        ball.result = "#";
        ball.main_match_id = mainGameId;
        ball.last_update_time = '';
        ball.if_update = 0;
        ball.hide_show = 1;
        ball.ball_status = 1;
        ball.save(function(err,data){
            if(err){
                console.log(err);
            }
            
        });

        let news_record = new news();
        news_record.main_match_id = data._id;
        news_record.news = "";
        news_record.save(function(err,data){
            if(err){
                console.log(err);
            }
        });

        let scorebard_record = new scorebard();
        scorebard_record.match_id = data._id;
        scorebard_record.mainGameId = mainGameId;
        scorebard_record.team = team_a;
        scorebard_record.Total = "0";
        scorebard_record.Wickets = "0";
        scorebard_record.overs = "0.0";
        scorebard_record.save(function(err,data){
            if(err){
                console.log(err);
            }
        });
        let scorebard_record2 = new scorebard();
        scorebard_record2.match_id = data._id;
        scorebard_record2.mainGameId = mainGameId;
        scorebard_record2.team = team_b;
        scorebard_record2.Total = "0";
        scorebard_record2.Wickets = "0";
        scorebard_record2.overs = "0.0";
        scorebard_record2.save(function(err,data){
            if(err){
                console.log(err);
            }
        });
     })
     
    return promise;
 }

controller.save_match_game = function(req,res,next){
    let match_game= req.body.match_game
    let record = new manage_game();
    record.game_name = match_game.trim();
    record.save(function(err,result){
        if(err){
            res.send(err+"<script> alert('Error Saveing Data'); window.location = '/admin_panel/manage_game'</script>")
        }else{
            res.send("<script> alert('Game Added Successfully'); window.location = '/admin_panel/manage_game' </script>")
        }
    });
}

controller.save_match_event = function (req, res, next){
    let game_id = req.body.game_name;
    let teamA = req.body.team_a;
    let teamB = req.body.team_b;
    let record = new manage_event();
    record.game_id = game_id.trim();
    record.event_team_a = teamA.trim();
    record.event_team_b = teamB.trim();
    record.save(function(err,result){
        if(err){
            res.send(err+"<script> alert('Error Saveing Data'); window.location = '/admin_panel/manage_game_event'</script>")
        }else{
            res.send("<script> alert('Game Event Added Successfully'); window.location = '/admin_panel/manage_game_date' </script>")
        } 
    });
}

controller.save_match_date = function(req, res, next){
    let game_id = req.body.game_name;
    let event_id = req.body.game_event;
    let event_date = req.body.event_date;
    let record = new manage_date();
    record.game_id = game_id.trim();
    record.event_id = event_id.trim();
    record.event_date = event_date.trim();
    record.save(function(err,result){
        if(err){
            res.send(err+"<script> alert('Error Saveing Data'); window.location = '/admin_panel/manage_game_date'</script>")
        }else{
            res.send("<script> alert('Game Date Added Successfully'); window.location = '/admin_panel/manage_live_game' </script>")
        } 
    });
}

controller.save_match_live_game = function(req, res, next){
   let game_name = req.body.game_name
   let match_event = req.body.match_event
   let event_name = req.body.event_name
   let live_game_name = req.body.live_game_name

   let record = new live_game();
   record.game_id = game_name;
   record.event_id = match_event;
   record.event_date_id = event_name;
   record.live_game_name = live_game_name;
   record.save(function(err,result){
        if(err){
            res.send(err+"<script> alert('Error Saveing Data'); window.location = '/admin_panel/manage_live_game'</script>")
        }else{
            res.send("<script> alert('Live Game Added Successfully'); window.location = '/admin_panel/create_matchodds' </script>")
        } 
    });
}

//delete
controller.delete_gen = async function(req, res, next){
    let gen_id = req.params.gen_id;
    // genData = common.getDataByID(generate_match, gen_id);
    let err1 = await common.remove(generated_match,gen_id);
    let err2 = await common.removeValue(match_odds,{gen_id : gen_id});
    let err3 = await common.removeValue(scorebard,{match_id : gen_id});
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/create_matchodds'</script>")
}

controller.delete_live_game = async function(req, res, next){
    let live_game_id = req.params.live_game_id;

    let err1 = await common.remove(live_game,live_game_id);
    let err2 = await common.removeValue(generated_match,{main_match_id : live_game_id});
    let err3 = await common.removeValue(match_odds,{main_match_id : live_game_id});
    let err4 = await common.removeValue(scorebard,{mainGameId : live_game_id});
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/manage_live_game'</script>")
}

controller.delete_date = async function(req, res, next){
    let date_id = req.params.date_id;
    let value = {event_date_id : date_id}
    let err1 = await common.remove(manage_date,date_id);
    let matchgames = await common.getDataByCol(live_game, value);
    await delete_live_game(matchgames);
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/manage_game_date'</script>")
}
async function delete_live_game(array){
    common.asyncForEach(array, async (row) => {
        await common.remove(live_game,row._id);
        await common.removeValue(news,{main_match_id : row._id});
        await common.removeValue(ballrun,{main_match_id : row._id});
        await common.removeValue(generated_match,{main_match_id : row._id});
        await common.removeValue(match_odds,{main_match_id : row._id});    
        await common.removeValue(scorebard,{mainGameId : row._id});
    })
}
controller.delete_game = async function(req, res, next){
    let game_id = req.params.game_id;
    let value = {game_id : game_id}
    let err1 = await common.remove(manage_game,game_id);
    let err2 = await common.removeValue(manage_event,{game_id : game_id});
    let err3 = await common.removeValue(manage_date,{game_id : game_id});
    let matchgames = await common.getDataByCol(live_game, value);
    await delete_live_game(matchgames);
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/manage_game'</script>")
}

controller.delete_event = async function(req, res, next){
    let event_id = req.params.event_id;
    let value = {event_id : event_id}
    let err1 = await common.remove(manage_event,event_id);
    let err3 = await common.removeValue(manage_date,{event_id : event_id});
    let matchgames = await common.getDataByCol(live_game, value);
    await delete_live_game(matchgames);
    res.send("<script>alert('Deleted Successfully');</script>")
}
controller.delete_reg_user = async function(req, res, next){
    let reg_user_id = req.params.reg_id;
    let err1 = await common.remove(reg_usermodel,reg_user_id);
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/manage_registered_member'</script>")
}

controller.manage_registered_member = async function(req, res, next){
    let userdetails = req.adminUser;
    let reg_userList = await common.getDataSelect(reg_usermodel,{first_name : 1, last_name : 1, username : 1});
    res.render("manage_registered_member",{userData : userdetails, reg_userList : reg_userList});
}

controller.save_match_reg_user = function(req,res,next){
    let first_name= req.body.first_name
    let last_name= req.body.last_name
    let username= req.body.username
    let password= req.body.password
    reg_usermodel.findOne({username:username},function(error,result){
        if(error){
            res.status(500).send(error)
        }else{
            if(result){
                res.status(500).send("<script>alert('Username Already Exits');"
                +" window.location = '/admin_panel/manage_registered_member'</script>");
                
            }else{
                let record = new reg_usermodel();
                record.first_name = first_name.trim();
                record.last_name = last_name.trim();
                record.username = username.trim();
                record.password = record.hashPassword(password);
                record.save(function(err,result){
                    if(err){
                        res.send(err+"<script> alert('Error Saving Data'); window.location = '/admin_panel/manage_registered_member'</script>")
                    }else{
                        res.send("<script> alert('User Created Successfully'); window.location = '/admin_panel/manage_registered_member' </script>")
                    }
                });
            }
        }
    });
    
}


//Edit 
controller.edit_game = async function(req,res,next){
    let game_id = req.params.game_id;
    let userdetails = req.adminUser;
    let gameData = await common.getDataByID(manage_game,game_id);
    res.render('edit_game',{userData : userdetails,gameData : gameData, game_id : game_id});
}

controller.edit_manage_game = async function(req, res, next){
    let game_id = req.params.game_id;
    let game_name = req.body.game_name;
    let update = await common.update(manage_game,game_id,{game_name : game_name});
    if(update){
        res.send("<script> alert('Game Updated Successfully'); window.location = '/admin_panel/manage_game' </script>")
    }else{
        res.send("<script> alert('Error Updating Data'); window.location = '/admin_panel/manage_game'</script>")
    }
    
}

controller.edit_event = async function(req, res, next){
    let event_id = req.params.event_id;
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let eventData = await common.getDataByID(manage_event, event_id);
    res.render('edit_event',{userData : userdetails, GamesList : matchgames, eventData : eventData,event_id : event_id});
}

controller.edit_manage_event = async function(req, res, next){
    let event_id = req.params.event_id;
    let game_id = req.body.game_name;
    let event_team_a = req.body.team_a;
    let event_team_b = req.body.team_b;
    let update = await common.update(manage_event,event_id,{game_id : game_id, event_team_a : event_team_a, event_team_b : event_team_b});
    
    if(update){
        res.send("<script> alert('Event Updated Successfully'); window.location = '/admin_panel/manage_game_event' </script>")
    }else{
        res.send("<script> alert('Error Updating Data'); window.location = '/admin_panel/manage_game_event'</script>")
    }
}

controller.edit_event_date = async function(req, res, next){
    let event_date = req.params.event_date_id;
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let eventDateData = await common.getDataByID(manage_date, event_date);
    res.render('edit_date',{userData : userdetails, GamesList : matchgames, eventDateData : eventDateData, event_date_id : event_date, moment : moment});
}

controller.edit_manage_date = async function(req, res, next){
    let event_date = req.params.event_date_id;
    let game_id = req.body.game_name;
    let game_event = req.body.game_event;
    let date = req.body.event_date;
    let update = await common.update(manage_date,event_date,{game_id : game_id, event_id : game_event, event_date : date});
    
    if(update){
        res.send("<script> alert('Event Date Updated Successfully'); window.location = '/admin_panel/manage_game_date' </script>")
    }else{
        res.send("<script> alert('Error Updating Data'); window.location = '/admin_panel/manage_game_date'</script>")
    }
}

controller.edit_live_game = async function(req, res, next){
    let live_game_id = req.params.live_game_id;
    
    let userdetails = req.adminUser;
    let matchgames = await common.getData(manage_game);
    let livegameData = await common.getDataByID(live_game, live_game_id);
    res.render('edit_live_game',{userData : userdetails, GamesList : matchgames, livegameData : livegameData, live_game_id : live_game_id, moment : moment});
}

controller.edit_manage_live_game = async function(req,res, next){
    let live_game_id = req.params.live_game_id;
    let game_name = req.body.game_name;
    let match_event = req.body.match_event; 
    let event_name = req.body.event_name;
    let live_game_name = req.body.live_game_name;
    let update = await common.update(live_game,live_game_id,{game_id : game_name, event_id : match_event, event_date_id : event_name, live_game_name : live_game_name});
    
    if(update){
        res.send("<script> alert('Live Game Updated Successfully'); window.location = '/admin_panel/manage_live_game' </script>")
    }else{
        res.send("<script> alert('Error Updating Data'); window.location = '/admin_panel/manage_live_game'</script>")
    }
}

controller.edit_admin = async function(req, res, next){
    let userdetails = req.adminUser;
    let admin_id = req.params.admin_id;
    let seluserData = await common.getDataByID(usermodel,admin_id);
    res.render('edit_admin',{userData : userdetails, edUserData : seluserData});
}

controller.edit_manage_admin = async function(req, res, next){
    let admin_id = req.params.admin_id;
    let admin_name = req.body.admin_name;
    let admin_user = req.body.admin_user;
    let admin_type = req.body.admin_type;
    let admin_status = req.body.admin_status;
    let update = await common.update(usermodel,admin_id,{admin_name : admin_name, username : admin_user, admin_type : admin_type, admin_status : admin_status});
    if(update){
        res.send("<script> alert('Admin User Updated Successfully'); window.location = '/admin_panel/manage_admin' </script>")
    }else{
        res.send("<script> alert('Error Updating Data'); window.location = '/admin_panel/manage_admin'</script>")
    }
}

controller.delete_admin = async function(req, res, next){
    let admin_id = req.params.admin_id;
    await common.remove(usermodel,admin_id);
    res.send("<script>alert('Deleted Successfully'); window.location = '/admin_panel/manage_admin'</script>")
}

controller.change_mini_admin_password  = async function(req,res,next){
    console.log("ok getting" , req.body , req.adminUser )
    let userdetails = req.adminUser;
    let admin_user_id = req.adminUser._id
    let admin_user = req.params.admin_user_id;
    console.log("okde", admin_user_id )
    res.render('change_mini_admin_password',{userData : userdetails, admin_user_id: admin_user_id});
}


module.exports = controller;
