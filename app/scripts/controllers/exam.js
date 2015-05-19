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

    var init, exam, getExam, getQuestions, initCanvas, renderCanvas, buildTower, moveTowerUp, moveTowerDown, setEventListener;
    var param, velocity, distance, canvas, canvasIso, context, blocArray;

    init = function(){

      $scope.param = $routeParams['param'];
      $scope.auth = riddleFactory.getAuth();
      getExam();

      velocity = 0; distance = 0;

      getQuestions();

      initCanvas();
      setEventListener();
      renderCanvas();

      $( ".search-submit" ).on( "click", function(e) {
        e.preventDefault();
        $('#wrapper-search-input').toggleClass( 'active' );
      });

    }

    /**
     * Get information relative to exam
     * @return {void}
     */

    getExam = function(){

      exam = riddleFactory.getExam($scope.param);

      exam.$loaded().then(function () {

        $scope.exam = exam;
        $scope.parties = $scope.exam["parties"];
        console.log($scope.exam);
        console.log($scope.parties);

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

        questions.$loaded().then(function () {

          var questionsUser = riddleFactory.getUserQuestion($scope.auth, $scope.param);

            questionsUser.$loaded().then(function () {

              for(var i =0; i<questions.length; i++) {

                var questionId = questions[i]['$id'];

                for(var j =0; j<questionsUser.length; j++) {

                  if(questionsUser[j]['$id'] == questionId) {
                    console.log("ok !");
                    questions[i]["user_reponse"] = questionsUser[j]['question'];
                  }
                }
              }

              console.log(questions);

            });

          $scope.questions = questions;
          $scope.filters = { };

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

      blocArray = buildTower();

    },

    /**
     * Render and animate canvas
     * @return {void}
     */

    renderCanvas = function(){

      var Color  = Isomer.Color;

      var white = new Color(255, 255, 255, 0.5);
      var red2 = new Color(200, 85, 60, 0.5);
      var red = new Color(150, 85, 62, 0.5);
      var green = new Color(100, 142, 60, 0.5);

      var Point  = Isomer.Point;
      var Shape  = Isomer.Shape;
      var test = 0;

        // fix render issue
        context.fillStyle = "#2e3039";
        context.fillRect (0, 0, 1200, 1400);
        // draw base cube
        canvasIso.add(Shape.Prism(new Point(-2, 2, -2), 4, 4, 1), green);

        velocity = velocity * 0.85;
        distance = distance + (1*velocity);

        //  iso.add(blocArray[1].translate(-2, 2, test), red2);

        for (var i=0; i<blocArray.length; i++) {

          var color;

          if(i&1){
            color = red2
          }
          else {
            color = white;
          }

          canvasIso.add(blocArray[i].translate(0, 0, distance*i), color);
        }

        for (var i=0; i<blocArray.length/2; i++) {
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(400, (1200/(blocArray.length/2)*i+200)-distance*100);
          context.lineTo(690, (1200/(blocArray.length/2)*i+200)-distance*100);
          context.stroke();
          context.fillStyle = "white";
          context.font = "bold 70px Gotham Rounded Bold";
          context.fillText("CHAPITRE "+i, 700+distance*100, (1200/(blocArray.length/2)*i+200)-distance*100);
          context.font = "bold 30px Gotham Rounded Light";
          context.fillText("REUSSITE :", 700+distance*100, (1200/(blocArray.length/2)*i+240)-distance*100);
          context.fillStyle = "#f26744";
          context.font = "bold 100px Gotham Rounded Light";
          context.fillText("50%", 900+distance*100, (1200/(blocArray.length/2)*i+280)-distance*100);
        }

        console.log("refresh");

    },

    /**
     * Put in array some blocks
     * @return {Array}
     */

    buildTower = function() {

      var Point  = Isomer.Point;
      var Shape  = Isomer.Shape;

      var blocArray, xOrigin, yOrigin, width;

      blocArray = [];
      xOrigin = -2;
      yOrigin = 2;
      width= 2;

      var lenght = 3;
      var blocHeight = 14/lenght;
      var offset  = 0;

      for (var i=0; i<lenght; i++) {

        var blocOkHeight = blocHeight/2;
        var bloc = Shape.Prism(new Point(xOrigin, yOrigin, offset), width, width, blocOkHeight);
        blocArray.push(bloc);
        offset = offset + blocOkHeight;

        var blocKoHeight = blocHeight/2;
        var bloc = Shape.Prism(new Point(xOrigin, yOrigin, offset), width, width, blocKoHeight);
        blocArray.push(bloc);
        offset = offset + blocKoHeight;
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

    init();

    setInterval(renderCanvas, 1000 / 30);
  }
);
