'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:ExamCtrl
 * @description
 * # ExamCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('ExamCtrl', function($scope, $routeParams, riddleFactory) {

    var init, exam, getExam, getUserId, getQuestions, countUserQuestion, initCanvas, renderCanvas, buildTower, moveTowerUp, moveTowerDown, getStatistics, getChapterStatistics, setEventListener, showTuto;
    var param, velocity, distance, canvas, canvasIso, context, blocArray;

    init = function(){

      $scope.param = $routeParams['param'];
      $scope.auth = riddleFactory.getAuth();

      velocity = 0; distance = 0;

      getExam();
      getQuestions();

      initCanvas();
      setEventListener();

      $( ".search-submit" ).on( "click", function(e) {
        e.preventDefault();
        $('#wrapper-search-input').toggleClass( 'active' );
      });

      $(window).on( "scroll", function() {
        if ($(window).scrollTop() == 0)
          $('.wrapper-bloc-tabs').removeClass( 'sliding' );
        else {
          $('.wrapper-bloc-tabs').addClass( 'sliding' );
        }
      });

      // hide tuto
      $('.tuto-animate').hide();



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

        var questions = riddleFactory.getQuestions($scope.param);

        $scope.userQuestionLength = 0;

        questions.$loaded().then(function () {

          var questionsUser = riddleFactory.getUserQuestion($scope.auth, $scope.param);

            console.log('question User :'+questionsUser);

            questionsUser.$loaded().then(function () {

              for(var i =0; i<questions.length; i++) {

                var questionId = questions[i]['$id'];

                for(var j =0; j<questionsUser.length; j++) {
                  if(questionsUser[j]['$id'] == questionId) {
                    // Verifier s'il y a des données utilisateur, sinon verouiller la question

                    if(questionsUser[j]['question']) {
                      questions[i]["user_reponse"] = questionsUser[j]['question'];
                    }
                    questions[i]["user_favorite"] = questionsUser[j]['favorite'];
                  }
                }

                if(!questions[i]["user_reponse"]){
                  questions[i]["question"] = 'Question vérouillée';
                }
              }

              // init every variable and method which need loaded questions from database
              $scope.questions = questions;
              $scope.filters = { };

              console.log($scope.questions);

              // @todo cette fonction doit être appelé en verifiant que exam est chargé également
              countUserQuestion();
              var statistics = getStatistics();
              blocArray = buildTower(statistics);
              renderCanvas();
              TweenMax.delayedCall(2, showTuto);
            });


        });

      },

    /**
     * Define canvas and context
     * @return {void}
     */

    initCanvas = function(){

      canvasIso = new Isomer(document.getElementById("stats"));
      canvas = document.getElementById("stats");
      context = canvas.getContext("2d");

    },

    /**
     * Count the number of user questions
     * @return {void}
     */

    countUserQuestion = function(){

      $scope.userQuestionLength = 0;

      for(var i = 0; i<$scope.questions.length; i++){

        if($scope.questions[i]['autheur'] == $scope.auth){
          $scope.userQuestionLength++;
        }
      }
    },

      $scope.countObject = function(obj) {

        var length = 0;

        if(obj) {
          length = Object.keys(obj).length;
        }

        return length;
      }

    /**
     * Render and animate canvas
     * @return {void}
     */

    renderCanvas = function(){

      var Color  = Isomer.Color;

      var white = new Color(255, 255, 255, 0.5);
      var red = new Color(215, 80, 50);
      var green = new Color(100, 142, 60);

      var Point  = Isomer.Point;
      var Shape  = Isomer.Shape;

      var canvasHeight = 1200;

      context.clearRect(0, 0, canvas.width, canvas.height);
      // draw base cube
      canvasIso.add(Shape.Prism(new Point(-2, 2, -1), 3, 3, 0.5), green);

      velocity = velocity * 0.85;
      distance = Math.max(0, Math.min((distance + (1*velocity)), 0.28));


        if (blocArray){

          for (var i=0; i<blocArray.length; i++) {

            var color, blocOffset;

            if(i&1){
              color = white;
              blocOffset = i;

              if(blocArray[i]['height'] != 0) {
                canvasIso.add(blocArray[i]['bloc'].translate(0, 0, distance*blocOffset), color);
              }
            }
            else {
              color = red;
              blocOffset = i +1;

              context.fillStyle = 'white';
              context.beginPath();
              context.moveTo(15 + 700 + distance * 100, 0 + ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 125) ) - distance * 100 );
              context.lineTo(30 + 700 + distance * 100, 25 + ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 125) ) - distance * 100 );
              context.lineTo(0 + 700 + distance * 100, 25 + ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 125) ) - distance * 100 );
              context.closePath();
              context.fill();

              context.strokeStyle = 'white';
              context.fillStyle = "white";
              context.font = "bold 45px Gotham Rounded Bold";
              context.fillText("CHAPITRE : "+blocArray[i]['chapter'], 750 + distance * 100, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 100) ) - distance * 100 );
              context.font = "bold 30px Gotham Rounded Light";
              context.fillText("ACQUIS :", 700 + distance *100, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 55) ) - distance * 100 );
              context.fillStyle = "#ffffff";
              context.font = "bold 70px Gotham Rounded Light";
              context.fillText(blocArray[i]['percentage'], 870+distance*100, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 25) ) - distance * 100 );
              context.fillStyle = "#f26744";
              context.fillText("%", 1010 + distance*100, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 25) ) - distance * 100 );

              if(blocArray[i]['height'] != 0) {
                canvasIso.add(blocArray[i]['bloc'].translate(0, 0, distance*blocOffset), color);
              }


              context.lineWidth = 3;
              context.beginPath();
              context.moveTo(400, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 100) ) - distance * 100 );
              context.lineTo(680, ( canvasHeight - ( canvasHeight / ( blocArray.length / 2) * i / 2 + 100) ) - distance * 100 );
              context.stroke();
              context.lineWidth = 1;
            }

          }
        }

    },

    /**
     * Put in array some blocks
     * @return {Array}
     */

    buildTower = function(statistics) {

      var Point  = Isomer.Point;
      var Shape  = Isomer.Shape;

      var blocArray, xOrigin, yOrigin, width;

      blocArray = [];
      xOrigin = -2;
      yOrigin = 2;
      width= 2;

      var lenght = statistics.length;
      var questionsLenght = $scope.questions.length;
      var buildingHeight = 14;
      var offset  = 0;

      for (var i=0; i<lenght; i++) {

        var itemArray = [];

        var blocOkHeight = (statistics[i]["answerLength"]) * buildingHeight / questionsLenght;
        var bloc = Shape.Prism(new Point(xOrigin, yOrigin, offset), width, width, blocOkHeight);
        var percentage = Math.round(statistics[i]["answerLength"] * 100 / statistics[i]["questionLength"]);

        itemArray = {'bloc' : bloc, 'percentage' : percentage, 'chapter' : i+1, 'height' : blocOkHeight};

        blocArray.push(itemArray);
        offset = offset + blocOkHeight;

        var blocKoHeight = ((statistics[i]["questionLength"]) - (statistics[i]["answerLength"])) * buildingHeight / questionsLenght;
        var bloc = Shape.Prism(new Point(xOrigin, yOrigin, offset), width, width, blocKoHeight);

        itemArray = {'bloc' : bloc, 'height' : blocKoHeight};

        offset = offset + blocKoHeight;

        blocArray.push(itemArray);
      }

      return blocArray;

    },

    /**
     * Set listener on canvas
     * @return {void}
     */

    setEventListener = function(){
      canvas.addEventListener("mouseover", moveTowerUp);
      canvas.addEventListener("mouseout", moveTowerDown);
    }

    /**
     * Set a positive velocity
     * @return {void}
     */

    moveTowerUp = function(){
      velocity = 0.05;
    }

    /**
     * Set a negative velocity
     * @return {void}
     */

    moveTowerDown = function(){
      velocity = -0.05;
    }

    /**
     * Get statistic
     * @return {Array} Array of percentage about user performance
     */

    getStatistics = function(){

      var statistics = [];

      for(var i = 0; i<$scope.exam["parties"].length; i++){
        statistics[i] = getChapterStatistics($scope.exam["parties"][i]["id"]);
      }

      return statistics;

    }

    /**
     * Get numbers of question in particular chapter
     * @param {String} Chapter id
     * @return {Array} Array with total number of questions and total number of good answers
     */

    getChapterStatistics = function(chapterId){

      var questionLength = 0;
      var answerLength = 0;

      for(var i = 0; i<$scope.questions.length; i++){
        if($scope.questions[i]["chapter"] == chapterId) {
          questionLength++;
          if($scope.questions[i]["user_reponse"]=="true"){
            answerLength++;
          }
        }
      }

      var chapterStatistics = {
          "questionLength": questionLength,
          "answerLength": answerLength
      };

      return chapterStatistics;

    },

    /**
     * Anim and show tutorial
     * @return {void}
     */

      showTuto = function(){
        $('.tuto-animate').show();
        TweenMax.staggerFrom(".tuto-animate", 1, { y: -200, opacity: 0, ease: Back.easeOut.config(1.7)}, 0.5);
      },




    init();
    setInterval(renderCanvas, 1000 / 30);
  }
);
