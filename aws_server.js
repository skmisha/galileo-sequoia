var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var Event      = require('./app/models/events.js');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// BASIC SETUP
// ===========================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sequoia-db1');

var mean = require('meanio');

// Creates and serves mean application
mean.serve({ /*options placeholder*/ }, function(app, config) {
    var port = config.https && config.https.port ? config.https.port : config.http.port;
    console.log('Mean app started on port ' + port + ' (' + process.env.NODE_ENV + ')');
});





var port = process.env.PORT || 3000; 		// set our port
var aws_server = process.env.AWS_SERVER || "http://ec2-54-69-15-160.us-west-2.compute.amazonaws.com";
var ev = new Event();
var m_ev = mongoose.model('Event');

app.use('/app', express.static(__dirname+'/app'));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

app.get('/', function(req, res) {
	res.sendFile(__dirname +'/app/views/homepage.html');
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	// TODO: set page with description of api
	res.sendFile(__dirname +'/app/views/listofapi.html');
	//res.json({ message: 'hooray! welcome to Sequoia group api!' });	
});

router.get('/event', function(req, res){
  m_ev.find({}, function(err, results){
		res.json(results);		
	});
});

router.post('/event', function(req, res){
	var ev = new Event();
	ev.bucket_name = req.body.bucket_name;
	ev.key_name    = req.body.key_name;
	ev.date        = req.body.date;
	ev.desc        = req.body.desc;
	ev.save(function(err) {
		if (err) res.send(err);
				console.log("Event was written: "+JSON.stringify(ev));
				res.writeHead(200, {'content-type':'text/html'});
				res.end();
		});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Something is happening on '+aws_server+':' + port);

