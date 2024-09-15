const mongoose = require('mongoose');
const schema = mongoose.Schema;

const front_session = new schema({
    session_id : {
        type : String
    },
    user_id : {
        type: String
    },
    token : {
        type: String
    }
});

const schemaList = {}
schemaList.front_session = mongoose.model("my_app_sessions",front_session,"my_app_sessions");
module.exports = schemaList;