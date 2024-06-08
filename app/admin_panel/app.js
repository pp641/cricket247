const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dbConfig = require('../db.js');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var app = express();


 // mongoose library


app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbConfig.url,dbConfig.options)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));





var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');


var compression = require('compression')


app.use(compression())



var socket_io    = require( "socket.io" );
var io           = socket_io();
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


module.exports = app;
