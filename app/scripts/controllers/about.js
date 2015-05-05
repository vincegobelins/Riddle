'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
