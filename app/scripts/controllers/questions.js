'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:QuestionsCtrl
 * @description
 * # QuestionsCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('QuestionsCtrl', function ($scope, $routeParams, riddleFactory,$timeout) {

    var init, getExam, getQuestions, getQuestion, getComments, addAnsweredQuestion, checkAnsweredQuestion, getRandomIdQuestion, getRandomInt, getAuthor, loadSprite, random;
    var exam, data, answered, count, degree, malusLimit, bonusLimit;

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
     * Get comments
     */

    getComments = function () {


      riddleFactory.getComments($scope.param, $scope.questionId, function(result) {
          $timeout(function() {
            $scope.comments = result;
          });
      });

    },

    /**
     * Scope a new question
     */

      getQuestion = function () {

        count = 0;
        malusLimit = 1;
        bonusLimit = 1;
        $scope.answerMode = false;
        $scope.icon = 'empty';

        $scope.quizzPosition++;
        var percentageProgression = $scope.quizzPosition * 100 / $scope.quizzLength;
        $( ".line-progression").css('width', percentageProgression+"%");

        var questionId = getRandomIdQuestion();
        var question = data[questionId];

        $scope.title = question["titre"];
        $scope.question = question["question"];
        $scope.chapter = parseInt(question["chapter"]) + 1;
        $scope.answers = random(question["reponses"]);
        console.log('answers');
        $scope.answerOk = question["reponseok"];
        $scope.solution = question["solution"];
        $scope.score = question["score"];

        getAuthor(question["autheur"]);

        if($scope.quizzPosition&1){
          $scope.imgback = question["image"];
        }
        else {
          $scope.imgfront = question["image"];
        }

        getComments();

        loadSprite(question["image"], function() {

          degree = 180 * ($scope.quizzPosition+2);
          $(".bloc-image").css({transform: 'rotateY(' + degree + 'deg)'})
        });

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

      $('#comment').html('<p>Poster un commentaire</p>');

      if($scope.quizzPosition < $scope.quizzLength) {
        getQuestion();
      }

      else {
        $('#notification-ok').toggleClass('active');
      }

    },

    /**
     * Check if answer is true
     * @param {String} answer
     */

    $scope.checkAnswer = function (answer, index) {

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
          $('.item-answer:eq('+index+')').addClass('false');
          $scope.answerMode = false;
        }

        // response icon

        if($scope.answerMode && count == 0) {
          $scope.icon = 'green';
        }
        else if(!$scope.answerMode && count == 0){
          $scope.icon = 'red';
        }

        count++;

    };

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

    }

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
    }

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
    },

    /**
     * Randomize array
     * @return {array}
     */

      random = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    init();
  }
);
