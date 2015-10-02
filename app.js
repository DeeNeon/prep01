var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require('mssql');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/*app.use('/bingo', function(req, res, next) {
  res.render('bingo', { title: 'Bingo' });
});*/

//DB params
var config = {
  user: 'loscabos',
  password: 'csl2015',
  server: 'cartosina.com',
  database: 'cabo',
  options: {
    encrypt: false
  }
};
/*===================*/
app.use('/service/poligonos/:id_seccion', getPoligonos);
function getPoligonos(req, res, next)
{
  res.header("content-type: application/json");
  var data = [];

  var connection = new sql.Connection(config, function(err) {
    // error checks
    if (err) {
      data = "cannot open connection!";
      return;
    }

    // Query
    var request = new sql.Request(connection); // or: var request = connection.request();
    request.query('select poligon from seccion_poligono where seccion = ' + req.params.id_seccion, function (err, recordset) {
      res.json(recordset);
    });
  });
}
/*===============*/

/*====== secciones ========*/
app.use('/service/seccion/:id_distrito', getSecciones);
function getSecciones(req, res, next)
{
  res.header("content-type: application/json");
  var data = [];
  var connection = new sql.Connection(config, function(err) {
    // error checks
    if (err) {
      data = "cannot open connection!";
      return;
    }

    // Query
    var request = new sql.Request(connection); // or: var request = connection.request();
    request.query('select distinct seccion from seccion_poligono where distritolocal = '+req.params.id_distrito, function (err, recordset) {
      res.json(recordset);
    });
  });
}
/*===============*/

/*====== distritos ========*/
app.use('/service/distritos', getDistrito);
function getDistrito(req, res, next)
{
  res.header("content-type: application/json");
  //var id = req.params.id;
  var data = [];
  var connection = new sql.Connection(config, function(err) {
    // error checks
    if (err) {
      data = "cannot open connection!";
      return;
    }

    // Query
    var request = new sql.Request(connection); // or: var request = connection.request();
    request.query('select distinct distritolocal from seccion_poligono', function (err, recordset) {
      res.json(recordset);
    });
  });
}
/*===============*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;




