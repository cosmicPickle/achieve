//Setting the server URL
var achieveServerUrl = "http://95.87.205.55/dev/achieve/api/"

angular.module('achieveApp', [
    'ionic', 
    'ionic-color-picker',
    'ngRoute', 
    'ngSanitize',
    'ngCookies',
    'angularFileUpload',
    'achieveApi',
    'achieveArrays',
    'base64ServiceProvider',
    'uiBaseDirectives',
    'uiInputDirectives',
    'achievementControllers',
    'categoryControllers',
    'profileControllers',
    'utilsControllers',
    'taskControllers',
    'personalControllers',
    'angular-svg-round-progress',
    'pascalprecht.translate'])

.run(['$rootScope', '$ionicModal', '$translatePartialLoader', '$translate', '$ionicPlatform', '$ionicLoading','$state', 'Token', function($rootScope, $ionicModal, $translatePartialLoader, $translate, $ionicPlatform, $ionicLoading, $state, Token){
    
    if($state.current.name != 'login')
        Token.view({},function(resp){
            //It's really quite surprising how I managed to code most of this without 
            //having an idea who the user is in the frontend
            if(resp.status > 0)
            {
                $rootScope.currentUser =  resp.data.user;
            }
        });
    
    //Setting the root scope header CSS
    $rootScope.defaultHeaderCss = {
        'background': '#f0b840',
        'color': '#ffffff'
    }
    $rootScope.headerCss = $rootScope.defaultHeaderCss;
    
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
        if(httpLoading)
            $ionicLoading.show({
                content: $translate.instant('loading'),
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        else
            $ionicLoading.hide();
    });
    
    $rootScope.$on('$stateChangeStart', function() {
        $ionicLoading.show({
            content: $translate.instant('loading'),
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    });
   
    $rootScope.$on('$ionicView.beforeLeave', function(){
        $ionicLoading.show({
                content: $translate.instant('loading'),
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
    });
    
    $rootScope.$on('$ionicView.enter', function(){
        $ionicLoading.hide();
    });
}])
.config(['$translateProvider', '$httpProvider', '$translatePartialLoaderProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function($translateProvider, $httpProvider, $translatePartialLoaderProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.templates.maxPrefetch(0);
    $stateProvider
    .state('achievements', {
        url: '',
        abstract: true,
        templateUrl: 'assets/views/partials/categoryTabs.html'
    })
    .state('achievements.categories', {
        url: '/categories/:catAlias',
        cache: false,
        views: {
            'category-achievements': {
              templateUrl: 'assets/views/partials/category.html',
              controller: 'CategoryMainCtrl'
            }
        }
    })
    .state('achievements.categories-achievement', {
        url: '/categories/:catAlias/:achvAlias',
        cache: false,
        views: {
            'category-achievements': {
              templateUrl: 'assets/views/partials/achievementGeneral.html',
              controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('achievements.categories-achievement-task', {
        url: '/categories/:catAlias/:achvAlias/task/:taskAlias',
        cache: false,
        views: {
            'category-achievements': {
              templateUrl: 'assets/views/partials/taskGeneral.html',
              controller: 'TaskMainCtrl'
            }
        }
    })
    .state('achievements.categories-achievement-levels', {
        url: '/categories/:catAlias/:achvAlias/levels',
        cache: false,
        views: {
            'category-achievements': {
              templateUrl: 'assets/views/partials/achievementLevels.html',
              controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('achievements.favourites', {
        url: '/favourites',
        cache: false,
        views: {
            'favourite-achievements': {
              templateUrl: 'assets/views/partials/favourites.html',
              controller: 'FavouritesCtrl'
            }
        }
    })
    .state('achievements.favourites-achievement', {
        url: '/favourites/:achvAlias',
        cache: false,
        views: {
            'favourite-achievements': {
                templateUrl: 'assets/views/partials/achievementGeneral.html',
                controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('achievements.favourites-achievement-task', {
        url: '/favourites/:achvAlias/task/:taskAlias',
        cache: false,
        views: {
            'favourite-achievements': {
                templateUrl: 'assets/views/partials/taskGeneral.html',
                controller: 'TaskMainCtrl'
            }
        }
    })
    .state('achievements.favourites-achievement-levels', {
        url: '/favourites/:achvAlias/levels',
        cache: false,
        views: {
            'favourite-achievements': {
                templateUrl: 'assets/views/partials/achievementLevels.html',
                controller: 'AchievementMainCtrl'
            }
        }
    })
    .state('achievements.personal', {
        url: '/personal',
        cache: false,
        views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/category.html',
                controller: 'CategoryMainCtrl'
            }
        }
    })    
    .state('achievements.personal-achievements', {
        url: '/personal/achievement/:achvAlias',
        cache: false,
        views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/achievementGeneral.html',
                controller: 'AchievementMainCtrl'
            }
        }
    }) 
    .state('achievements.personal-achievements-task', {
        url: '/personal/achievement/:achvAlias/task/:taskAlias',
        cache: false,
        views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/taskGeneral.html',
                controller: 'TaskMainCtrl'
            }
        }
    })  
    .state('achievements.personal-achievements-levels', {
        url: '/personal/achievement/:achvAlias/levels',
        cache: false,
        views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/achievementLevels.html',
                controller: 'AchievementMainCtrl'
            }
        }
    }) 
    .state('achievements.personal-create', {
        url: '/personal/create/',
        cache: false,
         views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/personal.html',
            }
        }
    })  
    .state('achievements.personal-create-quick', {
        url: '/personal/create/quick',
        cache: false,
         views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/personalQuickCreate.html',
                controller: 'PersonalCreateQuickCtrl'
            }
        }
    })  
    .state('achievements.personal-create-task', {
        url: '/personal/create/task/:id',
        cache: false,
         views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/personalCreate.html',
                controller: 'PersonalCreateCtrl'
            }
        }
    })  
    .state('achievements.personal-create-achievement', {
        url: '/personal/create/achievement/:id?:taskId',
        cache: false,
         views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/personalCreate.html',
                controller: 'PersonalCreateCtrl'
            }
        }
    })
    .state('achievements.personal-create-level', {
        url: '/personal/create/level/:id?:achvId',
        cache: false,
        views: {
            'personal-achievements': {
                templateUrl: 'assets/views/partials/personalCreate.html',
                controller: 'PersonalCreateCtrl'
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
    .state('login', {
        url : "/login",
        templateUrl : "assets/views/partials/login.html",
        controller : "LoginController"
    })
    .state('logout', {
        url : "/logout",
        template : "",
        controller : "LogoutController"
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/categories/');
    
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
