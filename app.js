var express = require('express');
var routes = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

if ('development' == app.get('env')){
  app.use(errorHandler);
}

app.listen(app.get('port'), function(){
  console.log('Express listening on port' + app.get('port'));
});