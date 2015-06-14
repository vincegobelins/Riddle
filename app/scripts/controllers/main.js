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

    var getExams, initMap, drawLine, showTitles, changeLocation;
    var exams;
    var iterate = 0;

    $scope.init = function() {

      getExams();
      initMap();

    },

    initMap = function(){

      drawLine(6, 'green', 'exam2');
      drawLine(10, 'orange', 'exam1');

      $('.bloc-map').mousemove(function( event ) {

        var blocWidth = 115;

        var step = Math.floor(event.pageY / blocWidth);
        var value = ( blocWidth + 0.3 ) * step;

        $('#cta-new').css('top', value);

      });

      $('.title-map').css('left', '-500px');

      var box = $('.box').toArray();
      box.sort(function(){return 0.5-Math.random()});
      TweenMax.staggerFrom(box, 1, { y:-100, x:100, opacity: 0}, 0.005, showTitles);


    },

    showTitles = function(){
      // add animation on box
      $('.box').addClass('animate');

      TweenMax.staggerTo(".title-map", 1, { x: 500, opacity: 1}, -0.25);
      console.log('show');
    },

    getExams = function() {

      riddleFactory.getExams(function(result) {
        $timeout(function() {
          console.log('exams :'+result.exam1.nom);
          exams = result;
        });
      });

    },

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
      $('.wrapper-map').append('<div style="top : ' + top + 'px" id="title-map-' + iterate + '" class="title-map"><p>Histoire de lart</p></div>');
    },

    $scope.showExam = function(id){
      $scope.exam = exams[id];
      $scope.idExam = id;
      $('.exam-header-home').toggleClass('show');
    },

    $scope.goToExam = function(){
      TweenMax.to('.exam-header-home', 1, {top: '21.5%', ease: Power4.easeOut, onComplete:$scope.changeLocation});
    }

    $scope.init();

    $scope.changeLocation = function(){
      window.location = '#/exam/'+$scope.idExam;
    }

  });
