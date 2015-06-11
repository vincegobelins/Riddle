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
      drawLine(2, 'orange');
      drawLine(6, 'green');
      drawLine(10, 'orange');

      $('.bloc-map').mousemove(function( event ) {

        var blocWidth = 115;

        var step = Math.floor(event.pageY / blocWidth);
        var value = ( blocWidth + 0.3 ) * step;

        $('#cta-new').css('top', value);

      });

      $(".box").each(function(index) {
        $(this).delay(20 * (Math.random()*100)).fadeIn(function() {
          $(this).addClass('anim-box');
        });
      });
    },

    getExams = function() {

      $scope.exams = riddleFactory.getExams();

    },

    drawLine = function(offset, color){

      iterate++;

      var cube = document.getElementById('test');
      var position = cube.getBoundingClientRect();
      console.log(position.top);


      $( '.box:nth-child(21n+' + offset + ')').addClass('show ' + color );
      var top = $( '.box:nth-child(' + offset + ')').position().top - 230;
      console.log(top);
      $('.wrapper-map').append('<div style="top : ' + top + 'px" id="title-map-' + iterate + '" class="title-map"><p>Histoire de lart</p></div>');
    }

    init();

  });
