'use strict';

angular.module('mean.awssns').controller('AwssnsController', ['$scope', 'Global', 'Awssns',
  function($scope, Global, Awssns) {
    $scope.global = Global;
    $scope.package = {
      name: 'awssns'
    };
  }
]);
