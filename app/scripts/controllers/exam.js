'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:ExamCtrl
 * @description
 * # ExamCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('ExamCtrl', function($scope, $routeParams, $firebaseObject, config) {

    var init, getExam;
    var param, bdd;

    init = function(){

      $scope.param = $routeParams['param'];
      bdd = config.BDD;
      getExam();

    }

    getExam = function(){

      var query = bdd+"exams/"+$scope.param;
      var result = new Firebase(query);
      $scope.exam = $firebaseObject(result);

    }

    init();
  }
);
