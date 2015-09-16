// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('achieveApp', [
    'ionic', 
    'ionic-datepicker',
    'ionic-color-picker',
    'starter.controllers', 
    'starter.services',
    'ngRoute', 
    'ngSanitize',
    'ngCookies',
    'achieveApi',
    'achieveArrays',
    'achieveWizard',
    'uiBaseDirectives',
    'uiInputDirectives',
    'achievementControllers',
    'categoryControllers',
    'profileControllers',
    'utilsControllers',
    'taskControllers',
    'personalControllers',
    'angular-svg-round-progress',
    'ui.bootstrap',
    'colorpicker.module',
    'pascalprecht.translate'])

.run(['$rootScope', '$ionicModal', '$translatePartialLoader', '$cookies', '$location', '$ionicPlatform', function($rootScope, $ionicModal, $translatePartialLoader, $cookies, $location, $ionicPlatform){
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
    });
  
    $translatePartialLoader.addPart('httpui');
    $rootScope.errors = [];
    $rootScope.errorsModal = {};
    $rootScope.httpLoading = 0;
    
    $ionicModal.fromTemplateUrl('assets/views/directives/errorsModal.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.errorsModal = modal;
    });
    
    $rootScope.$watch('errors', function(errors){
        if(angular.isDefined(errors) && errors.length)
            $rootScope.openErrorsModal();
    });
    
    //Opens up a modal with a date and time picker to input a new history
    $rootScope.openErrorsModal = function() {
        $rootScope.errorsModal.show();
    };

    //Dismisses a modal window
    $rootScope.dismissErrorsModal = function() {
        $rootScope.errors = [];
        $rootScope.errorsModal.hide();
    }
    
    $rootScope.$watch('httpLoading', function(httpLoading){
        $rootScope.httpLoading = httpLoading;
    });
}])
.config(['$translateProvider', '$httpProvider', '$translatePartialLoaderProvider', '$stateProvider', '$urlRouterProvider', function($translateProvider, $httpProvider, $translatePartialLoaderProvider, $stateProvider, $urlRouterProvider) {
    
    $stateProvider
    // setup an abstract state for the tabs directive
    .state('list', {
        url: '/list',
        abstract: true,
        cache: false,
        templateUrl: 'assets/views/partials/listingTabs.html'
    })
    // Each tab has its own nav history stack:
    .state('list.category-achievements', {
        url: '/category/achievements/:alias',
        cache: false,
        views: {
            'list-category-achievements': {
              templateUrl: 'assets/views/partials/category.html',
              controller: 'CategoryMainCtrl'
            }
        }
    })
    .state('list.category-tasks', {
        url: '/category/tasks/:alias',
        cache: false,
        views: {
            'list-category-tasks': {
              templateUrl: 'assets/views/partials/category.html',
              controller: 'CategoryMainCtrl'
            }
        }
    })
    .state('list.favourites', {
        url: '/favourites',
        cache: false,
        views: {
            'list-favourites': {
              templateUrl: 'assets/views/partials/favourites.html',
              controller: 'FavouritesCtrl'
            }
        }
    })
    .state('achievement', {
        url: '/achievement/:alias',
        cache: false,
        abstract: true,
        templateUrl: 'assets/views/partials/achievementTabs.html',
        controller: 'AchievementTabsCtrl'
    })
    .state('achievement.general', {
        url: '',
        views: {
            'achievement-general' : {
                templateUrl: 'assets/views/partials/achievementGeneral.html',
                controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('achievement.levels', {
        url: '/levels',
        views: {
            'achievement-levels' : {
                templateUrl: 'assets/views/partials/achievementLevels.html',
                controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('task', {
        url: '/task/:alias',
        cache: false,
        abstract: true,
        templateUrl: 'assets/views/partials/taskTabs.html',
        controller: 'TaskTabsCtrl'
    })
    .state('task.general', {
        url: '',
        views: {
            'task-general' : {
                templateUrl: 'assets/views/partials/taskGeneral.html',
                controller: 'TaskMainCtrl'
            }
        }
    })
    .state('task.achievements', {
        url: '/achievements',
        views: {
            'task-achievements' : {
                templateUrl: 'assets/views/partials/taskAchievements.html',
                controller: 'TaskMainCtrl'
            }
        }
    })
    .state('profile', {
        url: '/profile',
        abstract: true,
        templateUrl: 'assets/views/partials/profileTabs.html'
    })
    .state('profile.general', {
        url: '/general',
        views: {
            'profile-general': {
              templateUrl: 'assets/views/partials/profileGeneral.html',
              controller: 'ProfileGeneralCtrl'
            }
        }
    })
    .state('profile.stats', {
        url: '/stats',
        views: {
            'profile-stats': {
              templateUrl: 'assets/views/partials/profileStats.html',
              controller: 'ProfileStatsCtrl'
            }
        }
    })
    .state('profile.history', {
        url: '/history',
        views: {
            'profile-history': {
              templateUrl: 'assets/views/partials/profileHistory.html',
              controller: 'ProfileHistoryCtrl'
            }
        }
    })
    .state('locale', {
        url : '/locale',
        templateUrl : 'assets/views/partials/changeLocale.html',
        controller : 'LocaleController'
    })
    .state('personal', {
        url: '/personal/create',
        abstract: true,
        cache: false,
        templateUrl: 'assets/views/partials/personalTabs.html'
    })
    .state('personal.create', {
        url : "",
        templateUrl : 'assets/views/partials/personal.html',
    })
    .state('personal.create-category', {
        url : "/category/:id",
        views: {
            'personal-create-category': {
              templateUrl: 'assets/views/partials/personalCreate.html',
              controller: 'PersonalCreateCtrl'
            }
        }
    })
    .state('personal.create-task', {
        url : "/task/:id",
        views: {
            'personal-create-task': {
              templateUrl: 'assets/views/partials/personalCreate.html',
              controller: 'PersonalCreateCtrl'
            }
        }
    })
    .state('personal.create-achievement', {
        url : "/achievement/:id",
        views: {
            'personal-create-achievement': {
              templateUrl: 'assets/views/partials/personalCreate.html',
              controller: 'PersonalCreateCtrl'
            }
        }
    })
    .state('personal.create-level', {
        url : "/level/:id",
        views: {
            'personal-create-level': {
              templateUrl: 'assets/views/partials/personalCreate.html',
              controller: 'PersonalCreateCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/list/category/achievements/');
    
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'assets/lang/{lang}/{part}.json'
    });
    
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('ui-base');
    
    //Uncomment the following lines to allow cross domain requests. This will mainly
    //be used for the mobile version in order to allow remote requests to the API
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    //Registering the response interceptor to redirect to login if we get a request 
    //that is unouthorized
    $httpProvider.interceptors.push(['$q', '$location', '$rootScope', '$injector', function($q, $location, $rootScope, $injector) {
        return {
            'request': function (config) {
                $rootScope.httpLoading = true;
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                $rootScope.http = $rootScope.http || $injector.get('$http');
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                return $q.reject(rejection);
            },
            'response' : function(response) {
                if(response.data.status == -1)
                {
                    $location.path('/login');
                }
                if(response.data.status == 0)
                {
                    $rootScope.errors = response.data.errors;
                }
                
                $rootScope.http = $rootScope.http || $injector.get('$http');
                
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                
                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                $rootScope.http = $rootScope.http || $injector.get('$http');
                
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                
                return $q.reject(rejection);
            }
        };
    }]);
}]);
