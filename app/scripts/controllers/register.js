'use strict';

/**
 * @ngdoc function
 * @name RiddleApp.controller:RegisterCtrl
 * @description
 * # LoginCtrl
 * Controller of the RiddleApp
 */
angular.module('RiddleApp')
  .controller('RegisterCtrl', function ($scope, riddleFactory) {

    var init, register, email, surname, photo, name, password;

    init = function() {

    },

      $scope.register = function(){

        name = $('#input-name').val();
        surname = $('#input-surname').val();
        photo = $('#input-photo').val();
        email = $('#input-email').val();
        password = $('#input-password').val();

        riddleFactory.setAccount(email, password, name, surname, photo);

      },

      init();

  });
