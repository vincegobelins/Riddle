'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('MainCtrl', function ($scope, riddleFactory, $compile, $timeout, $location) {

    var getExams, initMap, drawLine, showTitles, showCities, changeLocation, showTitlesAndCities;
    var exams;
    var iterate = 0;

    $scope.init = function() {

      getExams();
      TweenMax.delayedCall(1, initMap);

    },

    /**
     * Init the map by drawing the box and the subject line
     * @return {void}
     */

    initMap = function(){

      $('#header').addClass('custom-header');

      drawLine(6, 'green', 'exam2');
      drawLine(10, 'orange', 'exam1');

      // Follow the mouse to add new exam

      $('.bloc-map').mousemove(function( event ) {

        var blocWidth = 115;

        var step = Math.floor(event.pageY / blocWidth);
        var value = ( blocWidth + 0.3 ) * step;

        $('#cta-new').css('top', value);

      });

      $('.title-map').css('left', '-500px');

      // Make box enter randomly


      var box = $('.box').toArray();
      box.sort(function(){return 0.5-Math.random()});
      $('.box').css('visibility', 'visible')
      TweenMax.staggerFrom(box, 1, { y:-100, x:100, opacity: 0, ease: Back.easeOut.config(1.7)}, 0.0025, showTitlesAndCities);


    },

    /**
     * Function used to call showTitle() and showCities() in callback of Tweenmax boxes
     * @return {void}
     */

    showTitlesAndCities = function() {
      showTitles();
      showCities();
    }

    /**
     * Anim and show title arrows
     * @return {void}
     */

    showTitles = function(){
      // add animation on box
      $('.box').addClass('animate');

      TweenMax.staggerTo(".title-map", 1, { x: 500, opacity: 1, ease: Expo.easeOut}, -0.15);
      console.log('show');
    },

    /**
     * Anim and show each objet relative to city (title, date, sprite)
     * @return {void}
     */

      showCities = function(){
        $('.city-animate').show();
        TweenMax.staggerFrom(".city-animate", 1, { y: -200, opacity: 0, ease: Back.easeOut.config(1.7)}, 0.25);
        console.log('show');
      },

    /**
     * Get all exaam using factory
     * @return {void}
     */

    getExams = function() {

      riddleFactory.getExams(function(result) {
        $timeout(function() {
          console.log('exams :'+result.exam1.nom);
          exams = result;
        });
      });

    },

    /**
     * Draw a subject line
     * @param {Int} Number of the line
     * @param {String} Color
     * @param {String} Id of exam
     * @return {void}
     */

    drawLine = function(offset, color, idExam){

      iterate++;

      var cube = document.getElementById('test');
      var position = cube.getBoundingClientRect();
      console.log(position.top);


      $( '.box:nth-child(21n+' + offset + ')').addClass('show ' + color );
      var $line = $('.box:nth-child(21n+' + offset + ')').attr('ng-click', 'showExam("' + idExam + '")');
      $compile($line)($scope);

      var top = $( '.box:nth-child(' + offset + ')').position().top - 230;
      console.log(top);
      $('.wrapper-map').append('<div style="top : ' + top + 'px" id="title-map-' + iterate + '" class="title-map title-map-' + color + '"><p>Histoire de lart</p></div>');
    },

    /**
     * Get all exaam using factory
     * @return {void}
     */

    $scope.showExam = function(id){
      $scope.exam = exams[id];
      $scope.idExam = id;
      $('.exam-header-home').toggleClass('show');
    },

    /**
     * Put the header on top with easing
     * @return {void}
     */

    $scope.goToExam = function(){
      var windowsHeight = $(window).height();
      var navHeight = 45;
      var headerOffset = 170;
      var newPosition = ( navHeight + headerOffset ) * 100 / windowsHeight;
      var newPositionPercentage = newPosition+'%';
      console.log('wh :'+windowsHeight);
      TweenMax.to('.exam-header-home', 1, {top: newPositionPercentage, ease: Power4.easeOut, onComplete:$scope.changeLocation});
    },

    /**
     * Go to the exam view
     * @return {void}
     */

    $scope.changeLocation = function(){
      window.location = '#/exam/'+$scope.idExam;
      $('#header').removeClass('custom-header');
    },

    $scope.init();

  });
