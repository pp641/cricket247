var createError = require('http-errors');
var cors = require('cors')
var express = require('express');
var path = require('path');
const process = require('node:process');
var cookieParser = require('cookie-parser');
const redisAdapter = require("socket.io-redis");
var dbConfig = require('./db.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbConfig.url,dbConfig.options)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth')

var app = express();
var compression = require('compression')
app.use(compression())
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  allowedHeaders: 'Content-Type,Authorization', 
};
app.use(cors(corsOptions));


// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://www.cricket247online.com, http://cricket247online.com');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

var socket_io    = require( "socket.io" );
var io           = socket_io();
io.adapter(redisAdapter({ 
    host: process.env.REDIS_HOST || 'localhost',
   port: process.env.REDIS_PORT || 6379
 }))
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
// app.use(expressSession({
//   name: 'UserSesson',
//   secret: "CBFCBADB97A4DB6F" ,
//   store:new MongoStore({
//       mongooseConnection: mongoose.connection,
//       collection: 'front_session' //default - sessions
//   }),
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 600000,secure: false },
//   rolling: true
// }));
// app.use(flash());
// app.use(webpassport.initialize({ userProperty: "User" }));
// app.use(webpassport.session());
if (app.get('env') == 'production') {
  // app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
  // app.use(logger('dev'));
}
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);
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

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = 85
var server = http.createServer(app);
server.listen(port)
app.io.attach(server);
console.log(`Worker ${process.pid} started on port ${port}`);