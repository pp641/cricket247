
const dbConfig =  require('./db')
const mongoose = require('mongoose');

async function mongooseConnection() {
  await mongoose.set('useNewUrlParser', true);
  await mongoose.set('useFindAndModify', false);
  await mongoose.set('useCreateIndex', true);
  await mongoose.set('useUnifiedTopology', true);
  await mongoose.connect(dbConfig.url, dbConfig.options)
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));
}

module.exports = mongooseConnection;