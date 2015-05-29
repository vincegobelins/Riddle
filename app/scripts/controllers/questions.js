'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:QuestionsCtrl
 * @description
 * # QuestionsCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('QuestionsCtrl', function ($scope, $routeParams, riddleFactory) {

    var init, getExam, getQuestions, getQuestion, addAnsweredQuestion, checkAnsweredQuestion, getRandomIdQuestion, getRandomInt;
    var exam, data, answered, count;

    /**
     * Inisialize some data
     * @return {void}
     */

    init = function () {

      answered = [];

      $scope.user = riddleFactory.getAuth();
      $scope.param = $routeParams['param'];
      $scope.quizzPosition = 0;

      getExam();
      getQuestions();

      // init zenpen
      ZenPen.editor.init();

    },

    /**
     * Get information relative to exam
     * @return {void}
     */

      getExam = function(){

        exam = riddleFactory.getExam($scope.param);

        exam.$loaded().then(function () {

          $scope.exam = exam;
          $scope.parties = $scope.exam["parties"];

        });

      },

    /**
     * Get all questions or by chapter
     * @param {number|void} chapter Chapter id
     * @return {void}
     * @todo
     */

    getQuestions = function () {

          data = riddleFactory.getQuestions($scope.param);

          data.$loaded().then(function () {

          $scope.quizzLength = data.length;
          getQuestion();

        });

    },

    /**
     * Scope a new question
     */

    getQuestion = function () {

          $scope.quizzPosition++;

          var questionId = getRandomIdQuestion();
          var question = data[questionId];

          $scope.title = question["titre"];
          $scope.question = question["question"];
          $scope.answers = question["reponses"];
          $scope.answerOk = question["reponseok"];
          $scope.solution = question["solution"];

    },

    /**
     * Get a random question column
     * @return {integer}
     */

    getRandomIdQuestion = function (){

        var randomCol = getRandomInt(0, data.length-1);
        $scope.questionId = data[randomCol]["$id"];

        while (checkAnsweredQuestion($scope.questionId)==true) {
          randomCol = getRandomInt(0, data.length-1);
          $scope.questionId = data[randomCol]["$id"];
        }

        addAnsweredQuestion($scope.questionId);

        return randomCol;

    },

    /**
     * Stock the id of answered question in array
     * @param {number} id Question id
     * @return {void}
     */

     addAnsweredQuestion = function(id){

       answered.push(id);
       console.log(answered);

     },

    /**
     * Check if the question is already answered by id
     * @param {number} id Question id
     * @return {Boolean}
     */

    checkAnsweredQuestion = function(id){

        var i, isAnswered;

        isAnswered = false;

        for (i=0; i<answered.length; i++){
            if(answered[i] == id) {
              isAnswered = true;
            }
        }

        return isAnswered;
    },

    /**
     * Get a random int inside an interval
     * @param {number} min
     * @param {number} max
     * @return {integer}
     */

    getRandomInt = function(min, max) {

      return Math.floor(Math.random() * (max - min + 1)) + min;

    },

    /**
     * Scope the next question
     */

    $scope.nextQuestion = function () {

      count = 0;

      if($scope.quizzPosition < $scope.quizzLength) {

        $scope.answerMode = false;
        getQuestion();

        var percentageProgression = $scope.quizzPosition * 100 / $scope.quizzLength;
        $( ".line-progression").css('width', percentageProgression+"%")
      }

    },

    /**
     * Check if answer is true
     * @param {String} answer
     */

    $scope.checkAnswer = function (answer) {

        if (answer == $scope.answerOk) {
          $scope.answerMode = true;

          // create an array in bdd to record results
          if( count == 0 ) {
            riddleFactory.setUserQuestion($scope.user, $scope.param, $scope.questionId, 'true');
          }
          else {
            riddleFactory.setUserQuestion($scope.user, $scope.param, $scope.questionId, 'false');
          }


        } else {
          $scope.answerMode = false;
        }

        count++;

    };

    init();
  }
);
