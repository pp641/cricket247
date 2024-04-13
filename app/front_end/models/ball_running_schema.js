const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ball_running = new schema({
    bal_no : {
        type : Number,
        trim : true,
        required : true
    },
    result : {
        type : String,
        trim : true, 
    },
    gen_id : {
        type : String,
        trim : true, 
        required : true,
        index: true
    },
    main_match_id : {
        type : String,
        trim : true, 
        required : true,
        index: true
    },
    last_update_time : {
        type : Date
    },
    if_update : {
        type : Number
    },
    hide_show : {
        type : Number
    },
    ball_status : {
        type : Number,
        default: 0 
    },
    ball_type : {
        type : Number,
        default: 0 
    },
    created_at    : { 
        type: Date, 
        required: true, 
        default: Date.now,
        index: true 
    },
    active : {
        type : Number,
        default: 1
    }
});
const match_news = new schema({
    main_match_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    news : {
        type : String, 
        trim : true
    }
});

const match_score = new schema({
    main_match_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    score : {
        type : String, 
        trim : true
    }
});

const scoreboard = new schema({
    match_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    mainGameId : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    team : {
        type : String,
        required : true,
        trim : true
    },
    Total : {
        type : String,
        required : true,
        trim : true
    },
    Wickets : {
        type : String,
        required : true,
        trim : true
    },
    overs : {
        type : String,
        required : true,
        trim : true
    },

});
const inning = new schema({
    match_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    inn_no : {
        type : Number,
        required : true,
        trim : true
    }
});
const current_over_runs = new schema({
    inning_id : {
        type : String,
        required : true,
        trim : true,
        index: true
    },
    overs : {
        type : Number,
        required : true,
        trim : true,
        default : 0
    },
    over_runs : {
        type : Number,
        required : true,
        default : 0
    }
});
const schemaList = {}
schemaList.ball_running = mongoose.model("ball_running",ball_running,"ball_running");
schemaList.news = mongoose.model("match_news",match_news,"match_news");
schemaList.match_score = mongoose.model("match_score",match_score,"match_score");
schemaList.scoreboard = mongoose.model("scoreboard",scoreboard,"scoreboard");
schemaList.inning = mongoose.model("inning",inning,"inning");
schemaList.curr_over = mongoose.model("curr_over",current_over_runs,"curr_over");
module.exports = schemaList;