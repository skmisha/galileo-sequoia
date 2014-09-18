/**
 * Created by oleg on 9/17/14.
 */

var SNS = require( 'sns-mobile' );
var mongoose = require( 'mongoose' ),
    UserEndpoint = mongoose.model( 'UserEndpoint' );

// Just some environment variables configured
var SNS_KEY_ID = 'AKIAIZCKNYXMN45NMKUQ',
    SNS_ACCESS_KEY = 'XEdWMaJ7f6zQcUKjQUYSsSPEDLVD5aqtaYFomoNo',
    ANDROID_ARN = 'arn:aws:sns:us-west-2:130278419308:app/GCM/HackatonAPp';


// Object to represent the PlatformApplication we're interacting with
var snsService = new SNS( {
    platform: 'android',
    region: 'us-west-2',
    apiVersion: '2010-03-31',
    accessKeyId: SNS_KEY_ID,
    secretAccessKey: SNS_ACCESS_KEY,
    platformApplicationArn: ANDROID_ARN
} );


snsService.on( 'addUserFailed', function () {
    console.log( 'addUserFailed(): ', arguments );
} );

// Handle user added events
snsService.on( 'userAdded', function ( endpointArn, deviceId ) {
    console.log( '\nSuccessfully added device with deviceId: ' + deviceId + '.\nEndpointArn for user is: ' + endpointArn );

    // Maybe do some other stuff...
} );

// Publicly exposed function
exports.register = function ( req, res ) {
    console.log( 'awssns/register controller invoked' );

    console.log( 'token', req.body.token );
    console.log( 'body', req.body );
    var deviceId = req.body['token'];

    console.log( '\nRegistering user with deviceId: ' + deviceId );

    // Add the user to SNS
    snsService.addUser( deviceId, null, function ( err, endpointArn ) {
        if ( err ) {
            console.log( err );
            return res.status( 500 ).json( {
                status: 'not ok'
            } );
        }
        addEndpoint( endpointArn );
        console.log( 'endpointArn', endpointArn );
        res.status( 200 ).json( {
            status: 'ok'
        } );
    } );
};
// HERE .. can export data
function sendMessageInner( message, callback ) {
    findEndpoint().exec( function ( err, endpoints ) {
        console.log( 'endpoints', endpoints );
        if ( endpoints.length > 0 ) {
            var endpointArn = endpoints[0].endpointArn;
            snsService.sendMessage( endpointArn, message, function ( err, messageId ) {
                if ( err ) {
                    console.log( 'An error occured sending message to device %s', endpointArn );
                    console.log( err );
                } else {
                    var msg = 'Successfully sent a message to device  MessageID was ' + messageId;
                    console.log( msg );
                    callback( null, msg );
                }
            } );
        } else {
            var err = 'Error.endpoints length <0. Message NOT sent';
            console.log( err );
            callback( err, null );
        }
    } );
}


exports.sendMessage = function ( req, res ) {
    console.log( "sendMessage", req.body );
    sendMessageInner( req.body.message, function ( err, msg ) {
        if ( err ) {
            res.status( 500 ).json( {error: err} );
        } else {
            res.status( 200 ).json( {status: msg } );
        }
    } );
};


/**
 * Create an article
 */
function addEndpoint( endpointArn ) {
    var endpoint = new UserEndpoint( {'endpointArn': endpointArn} );

    endpoint.save( function ( err ) {
        if ( err ) {
            console.err( 'Add endpoint', err );
        }
    } );
};

function findEndpoint() {
    return UserEndpoint.find();

}
