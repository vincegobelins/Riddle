'use strict';

/**
 * @ngdoc overview
 * @name RiddleApp
 * @description
 * # RiddleApp
 *
 * Main module of the application.
 */
angular
  .module('RiddleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .constant("config", {
    "BDD": "https://torrid-inferno-6220.firebaseio.com/"
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/questions/:param', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl'
      })
      .when('/exam/:param', {
        templateUrl: 'views/exam.html',
        controller: 'ExamCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
