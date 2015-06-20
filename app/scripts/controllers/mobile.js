'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:MobileCtrl
 * @description
 * # MainCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('MobileCtrl', function ($scope, riddleFactory, $compile, $timeout, $location) {

    $scope.init = function() {

      var slider = $('.slider').bxSlider({
        speed : 1,
        controls : false,
        onSliderLoad: function(){

          var newIndex = 0;

          $('.title-explication').click(function(){
            $('video:eq(' + ( newIndex + 1 ) + ')').trigger('play');
            return false;
          });

          $('.title-explication:eq(' + ( newIndex + 1 ) + ')').addClass('active');
          $('.chapo-explication:eq(' + ( newIndex + 1 ) + ')').addClass('active');
          console.log('loaded');
        },
        onSlideAfter: function(slider, index, newIndex){
          $('video:eq(' + ( newIndex + 1 ) + ')').trigger('play');

          $('.title-explication:eq(' + ( index + 1 ) + ')').removeClass('active');
          $('.chapo-explication:eq(' + ( index + 1 ) + ')').removeClass('active');

          $('.title-explication:eq(' + ( newIndex + 1 ) + ')').addClass('active');
          $('.chapo-explication:eq(' + ( newIndex + 1 ) + ')').addClass('active');
        },
        onSlideBefore: function($slideElement, oldIndex, newIndex){
        }
      });

      $('.wrapper-video').click(function(){
        slider.goToNextSlide();
        return false;
      });

    },

    $scope.init();

  });
