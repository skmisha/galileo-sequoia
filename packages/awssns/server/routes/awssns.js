'use strict';

var sns = require( '../controllers/sns-controller' );

// The Package is past automatically as first parameter
module.exports = function ( Awssns, app, auth, database ) {

    app.route( '/awssns/register' )
        .post( sns.register )
        .get( sns.register );

    app.route('/awssns/sendMessage' ).
        post(sns.sendMessage);
};
