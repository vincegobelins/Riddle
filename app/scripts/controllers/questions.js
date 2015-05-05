'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:QuestionsCtrl
 * @description
 * # QuestionsCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('QuestionsCtrl', ['$scope','$http', function($scope, $http) {

        // téléchargement du json
    /*
      $http.get('json/exam1.json').success (function(data) {
        $scope.examData = data;

        var question = data["questions"][0];

        $scope.title = question["titre"];
        $scope.question = question["question"];
        $scope.reponses = question["reponses"];
      });*/

      var init, data, getQuestion;


      init = function(){
          $http.get('json/exam1.json').success (function(dataExam) {

            $scope.id = 0;
            data = dataExam;
            getQuestion();

          });
      },

      getQuestion = function() {

            var question = data["questions"][$scope.id];

            $scope.title = question["titre"];
            $scope.question = question["question"];
            $scope.reponses = question["reponses"];
      },


        $scope.nextQuestion = function() {

          $scope.id++;
          getQuestion();

        }

      init();
  }]
);
