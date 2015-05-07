'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('MainCtrl', function ($scope, $firebaseArray, config) {

    var init, getExams;
    var bdd;

    init = function() {

      bdd = config.BDD;
      getExams();

    }

    getExams = function() {

      var query = bdd+"exams";
      var result = new Firebase(query);
      $scope.exams = $firebaseArray(result);

    }

    init();

  });
