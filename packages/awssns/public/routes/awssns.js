'use strict';

angular.module('mean.awssns').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('awssns example page', {
      url: '/awssns/example',
      templateUrl: 'awssns/views/index.html'
    });
  }
]);
