  (function() {
    'use strict';

    // angular modules
    angular.module('docKip.services', []);
    angular.module('docKip.controllers', []);

    // require services
    require('./services/users/auth-service');
    require('./services/users/user-service');
    require('./services/role-service');
    require('./services/doc-service');
    require('./services/utils');

    // require controllers
    require('./controllers/users');
    require('./controllers/header');
    require('./controllers/create-account');
    require('./controllers/login');
    require('./controllers/dashboard');
    require('./controllers/user-dialog');


    // require angular messages
    //require('angular-messages');


    angular.module('docKip', [
      'docKip.services',
      'docKip.controllers',
      'ngRoute',
      'ngResource',
      'ngMaterial',
      'ui.router',
      'ngAnimate',
      'ui.gravatar'
      //'ngMessages'

    ])
      .run(['$rootScope', 'Auth', '$state', '$location', 'Users', '$mdSidenav', '$log',
        function($rootScope, Auth, $state, $location, Users, $mdSidenav, $log) {

          // solution #1: on change of state, ensure the user is logged
          // Else redirect to login
          $rootScope.$on('$stateChangeSuccess', fireAuth);

          function fireAuth(ev, toState) {
            if (toState.authenticate && $rootScope.loggedInUser) {
              ev.preventDefault();
              $state.go(toState);
            } else {
              ev.preventDefault();
              $state.go('home');
            }
          }

          // check the use in session and make global the user's details
          Users.getUser().then(function(res) {
            $rootScope.loggedInUser = res;
            $log.info($rootScope.loggedInUser, 'res');
          }, function(err) {
            $log.debug(err);
          });

        }
      ])
      .config(['$locationProvider',
        '$stateProvider',
        '$mdThemingProvider', '$urlRouterProvider', '$httpProvider', 'gravatarServiceProvider',

        function($locationProvider,
          $stateProvider,
          $mdThemingProvider,
          $urlRouterProvider, $httpProvider, gravatarServiceProvider) {

          // gravatar images
          gravatarServiceProvider.defaults = {
            size: 30,
            'default': 'mm'
          };

          // Use https endpoint
          gravatarServiceProvider.secure = true;

          // Set up the states
          $stateProvider
            .state('home', {
              url: '/',
              templateUrl: 'views/home.html',
            })

            .state('dashboard', {
              url: '/users/{id}/dashboard',
              authenticate: true,
              templateUrl: 'views/users/dashboard.html',
              controller: 'DashboardCtrl'
            })

            .state('editProfile.dashboard', {
              url: 'dashboard/{id}/edit',
              authenticate: true,
              views: {
                'inner-view@dashboard': {
                  controller: 'EditProfileCtrl',
                  templateUrl: 'views/edit-profile.html'
                }
              }
            })

            .state('all.dashboard', {
              url: '/{id}/documents',
              authenticate: true,
              views: {
                'inner-view@dashboard': {
                  templateUrl: 'views/users/all-dashboard.html',
                  controller: 'DashboardCtrl'
                }
              }
            })

            .state('404', {
              url: '/404',
              templateUrl: 'views/404.html'
            });

          // when the routes are not found
          $urlRouterProvider.otherwise('/404');

          // Token injector
          $httpProvider.interceptors.push('AuthInterceptor');

          // Theme colors
          $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('brown');

          $locationProvider.html5Mode(true);
        }
      ]);
  })();