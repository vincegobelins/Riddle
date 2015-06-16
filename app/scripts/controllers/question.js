'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:QuestionCtrl
 * @description
 * # QuestionCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('QuestionCtrl', function ($scope, $routeParams, riddleFactory,$timeout) {

    var init, getExam, getQuestions, getQuestion, getComments, getAuthor;
    var exam, data;

    /**
     * Inisialize some data
     * @return {void}
     */

    init = function () {

      $scope.answerMode = true;
      $scope.user = riddleFactory.getAuth();
      $scope.param = $routeParams['param'];
      $scope.param2 = $routeParams['param2'];

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

          getQuestion($scope.param2);

        });

      },

    /**
     * Get comments
     */

      getComments = function () {


        riddleFactory.getComments($scope.param, $scope.questionId, function(result) {
          $timeout(function() {
            $scope.comments = result;
          });
        });

        console.log('commentaires : '+$scope.comments);

      },

    /**
     * Scope a new question
     */

      getQuestion = function (questionId) {

        for (var i = 0; i<data.length; i++){
          if(data[i]['$id'] == questionId) {
            var question = data[i];
          }
        }


        $scope.title = question["titre"];
        $scope.question = question["question"];
        $scope.answers = question["reponses"];
        $scope.answerOk = question["reponseok"];
        $scope.solution = question["solution"];

        getAuthor(question["autheur"]);

        $scope.imgfront = question["image"];


        getComments();

      },

    /**
     * Check if answer is true
     * @param {String} answer
     */

    $scope.addFavorite = function () {

      riddleFactory.setUserFavorite($scope.user, $scope.param, $scope.questionId);

    };

    /**
     * Send comment
     * @param {String} answer
     */

    $scope.sendComment = function () {
      var comment = $('.editor').html();
      riddleFactory.setComment($scope.user, $scope.param, $scope.questionId, comment);

    };

    /**
     * Get User details
     * @return {Object}
     */

    getAuthor = function(userId){

      var author;

      riddleFactory.getAccount(userId, function(result) {

        if(result != null){
          author = result;
        }
        else {
          author = {prenom : 'Autheur', nom: 'Inconnu'};
        }

        $timeout(function() {
          $scope.author = author;
        });



      });

    }

    init();
  }
);
