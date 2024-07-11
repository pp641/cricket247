const mongoose = require('mongoose');
const schema = mongoose.Schema;


const match_game = new schema({
    game_name:{
        type : String,
        required:true, 
        trim: true
    },
});

const match_event = new schema({
    game_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    event_team_a:{
        type : String,
        required:true, 
        trim: true
    },
    event_team_b:{
        type : String,
        required:true, 
        trim: true
    }
});

const match_date = new schema({
    game_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    event_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    event_date:{
        type : Date,
        required:true, 
        trim: true
    }
});

const live_game = new schema({
    game_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    event_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    event_date_id:{
        type : String,
        required:true, 
        trim: true,
        index: true
    },
    live_game_name:{
        type : String,
        required:true, 
        trim: true
    }
})

const match_odds = new schema({
    gen_id :{
        type : String,
        required:true,
        trim:true,
        index: true
    },
    main_match_id :{
        type : String,
        required:true,
        trim:true,
        index: true
    },
    match_name : {
        type : String,
        required : true,
        trim:true
    },
    match_yes : {
        type : Number,
        required : true,
        trim:true
    },
    match_yes_temp : {
        type : Number,
        required : true,
        trim:true
    },
    match_no : {
        type : Number,
        required : true,
        trim:true
    },
    match_no_temp : {
        type : Number,
        required : true,
        trim:true
    },
    last_update_time : {
        type : Date,
        index: true
    },
    updation_time : {
        type : Date
    },
    active_status : {
        type : Number,
        required : true
    },
    diff : {
        type : Number,
    },
    hide_and_show_status : {
        type : Number,
        required : true   
    },
    ranking : {
        type : Number,
        required : true,
        index: true
    },
    user_rank : {
        type : Number,
        required : true,
        default: 0,
        index: true
    },
    number_yes : {
        type : Number,
        required : true,
        trim:true
    },
    number_no : {
        type : Number,
        required : true,
        trim:true
    },
    market_type : {
        type : Number,
        required : true,
        trim:true
    },
    alloted_user : {
        type : String,
        trim:true
    }
})

match_odds.index({gen_id : 1, market_type : 1, alloted_user : 1});
match_odds.index({gen_id : 1, market_type : 1});
match_odds.index({last_update_time : 1, updation_time : 1});
const generated_match = new schema({
    main_match_id : {
        type : String,
        required:true,
        trim:true,
        index: true
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    muted : {
        type : Boolean , 
        default : false
    }
});

const market_link = new schema({
    match_id : {
        type : String,
        required:true,
        trim:true,
        index: true
    },
    user_id : {
        type : String,
        required:true,
        trim:true,
        index: true
    },
    market_list    : { 
        type: String, 
        required: true, 
        trim:true
    }
});

market_link.index({user_id : 1, match_id : 1});
const schemaList = {}
schemaList.match_game = mongoose.model("match_game",match_game,"match_game");
schemaList.match_event = mongoose.model("match_event",match_event,"match_event");
schemaList.match_date = mongoose.model("match_date",match_date,"match_date");
schemaList.live_game = mongoose.model("live_game",live_game,"live_game");
schemaList.match_odds = mongoose.model("match_odds", match_odds, "match_odds");
schemaList.generated_match = mongoose.model("generated_match", generated_match, "generated_match");
schemaList.market_link = mongoose.model("market_link", market_link, "market_link");

module.exports = schemaList;