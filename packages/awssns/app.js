'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Awssns = new Module('awssns');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Awssns.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Awssns.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
//  Awssns.menus.add({
//    title: 'awssns example page',
//    link: 'awssns example page',
//    roles: ['authenticated'],
//    menu: 'main'
//  });

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Awssns.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Awssns.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Awssns.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Awssns;
});
