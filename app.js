var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session"); //session
const {connectToMongoDb} = require('./config/db');
const cors = require("cors");
require("dotenv").config();

const logMiddleware = require('./middlewares/logsMiddlewares.js'); //log
const http = require('http');

var indexRouter = require('./routes/indexRouter');
var usersRouter=require('./routes/usersRouter');
var osRouter=require('./routes/osRouter');
var produitRouter = require('./routes/produitRouter');
var GeminiRouter = require("./routes/GeminiRouter");
var categorieRouter = require('./routes/categorieRouter');
var commandeRouter = require("./routes/commandeRouter");
var panierRouter = require("./routes/panierRouter");
var avisRouter = require('./routes/avisRouter');
var livraisonRouter= require("./routes/livraisonRouter");
var favorisRouter= require("./routes/favorisRouter");
var reclamationRouter= require("./routes/reclamationRouter");




var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logMiddleware)  //log


app.use(session({   //cobfig session
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: {secure: false},
    maxAge: 24*60*60,
  },
}))

app.use(cors({
  origin:"http://localhost:3000",
  methods:"GET,POST,PUT,Delete",
}))

app.use("/", indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/produits', produitRouter);
app.use("/Gemini", GeminiRouter);
app.use('/categories', categorieRouter);
app.use('/commande', commandeRouter);
app.use('/panier', panierRouter);
app.use('/avis', avisRouter);
app.use('/livraison', livraisonRouter);
app.use('/favoris', favorisRouter);
app.use('/reclamation', reclamationRouter);




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