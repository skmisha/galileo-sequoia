'use strict';

var sns = require( '../controllers/sns-controller' );

// The Package is past automatically as first parameter
module.exports = function ( Awssns, app, auth, database ) {

    app.route('/awssns/register')
        .post(sns.register)
        .get(sns.register);

    app.route('/awssns/sendMessage').
        post(sns.sendMessage);


    app.route('/event').get(function (req, res) {
        m_ev.find({}, function (err, results) {
            res.json(results);
        });
    });

    app.route('/event').post(function (req, res) {
        var ev = new Event();
        ev.bucket_name = req.body.bucket_name;
        ev.key_name = req.body.key_name;
        ev.date = req.body.date;
        ev.desc = req.body.desc;
        ev.save(function (err) {
            if (err) res.send(err);
            console.log("Event was written: " + JSON.stringify(ev));
            res.writeHead(200, {'content-type': 'text/html'});
            res.end();
        });
    });

};