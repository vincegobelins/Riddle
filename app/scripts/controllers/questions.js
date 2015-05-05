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
            $scope.answers = question["reponses"];
            $scope.answerOk = question["reponseok"];
            $scope.solution = question["solution"];
      },


        $scope.nextQuestion = function() {

          $scope.answerMode = false;
          $scope.id++;
          getQuestion();

        },


        $scope.checkAnswer = function(answer) {

          if(answer == $scope.answerOk) {
              $scope.answerMode = true;
          } else {
              $scope.answerMode = false;
          }

        };

      init();
  }]
);
