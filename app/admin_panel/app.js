const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dbConfig = require('../db.js');
const genunid = require('./genunid.js');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
// var RedisStore = require('connect-redis')(expressSession);
const redis   = require("redis");
const client  = redis.createClient();
var flash = require('connect-flash');
const passport = require('passport'),
adminpassport = new passport.Passport();
require("./passport.js")(adminpassport);



 // mongoose library

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbConfig.url,dbConfig.options)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));


  // mongoose library end here



var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth')(adminpassport);


var app = express();
var compression = require('compression')

app.use(compression())



var socket_io    = require( "socket.io" );
var io           = socket_io();
var redis_socket = require('socket.io-redis');
io.adapter(redis_socket({ host: dbConfig.redis_host, port: dbConfig.redis_port }));

app.io = io;
io.on( "connection", function()
{
    // console.log( "A user connected" );
});

io.on("refresh_status", function(){});
io.on("refresh_showhide", function(){});

app.use(function(req, res, next){
  res.io = io;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by')

app.use(expressSession({
  secret: "6D11526858523A2E6C62876E272C9" ,
  store:new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'my_app_sessions' 
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000,secure: false },
  rolling: true
})
);



// app.use(expressSession({
//   secret: "6D11526858523A2E6C62876E272C9" ,
//   store:  new MongoDBSessionStore({
//     uri : dbConfig.url,
//     collection : 'my_app_sesssion'
//   }),
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 600000 },
// }))

app.use(flash());
app.use(adminpassport.initialize({ userProperty: "adminUser" }));
app.use(adminpassport.session());
// if (app.get('env') == 'production') {
//   app.use(morgan('combined'));
// } else {
//   app.use(morgan('combined'));
// }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin_panel', indexRouter);
app.use('/admin_panel/api', apiRouter);
app.use('/admin_panel/auth', authRouter);
app.get('*',function (req,res) {
  let html = `
    <style>
      *{
          transition: all 0.6s;
      }

      html {
          height: 100%;
      }

      body{
          font-family: 'Lato', sans-serif;
          color: #888;
          margin: 0;
      }

      #main{
          display: table;
          width: 100%;
          height: 100vh;
          text-align: center;
      }

      .fof{
          display: table-cell;
          vertical-align: middle;
      }

      .fof h1{
          font-size: 50px;
          display: inline-block;
          padding-right: 12px;
          animation: type .5s alternate infinite;
      }

      @keyframes type{
          from{box-shadow: inset -3px 0px 0px #888;}
          to{box-shadow: inset -3px 0px 0px transparent;}
      }
    </style>
    <div id="main">
      <div class="fof">
            <h1>Page Not Found</h1>
      </div>
    </div>
  `;
  res.status(404).send(html);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));

});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
