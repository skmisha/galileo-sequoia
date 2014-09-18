/**
 * Created by oleg on 9/18/14.
 */
var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;


/*
 * User Endpoint Schema
 */
var UserEndpointSchema = new Schema( {

    endpointArn: {
        type: String,
        required: true

    }

} );


mongoose.model( 'UserEndpoint', UserEndpointSchema );