var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventsSchema   = new Schema({
	bucket_name: String,
	key_name: String,
	date: String,
	desc: String,
	url:  String	
});

module.exports = mongoose.model('Event', EventsSchema);

