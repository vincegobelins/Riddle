'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:ExamCtrl
 * @description
 * # ExamCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('ExamCtrl', ['$scope','$http', function($scope, $http) {

    $scope.question = 'premiere examen';

    // téléchargement du json
    $http.get('json/exam1.json').success (function(data) {
      $scope.examData = data;
      $scope.title = data["nom"];
      $scope.question = data["questions"];
      console.log(data["questions"]);
    });
  }]
);
