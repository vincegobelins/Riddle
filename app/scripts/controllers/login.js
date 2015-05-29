'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('LoginCtrl', function ($scope, riddleFactory) {

    var init, register, email, password;

    init = function() {

    },

    $scope.login = function(){

      email = $('#input-email').val();
      password = $('#input-password').val();

      riddleFactory.login(email, password);

    },

    init();

  });
