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

    var init, getExam, getQuestions, getQuestion, getComments, getAuthor, loadSprite;
    var exam, data, malusLimit, degree, bonusLimit;

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

      $('#comment').html('<p>Poster un commentaire</p>');

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

        malusLimit = 1;
        bonusLimit = 1;

        for (var i = 0; i<data.length; i++){
          if(data[i]['$id'] == questionId) {
            var question = data[i];
          }
        }

        $scope.questionId = $scope.param2;
        $scope.title = question["titre"];
        $scope.question = question["question"];
        $scope.chapter = parseInt(question["chapter"]) + 1;
        $scope.answers = question["reponses"];
        $scope.answerOk = question["reponseok"];
        $scope.solution = question["solution"];
        $scope.score = question["score"];

        getAuthor(question["autheur"]);

        $scope.imgback = question["image"];

        loadSprite(question["image"], function() {
          degree = 180;
          $(".bloc-image").css({transform: 'rotateY(' + degree + 'deg)'})
        });


        getComments();

      },

    /**
     * Check if answer is true
     * @param {String} answer
     */

    $scope.addFavorite = function () {
      $('.content-favorite').addClass('active');
      riddleFactory.setUserFavorite($scope.user, $scope.param, $scope.questionId);

    };

    /**
     * Send comment
     * @param {String} answer
     */

    $scope.sendComment = function () {
      var comment = $('#comment').html();
      riddleFactory.setComment($scope.user, $scope.param, $scope.questionId, comment);

      $('#comment').html('<p>Poster un commentaire</p>');

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

    },

    /**
     * Add +1 once per question to score
     * @return {Object}
     */

      $scope.giveBonus = function() {
        if(bonusLimit > 0){
          $scope.score ++;
          riddleFactory.updateQuestionScore($scope.param, $scope.questionId, $scope.score);
        }

        bonusLimit --;
      },

    /**
     * Add -1 once per question to score
     * @return {Object}
     */

    $scope.giveMalus = function() {
      if(malusLimit > 0){
        $scope.score --;
        riddleFactory.updateQuestionScore($scope.param, $scope.questionId, $scope.score);
      }

      malusLimit --;
    },

    /**
     * Load image
     * @return {Callback}
     */

      loadSprite = function(src, callback){
        var sprite = new Image();
        sprite.onload = callback;
        sprite.src = src;
      }

    init();
  }
);
