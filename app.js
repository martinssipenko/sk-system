
/**
 * Module dependencies.
 */

var express = require('express')
  , ind = require('./routes/ind')
  , mtb = require('./routes/mtb')
  , tri = require('./routes/tri')
  , fut = require('./routes/fut')
  , dg = require('./routes/dg')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', ind.reg);
app.get('/10km', ind.reg);
app.get('/10km/reg', ind.reg);
app.get('/10km/sta', ind.sta);
app.get('/10km/fin', ind.fin);
app.get('/10km/prot', ind.prot);
app.get('/10km/kom', ind.kom);

app.get('/mtb', mtb.reg);
app.get('/mtb/reg', mtb.reg);
app.get('/mtb/sta', mtb.sta);
app.get('/mtb/fin', mtb.fin);
app.get('/mtb/prot', mtb.prot);

app.get('/tri', tri.reg);
app.get('/tri/reg', tri.reg);
app.get('/tri/sta', tri.sta);
app.get('/tri/fin', tri.fin);
app.get('/tri/prot', tri.prot);

app.get('/fut', fut.reg);
app.get('/fut/reg', fut.reg);
app.get('/fut/prot', fut.prot);

app.get('/dg', dg.reg);
app.get('/dg/reg', dg.reg);
app.get('/dg/prot', dg.prot);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
