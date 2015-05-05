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
    'ngTouch'
  ])
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
      .when('/questions', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl'
      })
      .when('/exam', {
        templateUrl: 'views/exam.html',
        controller: 'ExamCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
