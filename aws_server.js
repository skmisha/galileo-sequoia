var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var event      = require('./app/models/events.js');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// BASIC SETUP
// ===========================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sequoia-db1'); 


var port = process.env.PORT || 3000; 		// set our port
var aws_server = process.env.AWS_SERVER || "http://ec2-54-69-15-160.us-west-2.compute.amazonaws.com";
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	// TODO: set page with description of api
	res.json({ message: 'hooray! welcome to Sequoia group api!' });	
});

router.get('/event', function(req, res){
	res.json({ date:"some date", url: "some url", desc:" some description"});
});

router.post('event', function(req, res){
		
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Something is happening on '+aws_server+':' + port);

