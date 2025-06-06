var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const session = require("express-session"); //session
const {connectToMongoDb} = require('./config/db');
const cors = require("cors");
require("dotenv").config();

const logMiddleware = require('./middlewares/logsMiddlewares.js'); //log
const http = require('http');

var indexRouter = require('./routes/indexRouter');
var usersRouter=require('./routes/usersRouter');
var osRouter=require('./routes/osRouter');
var productRouter = require('./routes/productRouter');
var GeminiRouter = require("./routes/GeminiRouter");
var categoryRouter = require('./routes/categoryRouter');
var orderRouter = require("./routes/orderRouter");
var cartRouter = require("./routes/cartRouter");
var reviewRouter = require('./routes/reviewRouter');

var favoritesRouter= require("./routes/favoritesRouter");
var complaintRouter= require("./routes/complaintRouter.js");




var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logMiddleware)  //log


app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

/*app.use(session({
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',   // à ajouter aussi ici si tu utilises la session
  }
}));*/



app.use("", indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/products', productRouter);
app.use("/Gemini", GeminiRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use('/cart', cartRouter);
app.use('/reviews', reviewRouter);

app.use('/favorites', favoritesRouter);
app.use('/complaints', complaintRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const server = http.createServer(app); //2
server.listen(process.env.port, () => {
  connectToMongoDb()
  console.log("app is running on port 5000");
}); 