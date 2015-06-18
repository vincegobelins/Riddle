'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:GeneratorCtrl
 * @description
 * # GeneratorCtrl
 * Controller of the RiddleApp
 */

angular.module('RiddleApp')
  .controller('GeneratorCtrl', function($scope, $routeParams, riddleFactory, $compile) {

    var init, getExam, clearForm, checkForm, nextStep, loadSprite;
    var param;
    var title, question, author, chapter, answers, answerok, solution, exam, degree, image, countUpload;

    /**
     * Initialize some values
     * @return {void}
     */

    init = function(){

      $scope.param = $routeParams['param'];
      $scope.chapters = riddleFactory.getChapters($scope.param);
      $scope.answers = [{ questionPlaceholder : "foo"}];

      getExam();

      countUpload = 0;

      $( ".cta-generator" ).on( "click", function(e) {
        $(this).toggleClass( 'active' );
      });

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
     * Show next step form
     * @return {void}
     */

      $scope.nextStep = function(offset){

        $scope.step = offset;

        var percentageProgression = (offset-1) * 100 / 3;
        $( ".line-progression").css('width', percentageProgression+"%");

      },

    /**
     * Clear all inputs
     * @return {void}
     */

    clearForm = function(){

      //$('#input-title').val("");
      $('#input-question').val("");
      $("#input-correct-answer").val("");
      $('#textarea-solution').find('p').html('Expliciter la solution (minimum 140 caractères)');

      $('.input-answer').each(function() {
        $(this).val("");
      });

    },

    /**
     * Check if the form is not empty
     * @return {Boolean}
     */

    checkForm = function(){

      var checkForm = true;

      $('.input').each(function(index) {

        if ($(this).val() == ""){
          console.log(index);
          checkForm = false;
        }

      });

      return checkForm;

    }

    /**
     * Send the question
     * @return {void}
     */

    $scope.sendQuestion = function() {

      if(checkForm() == true) {

        //title = $('#input-title').val();
        question = $('#input-question').val();
        author = riddleFactory.getAuth();
        chapter = $('input[name=input-chapter]:checked').val();
        answers = [];
        answerok = $("#input-correct-answer").val();
        solution = $('#textarea-solution').html();
        image = $scope.imgback;

        $('.input-answer').each(function () {
          answers.push($(this).val());
        });

        var sendQuestion = riddleFactory.setQuestion($scope.param, 'title', author, question, chapter, answers, answerok, solution, image);

        clearForm();
        $scope.updateNotification('ok');
      }
      else {

        $scope.updateNotification('ko');

      }

    },

    /**
     * Manage notification
     * @param {String}
     * @return {void}
     */

    $scope.updateNotification = function(type){
      if (type == 'ok'){
        $('#notification-ok').toggleClass('active');
      }
      else if (type == 'ko') {
        $('#notification-ko').toggleClass('active');
      }
      else if (type == 'upload'){
        $('#notification-upload').toggleClass('active');
      }
    },

    /**
     * Take the user URL and display it in the viewer
     * @return {void}
     */

    $scope.displayImg = function() {

      countUpload++

      var img = $('#input-upload').val();
      $scope.imgback = img;

      if(img) {

        loadSprite(img, function() {

          console.log('image loaded');

          degree = 180 * countUpload;
          $(".bloc-image").css({transform: 'rotateY(' + degree + 'deg)'});
          $('.img-add').css({transform: 'rotateY(' + degree + 'deg)'});
        });
      }

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


    /**
     * Add new answer
     * @return {void}
     */

      $scope.addAnswer = function(){
          $scope.answers.push({
          questionPlaceholder: "foo"
        });
      }




    init();
  }
);

