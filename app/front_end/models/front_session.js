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
schemaList.front_session = mongoose.model("front_session",front_session,"front_session");
module.exports = schemaList;