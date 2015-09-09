var achieveApp = angular.module('achieveApp', [
    'ngRoute', 
    'ngSanitize',
    'achieveApi',
    'achieveArrays',
    'achieveWizard',
    'uiBaseDirectives',
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

achieveApp.config(['$routeProvider', '$translateProvider', '$httpProvider', function($routeProvider, $translateProvider, $httpProvider) {
        
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
                    '/personal/create/' : {
                        link : '#personal/create',
                        icon : 'fa-plus-circle',
                        lable : 'createNew'
                    },
                }
            }
        })
        .when('/personal/create/', {
            templateUrl : 'assets/views/partials/personalCreate.html',
            controller : 'PersonalCreateCtrl',
        })
        .when('/personal/create/achievement', {
            templateUrl : 'assets/views/partials/personalAchievementCreate.html',
            controller : 'PersonalAchievementCreateCtrl',
        })
        .when('/personal/create/category', {
            templateUrl : 'assets/views/partials/personalCategoryCreate.html',
            controller : 'PersonalCategoryCreateCtrl',
        })
        .when('/personal/create/task', {
            templateUrl : 'assets/views/partials/personalTaskCreate.html',
            controller : 'PersonalTaskCreateCtrl',
        })
        .when('/personal/create/level', {
            templateUrl : 'assets/views/partials/personalLevelCreate.html',
            controller : 'PersonalLevelCreateCtrl',
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
                    window.location = $location.absUrl().split('index.html')[0] + 'login.html';
                if(response.data.status == 0)
                    $rootScope.errors = response.data.errors;
                
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