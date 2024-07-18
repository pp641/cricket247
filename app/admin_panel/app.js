const createError = require('http-errors');
const http = require('http')
var debug = require('debug')('temp:server');
const express = require('express');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cluster = require('node:cluster');
const dbConfig = require('../db');
const cookieParser = require('cookie-parser');
const numCPUs = require('node:os').cpus.length
const process = require('node:process');
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


 // mongoose library

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
io.on( "connection", function()
{
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

app.use(function(req, res, next) {
   next(createError(404));

});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}else{

  mongooseConnection();
  var port = normalizePort('3025');
  app.set('port', port);
  var server = http.createServer(app);
  server.listen(port);
  app.io.attach(server);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log(`Worker ${process.pid} started`);
}


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}