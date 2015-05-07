'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:QuestionsCtrl
 * @description
 * # QuestionsCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('QuestionsCtrl', function ($scope, $routeParams, $firebaseArray, config) {

    var init, getQuestions, getQuestion, getRandomIdQuestion, getRandomInt;
    var bdd, data;

    init = function () {
      $scope.data = [];

      // chercher les données dans la base
      // boucler sur les résultats
      /*
       var question = {
       id : '',
       questions: [],
       utilisateurs: []
       };

       $scope.data.push(question);


       $http.get('json/exam1.json').success (function(dataExam) {

       $scope.id = 0;
       data = dataExam;
       getQuestion();

       });*/

      $scope.param = $routeParams['param'];
      $scope.id = 0;

      bdd = config.BDD;

      getQuestions();


    },

    getQuestions = function () {

        var query = bdd+"exams/" + $scope.param + "/questions";
        var result = new Firebase(query);
        data = $firebaseArray(result);

        data.$loaded().then(function () {

          getQuestion();

        });

    },

    getQuestion = function () {

        var questionId = getRandomIdQuestion();
        var question = data[questionId];

        $scope.title = question["titre"];
        $scope.question = question["question"];
        $scope.answers = question["reponses"];
        $scope.answerOk = question["reponseok"];
        $scope.solution = question["solution"];
    },

    getRandomIdQuestion = function (){

        var usedId;
        var randomId = getRandomInt(0, data.length-1);
        return randomId;

    },


    getRandomInt = function(min, max) {

      return Math.floor(Math.random() * (max - min + 1)) + min;

    }


    $scope.nextQuestion = function () {

        $scope.answerMode = false;
        $scope.id++;
        getQuestion();

    },


    $scope.checkAnswer = function (answer) {

        if (answer == $scope.answerOk) {
          $scope.answerMode = true;
        } else {
          $scope.answerMode = false;
        }

    };

    init();
  }
);
