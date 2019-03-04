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
    "BDD": "https://riddle-app-learning.firebaseio.com/"
  })
  .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        //$location.path("/home");
      }
    });
  }])
  .controller('AppCtrl', function($scope, $routeParams, riddleFactory, $location) {

    var getUser, getUserId;
    var userId;

    getUserId = function(){
      var auth = riddleFactory.getAuth();
      return auth;
    }

    /**
     * Get User details
     * @return {Object}
     */

    getUser = function(){

      riddleFactory.getAccount(getUserId(), function(result) {
        console.log('test');
        if(result != null){
          $scope.user = result;
          console.log('user'+$scope.user);
        }

      });

    }

    /**
     * Logout
     * @return {void}
     */

    $scope.logout = function(){
      riddleFactory.logout();
      $location.path('#/login');
    },

    /**
     * Go to the previous view
     * @return {void}
     */

    $scope.goBack = function(){
      history.go(-1);
    }

    getUser();

    $( ".navigation-icon-wrapper" ).on( "click", function(e) {

      e.preventDefault();
      $(this).parent('.navigation-wrapper-slide').toggleClass( 'active' );
    });

    $( "nav" ).on( "click", function() {
      $('.navigation-wrapper-slide').toggleClass( 'active' );
    });
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/hello', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/exam/:param/questions', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl'
      })
      .when('/exam/:param/question/:param2', {
        templateUrl: 'views/question.html',
        controller: 'QuestionCtrl'
      })
      .when('/exam/:param', {
        templateUrl: 'views/exam.html',
        controller: 'ExamCtrl',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["riddleFactory", function(riddleFactory) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return riddleFactory.auth().$requireSignIn();
          }]
        }
      })
      .when('/exam/:param/generator/', {
        templateUrl: 'views/generator.html',
        controller: 'GeneratorCtrl'
      })
      .when('/mobile', {
        templateUrl: 'views/mobile.html',
        controller: 'MobileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
