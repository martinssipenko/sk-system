
/**
 * Module dependencies.
 */
 
var databaseUrl = "sksystem";
var collections = ["participants"]

var h5bp = require('./lib/h5bp')
  , express = require('express')
  , path = require('path')
  , app = h5bp.createServer({server: 'express', root: path.join(__dirname, 'public')})
  , ind = require('./routes/ind')
  , mtb = require('./routes/mtb')
  , tri = require('./routes/tri')
  , fut = require('./routes/fut')
  , dg = require('./routes/dg')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , db = require('mongojs').connect(databaseUrl, collections)
  , config = require('./config');

app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.cookieParser('your secret here'));
  //app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  //app.use(gzippo.staticGzip(__dirname + '/public'));
});

app.configure('development', function(){
  //app.use(express.errorHandler());
});

io.set('log level', '0')
//io.set('browser client gzip', 'true')

/* ROUTE DEFINITIONS */
app.get('/', ind.reg);
app.get('/10km', ind.reg);
app.get('/10km/reg', ind.reg);
app.post('/10km/reg', ind.regpost);
app.get('/10km/reg/recent', ind.reg);
app.get('/10km/sta', ind.sta);
app.get('/10km/fin', ind.fin);
app.get('/10km/prot', ind.prot);
app.get('/10km/kom', ind.kom);
app.post('/10km/reg/cnum', ind.cnum);

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

app.post('/ajax/partlookup', function(req, res) {
    db.participants.find({name: new RegExp(req.query.query)}, function(err, result) {
        res.send(result);
    });
});

/* SOCKET.IO */
io.sockets.on('connection', function (socket) {
  var sDate = new Date(config.indStart.year, config.indStart.month, config.indStart.day, config.indStart.hour, config.indStart.minute, 00, 00);
  var emitServerTime = function() {
    var cDate = new Date();
	socket.emit('serverTime', { time: cDate.getTime() });
  }
  emitServerTime();
  setInterval(function(){emitServerTime();}, 60000);
  socket.emit('startTime', { time: sDate.getTime() });
});

/* START SERVER */
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
