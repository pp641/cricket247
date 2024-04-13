const mongoose = require('mongoose');
const schema = mongoose.Schema;

const front_session = new schema({
    session : {
        type : String
    },
    expires : {
        type : Date
    }
});

const schemaList = {}
schemaList.front_session = mongoose.model("my_app_sessions",front_session,"my_app_sessions");
module.exports = schemaList;