const createError = require('http-errors');
const http = require('http')
var debug = require('debug')('temp:server');

const express = require('express');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dbConfig = require('../db');
const cookieParser = require('cookie-parser');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');
const cluster = require('node:cluster')
const mongoose = require('mongoose')
async function mongooseConnection(){
  await mongoose.set('useNewUrlParser', true);
  await mongoose.set('useFindAndModify', false);
  await mongoose.set('useCreateIndex', true);
  await mongoose.set('useUnifiedTopology', true);
  await mongoose.connect(dbConfig.url,dbConfig.options)
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));
  }
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  allowedHeaders: 'Content-Type,Authorization', 
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');
var compression = require('compression')
app.use(compression())
var socket_io    = require( "socket.io" );
var io           = socket_io();
app.io = io;
io.on( "connection", function(socket)
{

  console.log( "A user connected" );
  socket.on("error", function(error){
      console.log("got errror", error)
    })
    socket.on("disconnect", function(){
      console.log("got errror disconnect")
      })
    socket.on("refresh_status", function(){
      console.log("refresh status called")
    });
    socket.on("refresh_showhide", function(){
      console.log("refresh showhide called")
    });
});


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

app.use(function(req, res, next) {
   next(createError(404));

});
  mongooseConnection();
  var port = 3025
  var server = http.createServer(app);
  server.listen(port)
  app.io.attach(server);
  console.log(`Worker ${process.pid} started on port ${port}`);
