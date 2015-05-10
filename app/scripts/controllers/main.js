'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('MainCtrl', function ($scope, riddleFactory) {

    var init, getExams;

    init = function() {

      getExams();

    }

    getExams = function() {

      $scope.exams = riddleFactory.getExams();

    }

    init();

  });
