'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:ExamCtrl
 * @description
 * # ExamCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('ExamCtrl', function($scope, $routeParams, riddleFactory) {

    var init, getExam;
    var param, bdd;

    init = function(){

      $scope.param = $routeParams['param'];
      getExam();

    }

    getExam = function(){

      $scope.exam = riddleFactory.getExam($scope.param);

    }

    init();
  }
);
