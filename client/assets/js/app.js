var achieveApp = angular.module('achieveApp', [
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
    'ui-iconpicker',
    'colorpicker.module',
    'pascalprecht.translate']);

achieveApp.config(['$routeProvider', '$translateProvider', '$httpProvider', '$translatePartialLoaderProvider', function($routeProvider, $translateProvider, $httpProvider, $translatePartialLoaderProvider) {
        
    $routeProvider
        .when('/favourites', {
            templateUrl : 'assets/views/partials/favourites.html',
            controller : 'FavouritesCtrl',
            menu : {
                icon : 'fa-home',
                lable : 'myStuff',
                nested : true,
                items : {
                    '/favourites/' : {
                        link : '#favourites/',
                        icon : 'fa-heart',
                        lable : 'favourites'
                    },
                    '/personal/' : {
                        link : '#personal',
                        icon : 'fa-plus-circle',
                        lable : 'createNew'
                    },
                }
            }
        })
        .when('/personal', {
            templateUrl : 'assets/views/partials/personal.html',
            controller : 'PersonalMainCtrl'
        })
        .when('/personal/create/:type/:id?', {
            templateUrl : 'assets/views/partials/personalCreate.html',
            controller : 'PersonalCreateCtrl',
        })
        .when('/category/:type/:alias?', {
            templateUrl : 'assets/views/partials/category.html',
            controller : 'CategoryMainCtrl',
            menu : {
                icon : 'fa-folder',
                lable : 'categories',
                link : '#category/achievements/',
                nested : false,
                items : {
                    '/category/achievements/' : {
                        link : '#category/achievements/',
                        icon : 'fa-calendar-check-o',
                        lable : 'categoryAchievements'
                    },
                    '/category/tasks/' : {
                        link : '#category/tasks/',
                        icon : 'fa-tasks',
                        lable : 'categoryTasks'
                    }
                }
            }
        })
        .when('/achievement/:alias', {
            templateUrl : 'assets/views/partials/achievement.html',
            controller : 'AchievementMainCtrl'
        })
        .when('/task/:alias', {
            templateUrl : 'assets/views/partials/task.html',
            controller : 'TaskMainCtrl'
        })
        .when('/profile/general/:user?', {
            templateUrl : 'assets/views/partials/profileGeneral.html',
            controller : 'ProfileGeneralCtrl',
            menu : {
                icon : 'fa-cog',
                lable : 'profile',
                nested : true,
                items : {
                    '/profile/general/' : {
                        link : '#profile/general/',
                        icon : 'fa-user',
                        lable : 'generalProfile'
                    },
                    '/profile/stat/' : {
                        link : '#profile/stats/',
                        icon : 'fa-line-chart',
                        lable : 'statProfile'
                    },
                    '/profile/history/' : {
                        link : '#profile/history/',
                        icon : 'fa-calendar',
                        lable : 'historyProfile'
                    }
                }
            }
        })
        .when('/profile/stats/:user?', {
            templateUrl : 'assets/views/partials/profileStats.html',
            controller : 'ProfileStatsCtrl',
        })
        .when('/profile/history/:user?', {
            templateUrl : 'assets/views/partials/profileHistory.html',
            controller : 'ProfileHistoryCtrl',
        })
        .when('/404', {
            templateUrl : 'assets/views/partials/404.html',
        })
        .otherwise({
            redirectTo : '/404'   
        });
    
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'assets/lang/{lang}/{part}.json'
    });
    
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('ui-base');
    
    //Uncomment the following lines to allow cross domain requests. This will mainly
    //be used for the mobile version in order to allow remote requests to the API
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
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
                    window.location = window.location.origin + window.location.pathname.replace('index.html', '') + 'login.html';
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
}]).run(['$rootScope', '$modal', '$translatePartialLoader', '$cookies', '$location', function($rootScope, $modal, $translatePartialLoader, $cookies, $location){
    
    $translatePartialLoader.addPart('httpui');
    $rootScope.errors = [];
    $rootScope.errorsModal = {};
    $rootScope.httpLoading = 0;
    
    $rootScope.$watch('errors', function(errors){
        if(angular.isDefined(errors) && errors.length)
            $rootScope.openErrorsModal();
    });
    
    $rootScope.$watch('httpLoading', function(httpLoading){
        $rootScope.httpLoading = httpLoading;
    });
    
    //Opens up a modal with a date and time picker to input a new history
    $rootScope.openErrorsModal = function() {
        $rootScope.errorsModal = $modal.open({
            animation: true,
            templateUrl: 'assets/views/directives/errorsModal.html',
            scope : $rootScope,
            controller : ['$scope', function($scope) {
            }],
            resolve: {
            }
        });
    };

    //Dismisses a modal window
    $rootScope.dismissErrorsModal = function() {
        $rootScope.errors = [];
        $rootScope.errorsModal.dismiss('closed')
    }
    
    //Creating a history so we can have a nice back button
    $rootScope.history = $cookies.getObject('history') || [];
    
    $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) {
        if(!previousRoute)
            return;
        
        var repeated = -1;
        if((repeated = $rootScope.history.indexOf($location.$$path)) < 0)
            $rootScope.history.push($location.$$path);
        else
            do
            {
                $rootScope.history.pop();
            }    
            while($rootScope.history.length - 1 > repeated)
        
        $cookies.putObject('history', $rootScope.history)
    });
    
    $rootScope.goBack = function(def) {
        if($rootScope.history.length <= 1)
            $location.path(def);
        
        $location.path($rootScope.history[$rootScope.history.length - 2]);
    }
}]);