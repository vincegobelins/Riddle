'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('MainCtrl', function ($scope, riddleFactory) {

    var init, getExams, initMap, drawLine;
    var iterate = 0;

    init = function() {

      getExams();
      initMap();

    },

    initMap = function(){
      drawLine(1, 'orange');
      drawLine(4, 'green');
      drawLine(8, 'orange');
    },

    getExams = function() {

      $scope.exams = riddleFactory.getExams();

    },

    drawLine = function(offset, color){

      iterate++;

      $( '.box:nth-child(21n+' + offset + ')').addClass('show ' + color );
      var top = $( '.box:nth-child(' + offset + ')').position().top - 230;
      console.log(top);
      $('.wrapper-map').append('<div style="top : ' + top + 'px" id="title-map-' + iterate + '" class="title-map"><p>Histoire de lart</p></div>');
    }

    init();

  });
